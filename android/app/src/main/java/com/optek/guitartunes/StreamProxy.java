// Largely taken from:
// https://stackoverflow.com/a/5432091/5421

package com.optek.guitartunes;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;

import java.util.Arrays;

import com.bigswing.Crypto;
import com.bigswing.Crypto.Decryptor;

import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.ShortBufferException;
import java.security.InvalidKeyException;
import java.security.InvalidAlgorithmParameterException;

import android.os.AsyncTask;
import android.os.Looper;
import android.util.Log;

public class StreamProxy implements Runnable {

  private static final String TAG = "GT-WebServer";

  private static final int SERVER_PORT = 8888;

  private Thread thread;
  private boolean isRunning;
  private ServerSocket socket;
  private int port;

  private static final String KEY_ALGORITHM = "AES";
  private static final byte CIPHER_STREAM_VERSION = 1;
  private static final String CIPHER_ALGORITHM = "AES/CTR/NoPadding";

  private Crypto crypto;

  public StreamProxy() {
    // Create listening socket
    try {
      socket = new ServerSocket(SERVER_PORT, 0, InetAddress.getByAddress(new byte[] { 127, 0, 0, 1 }));
      socket.setSoTimeout(5000);
      port = socket.getLocalPort();
    } catch (UnknownHostException e) { // impossible
    } catch (IOException e) {
      Log.e(TAG, "IOException initializing server", e);
    }

  }

  public void start() {
    thread = new Thread(this);
    thread.start();
  }

  public void stop() {
    isRunning = false;
    if (socket != null) {
      try {
        socket.close();
        socket = null;
      } catch (Exception e) {
      }
    }
    thread.interrupt();
    try {
      thread.join(5000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @Override
  public void run() {
    Looper.prepare();
    crypto = new Crypto(false);
    isRunning = true;
    while (isRunning) {
      try {
        Socket client = socket.accept();
        if (client == null) {
          continue;
        }
        Log.d(TAG, "client connected");

        StreamToMediaPlayerTask task = new StreamToMediaPlayerTask(client);
        if (task.processRequest()) {
          task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        }

      } catch (SocketTimeoutException e) {
        // Do nothing
      } catch (IOException e) {
        Log.e(TAG, "Error connecting to client", e);
      }
    }
    Log.d(TAG, "Proxy interrupted. Shutting down.");
  }

  private class StreamToMediaPlayerTask extends AsyncTask<String, Void, Integer> {

    String localPath;
    Socket client;
    int cbSkip;

    public StreamToMediaPlayerTask(Socket client) {
      this.client = client;
    }

    public String readTextStreamAvailable(InputStream inputStream) throws IOException {
      byte[] buffer = new byte[4096];
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream(4096);

      // Do the first byte via a blocking read
      outputStream.write(inputStream.read());

      // Slurp the rest
      int available = inputStream.available();

      while (available > 0) {
        int cbToRead = Math.min(buffer.length, available);
        int cbRead = inputStream.read(buffer, 0, cbToRead);
        if (cbRead <= 0) {
          throw new IOException("Unexpected end of stream");
        }
        outputStream.write(buffer, 0, cbRead);
        available -= cbRead;
      }
      return new String(outputStream.toByteArray());
    }

    public boolean processRequest() {
      // Read HTTP headers
      String headers = "";
      try {
        headers = readTextStreamAvailable(client.getInputStream());
      } catch (IOException e) {
        Log.e(TAG, "Error reading HTTP request header from stream:", e);
        return false;
      }

      // Get the important bits from the headers
      String[] headerLines = headers.split("\n");
      String urlLine = headerLines[0];
      if (!urlLine.startsWith("GET ")) {
        Log.e(TAG, "Only GET is supported");
        return false;
      }
      urlLine = urlLine.substring(4);
      int charPos = urlLine.indexOf(' ');
      if (charPos != -1) {
        urlLine = urlLine.substring(1, charPos);
      }
      localPath = urlLine;

      Log.d(TAG, "localPath: " + localPath);

      // See if there's a "Range:" header
      for (int i = 0; i < headerLines.length; i++) {
        String headerLine = headerLines[i];
        if (headerLine.startsWith("Range: bytes=")) {
          Log.d(TAG, "Range header was sent: " + headerLine);
          headerLine = headerLine.substring(13);
          charPos = headerLine.indexOf('-');
          if (charPos > 0) {
            headerLine = headerLine.substring(0, charPos);
          }
          cbSkip = Integer.parseInt(headerLine);
        }
      }
      return true;
    }

    @Override
    protected Integer doInBackground(String... sParams) {

      File localFile = new File("/" + localPath);
      String[] tokens = localPath.split("/");
      String filename = tokens[tokens.length - 1];
      // Log.d(TAG, "filename: " + filename);
      OutputStream output = null;

      if (localFile.exists()) {
        try {
          FileInputStream inputFile = new FileInputStream(localFile);
          byte[] key = crypto.generateKey(filename);
          Decryptor decryptor = crypto.createDecryptor(inputFile, key);

          int streamLength = decryptor.available();
          Log.d(TAG, "streamLength: " + streamLength);

          long cbToSend = streamLength - cbSkip;
          // Log.d(TAG, "cbToSend: " + cbToSend);

          byte[] buff = new byte[64 * 1024];
          int cbSentThisBatch = 0;

          // Loop as long as there's stuff to send
          while (isRunning && cbToSend > 0 && !client.isClosed()) {

            // See if there's more to send
            // File file = new File(localPath);

            String headers = "";
            // Create HTTP header
            if (cbSkip > 0) {// It is a seek or skip request if there's a Range
              // header
              headers += "HTTP/1.1 206 Partial Content\r\n";
              headers += "Content-Type: " + "video/mp4" + "\r\n";
              headers += "Accept-Ranges: bytes\r\n";
              headers += "Content-Length: " + cbToSend + "\r\n";
              headers += "Content-Range: bytes " + cbSkip + "-" + (streamLength - 1) + "/" + streamLength + "\r\n";
              headers += "Connection: Keep-Alive\r\n";
              headers += "\r\n";
            } else {
              headers += "HTTP/1.1 200 OK\r\n";
              headers += "Content-Type: " + "video/mp4" + "\r\n";
              headers += "Accept-Ranges: bytes\r\n";
              headers += "Content-Length: " + cbToSend + "\r\n";
              headers += "Connection: Keep-Alive\r\n";
              headers += "\r\n";
            }

            output = new BufferedOutputStream(client.getOutputStream(), 32 * 1024);
            output.write(headers.getBytes());
            output.flush();

            // Log.d(TAG, "cbSkip: " + cbSkip);

            decryptor.skip(cbSkip);
            int cbToSendThisBatch = decryptor.available();

            // Log.d(TAG, "cbToSendThisBatch: " + cbToSendThisBatch);

            int cBatch = 1;

            while (cbToSendThisBatch > 0) {
              // Log.i(TAG, "sending batch " + cBatch++);
              // Log.i(TAG, "  " + cbToSendThisBatch);
              int cbToRead = Math.min(cbToSendThisBatch, buff.length);
              int cbRead = decryptor.read(buff, 0, cbToRead);
              // Log.i(TAG, "  read: " + cbRead);
              if (cbRead == -1) {

                Log.i(TAG, "no batches left");
                break;
              }
              cbToSendThisBatch -= cbRead;
              cbToSend -= cbRead;
              output.write(buff, 0, cbRead);
              // output.flush();

              Log.i(TAG, "  wrote output");
              // output.flush();
              // Log.i(TAG, "  flushed output");
              cbSkip += cbRead;
              cbSentThisBatch += cbRead;
              Log.i(TAG, "  sent this batch: " + cbSentThisBatch);
            }

            output.flush();
            output.close();

            Log.d(TAG, "closing file and decryptor");
            inputFile.close();
            decryptor.close();
          }

          // Log.i(TAG, "sent this batch: " + cbSentThisBatch);

          // If we did nothing this batch, block for a second
          if (cbSentThisBatch == 0) {
            Log.d(TAG, "Blocking until more data appears");
            Thread.sleep(1000);
          }
        } catch (SocketException socketException) {
          Log.e(TAG, "SocketException() thrown, proxy client has probably closed. This can exit harmlessly: "
              + socketException.getLocalizedMessage());
        } catch (Exception e) {
          Log.e(TAG, "Exception thrown from streaming task:");
          Log.e(TAG, e.getClass().getName() + " : " + e.getLocalizedMessage());
          e.printStackTrace();
        }
      } else {
        // file does not exist
        Log.w(TAG, "file does not exist");
      }

      // Cleanup
      try {
        if (output != null) {
          output.close();
        }
        Log.d(TAG, "closing client");
        client.close();
      } catch (IOException e) {
        Log.e(TAG, "IOException while cleaning up streaming task:");
        Log.e(TAG, e.getClass().getName() + " : " + e.getLocalizedMessage());
        e.printStackTrace();
      }

      Log.d(TAG, "end of doInBG");
      return 1;
    }
  }
}
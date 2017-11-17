package com.bigswing;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.security.spec.AlgorithmParameterSpec;
import java.security.spec.KeySpec;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import com.optek.guitartunes.GTCrypto;

import javax.crypto.ShortBufferException;
import java.security.InvalidKeyException;
import java.security.InvalidAlgorithmParameterException;

import android.util.Log;

public class Crypto {
  private static final String TAG = "GT-WebServer";

  private static final String KEY_ALGORITHM = "AES";
  private static final String DERIVATION_ALGORITHM = "PBKDF2WithHmacSHA1";
  private static final int AES_BLOCK_SIZE = 16;
  /*
   * Useful fast algorithm that doesn't change the length of the data w/
   * padding.
   * AES/GCM would be excellent and would offer corruption-manipulation, but
   * this would be more challenging to integrate since Android does not ship
   * with it by default.
   */
  private static final String CIPHER_ALGORITHM = "AES/CTR/NoPadding";
  /*
   * 128-bit IV (based on key)
   */
  private static final int IV_LENGTH = 128 / 8;

  /*
   * 128-bit keys should be sufficient, though could be tweaked to 192 or 256
   */
  private static final int KEY_LENGTH = 128 / 8;

  /*
   * Number of iterations - longer = more secure but slower to convert PW -> key
   */
  private static final int ITERATION_COUNT = 1000;

  /* SecureRandom - somewhat expensive to construct, but thread-safe */
  private static final SecureRandom RNG = new SecureRandom();
  /* 8 random bytes for salt is 'pretty good' */
  private static final int SALT_LENGTH = 8;

  public interface SaltSource {
    byte[] getSalt();
  }

  private static class ServerSaltSource implements SaltSource {
    private byte[] getServerSalt() {
      return null;
    }

    private void setServerSalt(byte[] salt) {
    }

    @Override
    public byte[] getSalt() {
      byte[] salt = getServerSalt();
      if (null == salt) {
        salt = new byte[SALT_LENGTH];
        RNG.nextBytes(salt);
        setServerSalt(salt);
      }
      return salt;
    }
  }

  private static class ApplicationSaltSource implements SaltSource {
    @Override
    public byte[] getSalt() {
      return GTCrypto.appSalt;
    }
  }

  private final SaltSource saltSource;

  public Crypto(boolean useServerSalt) {
    /*
     * Could very well be a user preference, if 'strong' then useServerSalt
     * would be true
     */
    if (useServerSalt) {
      saltSource = new ServerSaltSource();
    } else {
      saltSource = new ApplicationSaltSource();
    }
  }

  public byte[] generateKey(String password) throws GeneralSecurityException {
    byte[] salt = saltSource.getSalt();
    char[] passwordChars = password.toCharArray();
    final int keyBitLength = KEY_LENGTH * 8;
    PBEKeySpec keySpec = new PBEKeySpec(passwordChars, salt, ITERATION_COUNT, keyBitLength);
    SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DERIVATION_ALGORITHM);
    return keyFactory.generateSecret(keySpec).getEncoded();
  }

  /**
   * Construct a new decryption stream.
   * @param input stream to read from
   * @param key to use for decryption
   * @return wrapped input stream to operate on
   * @throws IOException
   * @throws GeneralSecurityException
   */
  public Decryptor createDecryptor(InputStream input, byte[] key) throws IOException, GeneralSecurityException {

    /* Read out version field - useful to add in case you want to change cipher later */
    if (input.read() != 1) {
      throw new Error("Unknown data format");
    }

    /* Read out IV - random for every encrypted form */
    byte[] iv = new byte[16];
    if (16 != input.read(iv)) {
      throw new Error("Data too short");
    }

    Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
    SecretKeySpec keySpec = new SecretKeySpec(key, KEY_ALGORITHM);
    IvParameterSpec params = new IvParameterSpec(iv);
    cipher.init(Cipher.DECRYPT_MODE, keySpec, params);
    // CipherInputStream cipherStream = new CipherInputStream(input, cipher);

    Decryptor decryptor = new Decryptor(input, cipher, keySpec, params);

    return decryptor;
  }

  /*
   *
   * 
   * https://stackoverflow.com/a/23744623/5421
   * 
   * 
   */
  public static final void jumpToOffset(final Cipher c, final SecretKey aesKey, final IvParameterSpec iv,
      final long offset) {
    if (!c.getAlgorithm().toUpperCase().startsWith("AES/CTR")) {
      throw new IllegalArgumentException("Invalid algorithm, only AES/CTR mode supported");
    }

    if (offset < 0) {
      throw new IllegalArgumentException("Invalid offset");
    }

    final int skip = (int) (offset % AES_BLOCK_SIZE);
    final IvParameterSpec calculatedIVForOffset = calculateIVForOffset(iv, offset - skip);
    try {
      c.init(Cipher.DECRYPT_MODE, aesKey, calculatedIVForOffset);
      final byte[] skipBuffer = new byte[skip];
      c.update(skipBuffer, 0, skip, skipBuffer);
      Arrays.fill(skipBuffer, (byte) 0);
    } catch (ShortBufferException | InvalidKeyException | InvalidAlgorithmParameterException e) {
      throw new IllegalStateException(e);
    }
  }

  private static IvParameterSpec calculateIVForOffset(final IvParameterSpec iv, final long blockOffset) {
    final BigInteger ivBI = new BigInteger(1, iv.getIV());
    final BigInteger ivForOffsetBI = ivBI.add(BigInteger.valueOf(blockOffset / AES_BLOCK_SIZE));

    final byte[] ivForOffsetBA = ivForOffsetBI.toByteArray();
    final IvParameterSpec ivForOffset;
    if (ivForOffsetBA.length >= AES_BLOCK_SIZE) {
      ivForOffset = new IvParameterSpec(ivForOffsetBA, ivForOffsetBA.length - AES_BLOCK_SIZE, AES_BLOCK_SIZE);
    } else {
      final byte[] ivForOffsetBASized = new byte[AES_BLOCK_SIZE];
      System.arraycopy(ivForOffsetBA, 0, ivForOffsetBASized, AES_BLOCK_SIZE - ivForOffsetBA.length,
          ivForOffsetBA.length);
      ivForOffset = new IvParameterSpec(ivForOffsetBASized);
    }

    return ivForOffset;
  }

  public static class Decryptor extends CipherInputStream {
    private InputStream mUpstream;
    private Cipher mCipher;
    private SecretKeySpec mSecretKeySpec;
    private IvParameterSpec mIvParameterSpec;

    public Decryptor(InputStream inputStream, Cipher cipher, SecretKeySpec secretKeySpec,
        IvParameterSpec ivParameterSpec) {
      super(inputStream, cipher);
      mUpstream = inputStream;
      mCipher = cipher;
      mSecretKeySpec = secretKeySpec;
      mIvParameterSpec = ivParameterSpec;
    }

    @Override
    public int read(byte[] b, int off, int len) throws IOException {
      return super.read(b, off, len);
    }

    @Override
    public long skip(long bytesToSkip) throws IOException {
      long skipped = mUpstream.skip(bytesToSkip);
      jumpToOffset(mCipher, mSecretKeySpec, mIvParameterSpec, bytesToSkip);
      return skipped;
    }

    @Override
    public int available() throws IOException {
      return mUpstream.available();
    }
  }
}
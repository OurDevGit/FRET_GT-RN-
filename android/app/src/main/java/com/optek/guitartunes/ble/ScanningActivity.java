package com.optek.guitartunes.ble;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.optek.fretlight.sdk.Fretlight;
import com.optek.fretlight.sdk.FretlightClient;
import com.optek.fretlight.sdk.FretlightGuitar;

public class ScanningActivity extends Activity {
  private static final int ENABLE_BT_REQUEST_ID = 1;

  private FretlightClient mFretlightClient;
  private FretlightClient.Delegate mFretlightClientDelegate = new FretlightClientDelegate();
  private FretlightGuitar.Delegate mGuitarDelegate = new GuitarDelegate();
  private Guitars mGuitars;
  private GuitarEmitter guitarEmitter;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    Log.d("GTGuitarController", "onCreate()");
    super.onCreate(savedInstanceState);

    mGuitars = Guitars.getInstance();
    guitarEmitter = GuitarEmitter.getInstance();

    // Enable Fretlight logging.
    Fretlight.setLogDelegate(null);

    // Create FretlightClient.
    mFretlightClient = Fretlight.createClient(this);
    mFretlightClient.setDelegate(mFretlightClientDelegate);

    // Check if we have BLE available.
    if (!mFretlightClient.isBleAvailable()) {
      finishWithResult("MISSING");
    }

    if (getIntent().getBooleanExtra("EXIT", false)) {
      finishWithResult("COMPLETE");
    }

  }

  @Override
  protected void onResume() {
    super.onResume();

    Log.d("GTGuitarController", "onResume()");

    // Check for Bluetooth LE Support. In production, our manifest entry will keep this
    // from installing on these devices, but this will allow test devices or other
    // side loads to report whether or not the feature exists.
    if (!mFretlightClient.isBleAvailable()) {
      finishWithResult("MISSING");
    }

    // On every resume, check if BLE is enabled (user could turn it off while app was in background etc.)
    if (!mFretlightClient.isBleEnabled()) {
      mFretlightClient.askUserToEnableBle(ENABLE_BT_REQUEST_ID);
      // User response will arrive in onActivityResult.
      return;
    }

    // Initialize fretlight client.
    // This will re-acquire the bluetooth hardware.
    mFretlightClient.initialize();

    startScanning();
  }

  @Override
  protected void onStop() {
    Log.d("GTGuitarController", "onStop()");
    super.onStop();
    stopScanning();
  }

  // Check if user agreed to enable BT.
  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    // User didn't want to turn on BT
    Log.d("GTGuitarController", "onActivityResult");
    if (requestCode == ENABLE_BT_REQUEST_ID) {
      if (resultCode == Activity.RESULT_CANCELED) {
        finishWithResult("DISABLED");
        return;
      }
    }
    super.onActivityResult(requestCode, resultCode, data);
  }

  // ------------------------------------------------------------------------
  // Private Implementation
  // ------------------------------------------------------------------------

  private void startScanning() {
    Log.d("GTGuitarController", "startScanning");
    // Start scanning for devices.
    guitarEmitter.emit("BLE_STATUS", "SCANNING");
    mFretlightClient.startScanning();
  }

  private void stopScanning() {
    Log.d("GTGuitarController", "stopScanning");
    mFretlightClient.stopScanning();
  }

  private void handleConnectedGuitar(final FretlightGuitar guitar) {
    Log.d("GTGuitarController", "handleConnectedGuitar");
    // Adding to the UI needs to happen on UI thread.
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        mGuitars.add(guitar);
      }
    });
  }

  private void handleDisconnectedGuitar(final FretlightGuitar guitar) {
    Log.d("GTGuitarController", "handleDisconnectedGuitar");
    // Adding to the UI needs to happen on UI thread.
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        mGuitars.remove(guitar);
      }
    });
  }

  private void finishWithResult(String string) {
    guitarEmitter.emit("BLE_STATUS", string);
    finish();
  }

  // ------------------------------------------------------------------------
  // FretlightClientDelegate
  // ------------------------------------------------------------------------

  private class FretlightClientDelegate extends FretlightClient.Delegate.Adapter {
    @Override
    public void guitarFound(final FretlightGuitar guitar) {
      Log.d("GTGuitarController", "guitarFound");
      guitar.setDelegate(mGuitarDelegate);
      mFretlightClient.connectToGuitar(guitar.getAddress());
    }
  }

  // ------------------------------------------------------------------------
  // GuitarDelegate
  // ------------------------------------------------------------------------

  private class GuitarDelegate extends FretlightGuitar.Delegate.Adapter {
    @Override
    public void guitarConnected(final FretlightGuitar guitar) {
      Log.d("GTGuitarController", "guitarConnected");
      handleConnectedGuitar(guitar);
    }

    @Override
    public void guitarDisconnected(final FretlightGuitar guitar) {
      Log.d("GTGuitarController", "guitarDisconnected");
      handleDisconnectedGuitar(guitar);
    }
  }
}
/******************************************************************************
 *   ____     _____    _______   ______    _  __                              *
 *  / __ \   |  __ \  |__   __| |  ____|  | |/ /    Copyright (c) 2016        *
 * | |  | |  | |__) |    | |    | |__     | ' /     Optek Music Systems, Inc. *
 * | |  | |  |  ___/     | |    |  __|    |  <      All Rights Reserved       *
 * | |__| |  | |         | |    | |____   | . \                               *
 *  \____/   |_|         |_|    |______|  |_|\_\                              *
 *                                                                            *
 ******************************************************************************
 * This software is used under license from Optek. It continues to be valid   *
 * only if you are in compliance with the terms of the SDK license Agreement  *
 * which you have previously agreed to. If you have received this SDK         *
 * illegally you are in violation of its license terms and you must cease all *
 * use of the SDK. A copy of the SDK License Agreement you agreed to can be   *
 * found at http://github.com/FretlightGuitar/fretlightsdk                    *
 ******************************************************************************/

package com.optek.fretlight.sdk;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Handler;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Client access to BluetoothLE device.
 */
class BleClient {
  public interface Delegate {
    Delegate NULL = new Adapter();

    void bleDeviceFound(final BluetoothDevice device);

    void bleDeviceConnected(final BluetoothGatt gatt, final BluetoothDevice device);

    void bleDeviceDisconnected(final BluetoothGatt gatt, final BluetoothDevice device);

    void bleAvailableServicesForDevice(final BluetoothGatt gatt, final BluetoothDevice device,
        final List<BluetoothGattService> services);

    void bleAvailableCharacteristicsForService(final BluetoothGatt gatt, final BluetoothDevice device,
        final BluetoothGattService service, final List<BluetoothGattCharacteristic> characteristics);

    void bleSuccessfulWrite(final BluetoothGatt gatt, final BluetoothDevice device, final BluetoothGattService service,
        final BluetoothGattCharacteristic characteristic, final String description);

    void bleFailedWrite(final BluetoothGatt gatt, final BluetoothDevice device, final BluetoothGattService service,
        final BluetoothGattCharacteristic characteristic, final String description);

    void bleNewRssiAvailable(final BluetoothGatt gatt, final BluetoothDevice device, final int rssi);

    // Adapter class
    class Adapter implements Delegate {
      @Override
      public void bleDeviceFound(final BluetoothDevice device) {
        // DO NOTHING
      }

      @Override
      public void bleDeviceConnected(final BluetoothGatt gatt, final BluetoothDevice device) {
        // DO NOTHING
      }

      @Override
      public void bleDeviceDisconnected(final BluetoothGatt gatt, final BluetoothDevice device) {
        // DO NOTHING
      }

      @Override
      public void bleAvailableServicesForDevice(final BluetoothGatt gatt, final BluetoothDevice device,
          final List<BluetoothGattService> services) {
        // DO NOTHING
      }

      @Override
      public void bleAvailableCharacteristicsForService(final BluetoothGatt gatt, final BluetoothDevice device,
          final BluetoothGattService service, final List<BluetoothGattCharacteristic> characteristics) {
        // DO NOTHING
      }

      @Override
      public void bleSuccessfulWrite(final BluetoothGatt gatt, final BluetoothDevice device,
          final BluetoothGattService service, final BluetoothGattCharacteristic characteristic,
          final String description) {
        // DO NOTHING
      }

      @Override
      public void bleFailedWrite(final BluetoothGatt gatt, final BluetoothDevice device,
          final BluetoothGattService service, final BluetoothGattCharacteristic characteristic,
          final String description) {
        // DO NOTHING
      }

      @Override
      public void bleNewRssiAvailable(final BluetoothGatt gatt, final BluetoothDevice device, final int rssi) {
        // DO NOTHING
      }
    }
  }

  private static final String TAG = "FL-BleClient";

  // Defines (in milliseconds) how often the executor runs.
  private static final long UPDATE_DELAY = 15; // 15 milliseconds

  // Defines (in milliseconds) how often RSSI should be updated.
  private static final int RSSI_UPDATE_TIME_INTERVAL = 10000; // 10 seconds

  // Delegate object through which we are returning results to the caller.
  private Delegate mDelegate = Delegate.NULL;

  private Context mContext;
  private boolean mConnected;
  private String mDeviceAddress;

  private BluetoothManager mBluetoothManager;
  private BluetoothAdapter mBluetoothAdapter;
  private BluetoothDevice mBluetoothDevice;
  private BluetoothGatt mBluetoothGatt;
  private List<BluetoothGattService> mBluetoothGattServices;

  private BleScanner mBleScanner;

  private Handler mTimerHandler = new Handler();
  private boolean mTimerEnabled;

  private final FretlightExecutor mExecutor;

  // Scanner delegate handles new devices that appear during a scan.
  private BleScanner.Delegate mScanDelegate = new BleScanner.Delegate() {
    @Override
    public void onScanSuccess(BluetoothDevice device) {
      mDelegate.bleDeviceFound(device);
      stopScanning();
    }

    @Override
    public void onScanFailure(int errorCode) {
      stopScanning();
    }
  };

  public BleClient(final Context context) {
    mContext = context;
    mExecutor = new FretlightExecutor(UPDATE_DELAY);

    if (initialize()) {
      mBleScanner = BleScanner.create(mBluetoothAdapter, mScanDelegate);
    }
  }

  public FretlightExecutor getExecutor() {
    return mExecutor;
  }

  public void setDelegate(final Delegate delegate) {
    mDelegate = delegate != null ? delegate : Delegate.NULL;
  }

  public void removeDelegate() {
    mDelegate = Delegate.NULL;
  }

  public BluetoothDevice getDevice() {
    return mBluetoothDevice;
  }

  public List<BluetoothGattService> getCachedServices() {
    return mBluetoothGattServices;
  }

  public boolean isConnected() {
    return mConnected;
  }

  // Check if this device has BT and BLE hardware available
  public boolean isBleAvailable() {
    // First check general Bluetooth Hardware:
    // get BluetoothManager...
    final BluetoothManager manager = (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
    if (manager == null) {
      return false;
    }
    // .. and then get adapter from manager
    final BluetoothAdapter adapter = manager.getAdapter();
    if (adapter == null) {
      return false;
    }

    // and then check if BT LE is also available
    boolean hasBLE = mContext.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE);
    return hasBLE;
  }

  // Before any action, check if BT is turned ON and enabled.
  // Call this in onResume to be always sure that BT is ON when your
  // application is put into the foreground
  public boolean isBleEnabled() {
    final BluetoothManager manager = (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
    if (manager == null) {
      return false;
    }

    final BluetoothAdapter adapter = manager.getAdapter();
    if (adapter == null) {
      return false;
    }

    return adapter.isEnabled();
  }

  // Start scanning for BT LE devices around.
  public void startScanning(final UUID service) {
    if (mBleScanner != null) {
      mBleScanner.startScanning(service);
    }
  }

  // stops current scanning
  public void stopScanning() {
    if (mBleScanner != null) {
      mBleScanner.stopScanning();
    }
  }

  // Initialize BLE and get BT Manager & Adapter
  public boolean initialize() {
    if (mBluetoothManager == null) {
      mBluetoothManager = (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
      if (mBluetoothManager == null) {
        return false;
      }
    }

    if (mBluetoothAdapter == null) {
      mBluetoothAdapter = mBluetoothManager.getAdapter();
    }

    return mBluetoothAdapter != null;
  }

  public boolean connect(final BluetoothDevice device) {
    return connect(device.getAddress());
  }

  // Connect to the device with specified address
  public boolean connect(final String deviceAddress) {
    if (mBluetoothAdapter == null || deviceAddress == null) {
      return false;
    }
    mDeviceAddress = deviceAddress;

    // Check if we need to connect from scratch or just reconnect to previous device
    if (mBluetoothGatt != null && mBluetoothGatt.getDevice().getAddress().equals(deviceAddress)) {
      // Just reconnect
      return mBluetoothGatt.connect();
    } else {
      // Connect from scratch
      // Get BluetoothDevice object for specified address
      mBluetoothDevice = mBluetoothAdapter.getRemoteDevice(mDeviceAddress);
      if (mBluetoothDevice == null) {
        Log.d(TAG, "That device (address: %s) is not available!", mDeviceAddress);
        return false;
      }
      // Connect with remote device
      mBluetoothGatt = mBluetoothDevice.connectGatt(mContext, false, mBleCallback);
    }
    return true;
  }

  // Disconnect the device. It is still possible to reconnect to it later with this Gatt client
  public void disconnect() {
    if (mBluetoothGatt != null) {
      mBluetoothGatt.disconnect();
    }
  }

  // Close client completely
  public void close() {
    if (mBluetoothGatt != null) {
      mBluetoothGatt.close();
    }
    mBluetoothGatt = null;
  }

  // Request new RSSi value for the connection
  public void readPeriodicallyRssiValue(final boolean repeat) {
    mTimerEnabled = repeat;
    // Check if we should stop checking RSSI value
    if (!mConnected || mBluetoothGatt == null || !mTimerEnabled) {
      mTimerEnabled = false;
      return;
    }

    mTimerHandler.postDelayed(new Runnable() {
      @Override
      public void run() {
        if (mBluetoothGatt == null || mBluetoothAdapter == null || !mConnected) {
          mTimerEnabled = false;
          return;
        }

        // Request RSSI value
        mBluetoothGatt.readRemoteRssi();
        // Add call it once more in the future
        readPeriodicallyRssiValue(mTimerEnabled);
      }
    }, RSSI_UPDATE_TIME_INTERVAL);
  }

  // Starts monitoring RSSI value
  public void startMonitoringRssiValue() {
    readPeriodicallyRssiValue(true);
  }

  // Stops monitoring of RSSI value
  public void stopMonitoringRssiValue() {
    readPeriodicallyRssiValue(false);
  }

  // Request to discover all services available on the remote devices
  // results are delivered through callback object
  public void startServicesDiscovery() {
    if (mBluetoothGatt != null) {
      mBluetoothGatt.discoverServices();
    }
  }

  // Gets services and calls UI callback to handle them
  // before calling getServices() make sure service discovery is finished!
  public void getSupportedServices() {
    if (mBluetoothGattServices != null && mBluetoothGattServices.size() > 0) {
      mBluetoothGattServices.clear();
    }
    // Keep reference to all services in local array
    if (mBluetoothGatt != null) {
      mBluetoothGattServices = mBluetoothGatt.getServices();
    }

    mDelegate.bleAvailableServicesForDevice(mBluetoothGatt, mBluetoothDevice, mBluetoothGattServices);
  }

  // Get all characteristic for particular service and pass them to the UI callback
  public void getCharacteristicsForService(final BluetoothGattService service) {
    if (service == null) {
      return;
    }
    final List<BluetoothGattCharacteristic> chars = service.getCharacteristics();
    mDelegate.bleAvailableCharacteristicsForService(mBluetoothGatt, mBluetoothDevice, service, chars);
  }

  // Set new value for particular characteristic
  public void writeDataToCharacteristic(final BluetoothGattCharacteristic characteristic, final byte[] dataToWrite) {
    if (mBluetoothAdapter == null || mBluetoothGatt == null || characteristic == null) {
      return;
    }

    // first set it locally....
    characteristic.setValue(dataToWrite);

    // ... and then "commit" changes to the peripheral
    mBluetoothGatt.writeCharacteristic(characteristic);
  }

  // ------------------------------------------------------------------------
  // Private Implementation
  // ------------------------------------------------------------------------

  // Callbacks called for any action on particular Ble Device
  private final BluetoothGattCallback mBleCallback = new BluetoothGattCallback() {
    private void onConnecting(BluetoothGatt gatt, int status) {
      Log.d(TAG, "BluetoothGatt - STATE_CONNECTING - STATUS=" + status);
    }

    private void onConnected(BluetoothGatt gatt, int status) {
      Log.d(TAG, "BluetoothGatt - STATE_CONNECTED - STATUS=" + status);

      mConnected = true;
      mDelegate.bleDeviceConnected(gatt, gatt.getDevice());

      // now we can start talking with the device, e.g.
      // in our case we would like automatically to call for services discovery
      startServicesDiscovery();
    }

    private void onDisconnecting(BluetoothGatt gatt, int status) {
      Log.d(TAG, "BluetoothGatt - STATE_DISCONNECTING - STATUS=" + status);
    }

    private void onDisconnected(BluetoothGatt gatt, int status) {
      Log.d(TAG, "BluetoothGatt - STATE_DISCONNECTED - STATUS=" + status);

      mConnected = false;
      mDelegate.bleDeviceDisconnected(gatt, gatt.getDevice());
    }

    @Override
    public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
      switch (newState) {
      case BluetoothProfile.STATE_CONNECTING:
        onConnecting(gatt, status);
        break;

      case BluetoothProfile.STATE_CONNECTED:
        onConnected(gatt, status);
        break;

      case BluetoothProfile.STATE_DISCONNECTING:
        onDisconnecting(gatt, status);
        break;

      case BluetoothProfile.STATE_DISCONNECTED:
        onDisconnected(gatt, status);
        break;
      }
    }

    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
      if (status == BluetoothGatt.GATT_SUCCESS) {
        // now, when services discovery is finished, we can call getServices() for Gatt
        getSupportedServices();
      }
    }

    @Override
    public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
      String deviceName = gatt.getDevice().getName();
      String serviceName = BleNamesResolver
          .resolveServiceName(characteristic.getService().getUuid().toString().toLowerCase(Locale.getDefault()));
      String characteristicName = BleNamesResolver
          .resolveCharacteristicName(characteristic.getUuid().toString().toLowerCase(Locale.getDefault()));
      String description = "Device=\"" + deviceName + "\" Service=\"" + serviceName + "\" Characteristic=\""
          + characteristicName + "\"";

      // We got response regarding our request to write new value to the characteristic
      // let see if it failed or not
      if (status == BluetoothGatt.GATT_SUCCESS) {
        mDelegate.bleSuccessfulWrite(gatt, gatt.getDevice(), characteristic.getService(), characteristic, description);
      } else {
        mDelegate.bleFailedWrite(gatt, gatt.getDevice(), characteristic.getService(), characteristic,
            description + " STATUS = " + status);
      }
    }
  };
}

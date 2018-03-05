/******************************************************************************
 *   ____     _____    _______   ______    _  __                              *
 *  / __ \   |  __ \  |__   __| |  ____|  | |/ /    Copyright (c) 2015 - 2018 *
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

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.content.Context;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

class BleFretlightDevice implements FretlightDevice
{
	private static final String TAG = "FL-BleFretlightDevice";

	private final Context mContext;
	private final BleClient mBleClient;
	private final BleClient.Delegate mBleClientDelegate = new BleClientDelegate();
	private final Map<BluetoothDevice, FretlightDevice> mDevices = new HashMap<>();
	private Delegate mDelegate = Delegate.NULL;

	private String mDeviceAddress;
	private int mRssi;

	private BluetoothGattCharacteristic mFretboard;

	public BleFretlightDevice(final Context context, final BleClient client)
	{
		mContext = context;
		mBleClient = client;
		mBleClient.setDelegate(mBleClientDelegate);
	}

	public FretlightExecutor getExecutor()
	{
		return mBleClient.getExecutor();
	}

	@Override
	public void setDelegate(final Delegate delegate)
	{
		mDelegate = delegate != null ? delegate : Delegate.NULL;
	}

	@Override
	public boolean connect(final String deviceAddress)
	{
		mDeviceAddress = deviceAddress;
		if (!isConnected()) {
			return mBleClient.connect(mDeviceAddress);
		}
		mDelegate.deviceConnected(this);
		return true;
	}

	@Override
	public void disconnect()
	{
		mBleClient.disconnect();
	}

	@Override
	public void pause()
	{
		//mBleClient.stopMonitoringRssiValue();
		mBleClient.disconnect();
		//mBleClient.close();
	}

	@Override
	public void resume()
	{
		// If we were previously connected to a device, then reconnect.
		if (mDeviceAddress != null) {
			mBleClient.connect(mDeviceAddress);
			//mBleClient.startMonitoringRssiValue();
		}
	}

	@Override
	public int getRssi()
	{
		return mRssi;
	}

	@Override
	public String getName()
	{
		BluetoothDevice device = mBleClient.getDevice();
		return String.format("%s - %s", device.getName(), device.getAddress());
	}

	@Override
	public String getAddress()
	{
		return mBleClient.getDevice().getAddress();
	}

	@Override
	public boolean isConnected()
	{
		return mBleClient.isConnected();
	}

	@Override
	public void close()
	{
		mBleClient.removeDelegate();
		mBleClient.close();
	}

	@Override
	public int write(final byte[] data)
	{
		mBleClient.writeDataToCharacteristic(mFretboard, data);
		return data.length;
	}

	// ------------------------------------------------------------------------
	// Private Implementation
	// ------------------------------------------------------------------------

	private FretlightDevice getOrCreateFretlightDevice(final BluetoothDevice device)
	{
		FretlightDevice fretlightDevice = mDevices.get(device);
		if (fretlightDevice == null) {
			final BleClient client = new BleClient(mContext);
			fretlightDevice = new BleFretlightDevice(mContext, client);
		}
		return fretlightDevice;
	}

	// ------------------------------------------------------------------------
	// BleClientDelegate
	// ------------------------------------------------------------------------

	private class BleClientDelegate extends BleClient.Delegate.Adapter
	{
		@Override
		public void bleDeviceConnected(final BluetoothGatt gatt, final BluetoothDevice device)
		{
			Log.d(TAG, "Connected Device=\"" + device.getName() + "\"");
			mDelegate.deviceConnected(BleFretlightDevice.this);
		}

		@Override
		public void bleDeviceDisconnected(final BluetoothGatt gatt, final BluetoothDevice device)
		{
			Log.d(TAG, "Disconnected Device=\"" + device.getName() + "\"");
			mDelegate.deviceDisconnected(BleFretlightDevice.this);
		}

		@Override
		public void bleAvailableServicesForDevice(final BluetoothGatt gatt, final BluetoothDevice device, final List<BluetoothGattService> services)
		{
			final String deviceName = device.getName();
			Log.d(TAG, "Available Services for \"" + deviceName + "\"");
			for (BluetoothGattService service : mBleClient.getCachedServices()) {
				if (service.getUuid().equals(BleFretlightProfile.Service.GUITAR)) {
					final String serviceName = BleNamesResolver.resolveServiceName(service.getUuid().toString().toLowerCase(Locale.getDefault()));
					Log.d(TAG, "...Service=\"" + serviceName + "\"");
					mBleClient.getCharacteristicsForService(service);
				}
			}
		}

		@Override
		public void bleAvailableCharacteristicsForService(final BluetoothGatt gatt, final BluetoothDevice device, final BluetoothGattService service, final List<BluetoothGattCharacteristic> characteristics)
		{
			final String serviceName = BleNamesResolver.resolveServiceName(service.getUuid().toString().toLowerCase(Locale.getDefault()));
			Log.d(TAG, "Available Characteristics for \"" + serviceName + "\"");
			for (BluetoothGattCharacteristic characteristic : characteristics) {
				if (characteristic.getUuid().equals(BleFretlightProfile.Characteristic.FRETBOARD)) {
					final String characteristicName = BleNamesResolver.resolveCharacteristicName(characteristic.getUuid().toString().toLowerCase(Locale.getDefault()));
					Log.d(TAG, "...Characteristic=\"" + characteristicName + "\"");
					mFretboard = characteristic;
				}
			}
		}

		@Override
		public void bleSuccessfulWrite(final BluetoothGatt gatt, final BluetoothDevice device, final BluetoothGattService service, final BluetoothGattCharacteristic characteristic, final String description)
		{
			Log.d(TAG, "SUCCESS writing to " + description + "!");
		}

		@Override
		public void bleFailedWrite(final BluetoothGatt gatt, final BluetoothDevice device, final BluetoothGattService service, final BluetoothGattCharacteristic characteristic, final String description)
		{
			Log.d(TAG, "FAILURE writing to " + description + "!");
		}

		@Override
		public void bleNewRssiAvailable(final BluetoothGatt gatt, final BluetoothDevice device, final int rssi)
		{
			mRssi = rssi;
			Log.d(TAG, "RSSI is " + rssi);
		}
	}
}

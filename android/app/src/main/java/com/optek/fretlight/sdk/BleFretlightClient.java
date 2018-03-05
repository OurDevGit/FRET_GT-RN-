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

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.content.Context;
import android.content.Intent;

import java.util.HashMap;
import java.util.Map;

/**
 * Client interface to BLE Fretlight guitars.
 */
class BleFretlightClient implements FretlightClient
{
	private final Activity mContext;
	private final BleClient mBleClient;
	private final BleClient.Delegate mBleClientDelegate;

	// Maps BluetoothDevices to our FretlightGuitar instances.
	private Map<BluetoothDevice, FretlightGuitar> mGuitars = new HashMap<>();
	private Delegate mDelegate = Delegate.NULL;
	private boolean mScanning;

	public BleFretlightClient(final Activity context, final BleClient bleClient)
	{
		mContext = context;
		mBleClient = bleClient;
		mBleClientDelegate = new BleClientDelegate();

		// Assign the delegate.
		mBleClient.setDelegate(mBleClientDelegate);
		mBleClient.initialize();
	}

	@Override
	public boolean initialize()
	{
		return mBleClient.initialize();
	}

	@Override
	public void setDelegate(Delegate delegate)
	{
		mDelegate = delegate != null ? delegate : Delegate.NULL;
	}

	@Override
	public boolean isBleAvailable()
	{
		return mBleClient.isBleAvailable();
	}

	@Override
	public boolean isBleEnabled()
	{
		return mBleClient.isBleEnabled();
	}

	@Override
	public void askUserToEnableBle(final int requestCode)
	{
		// BT is not turned on - ask user to make it enabled.
		final Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
		mContext.startActivityForResult(enableBtIntent, requestCode);
		// See caller's onActivityResult to check what is the status of our request
	}

	@Override
	public void startScanning()
	{
		mScanning = true;
		mBleClient.startScanning(BleFretlightProfile.Service.GUITAR);
	}

	@Override
	public void stopScanning()
	{
		mBleClient.stopScanning();
		mScanning = false;
	}

	@Override
	public boolean isScanning()
	{
		return mScanning;
	}

	@Override
	public void connectToGuitar(final String deviceAddress)
	{
		// Create a BleClient for the provided bluetooth device.
		//final BleClient client = new BleClient(mContext);

		// The BleFretlightDevice is an implementation of FretlightDevice for BLE.
		final FretlightDevice fretlightDevice = new BleFretlightDevice(mContext, mBleClient);

		// The DefaultFretlightGuitar is the default implementation of FretlightGuitar.
		final FretlightGuitar guitar = new Guitar(fretlightDevice);

		// Connect to device address.
		mBleClient.connect(deviceAddress);

		// Add to the cache.
		mGuitars.put(mBleClient.getDevice(), guitar);
	}

	// ------------------------------------------------------------------------
	// Private Implementation
	// ------------------------------------------------------------------------

	private FretlightGuitar createGuitar(Context context, BluetoothDevice device)
	{
		// Create a BleClient for the provided bluetooth device.
		final BleClient client = new BleClient(context);

		// The BleFretlightDevice is an implementation of FretlightDevice for BLE.
		final FretlightDevice fretlightDevice = new BleFretlightDevice(context, client);

		// The DefaultFretlightGuitar is the default implementation of FretlightGuitar.
		final FretlightGuitar guitar = new Guitar(fretlightDevice);

		// Connect to device address.
		client.connect(device);

		return guitar;
	}

	// Gets cached guitar or creates a new one for the given bluetooth device.
	private FretlightGuitar getGuitarForDevice(final Context context, final BluetoothDevice device)
	{
		// Do we have this guitar in cache?
		FretlightGuitar guitar = mGuitars.get(device);
		if (guitar == null) {
			// Create a new guitar.
			guitar = createGuitar(mContext, device);

			// Add to the cache.
			mGuitars.put(device, guitar);
		}
		return guitar;
	}

	// ------------------------------------------------------------------------
	// BleClientDelegate
	// ------------------------------------------------------------------------

	private class BleClientDelegate extends BleClient.Delegate.Adapter
	{
		@Override
		public void bleDeviceFound(final BluetoothDevice device)
		{
			final FretlightGuitar guitar = getGuitarForDevice(mContext, device);
			mDelegate.guitarFound(guitar);
		}

		@Override
		public void bleDeviceConnected(final BluetoothGatt gatt, final BluetoothDevice device)
		{
			final FretlightGuitar guitar = getGuitarForDevice(mContext, device);
			mDelegate.guitarConnected(guitar);
		}

		@Override
		public void bleDeviceDisconnected(final BluetoothGatt gatt, final BluetoothDevice device)
		{
			final FretlightGuitar guitar = getGuitarForDevice(mContext, device);
			mDelegate.guitarDisconnected(guitar);
		}
	}
}

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

import java.util.UUID;

public class BleScanner_API19 extends BleScanner
{
	private static final String TAG = "FL-BleScanner_API19";

	private final BluetoothAdapter mBluetoothAdapter;

	// Callback handles results from new devices that appear during a scan.
	private BluetoothAdapter.LeScanCallback mScanCallback = new BluetoothAdapter.LeScanCallback()
	{
		@Override
		public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord)
		{
			Log.d(TAG, "onLeScan");
			mDelegate.onScanSuccess(device);
		}
	};

	public BleScanner_API19(BluetoothAdapter adapter, Delegate delegate)
	{
		super(delegate);
		mBluetoothAdapter = adapter;
	}

	public void startScanning(final UUID service)
	{
		// Scan for devices advertising the provided service.
		mBluetoothAdapter.startLeScan(new UUID[] {service}, mScanCallback);
	}

	public void stopScanning()
	{
		mBluetoothAdapter.stopLeScan(mScanCallback);
	}
}

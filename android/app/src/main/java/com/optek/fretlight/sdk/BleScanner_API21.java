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

import android.annotation.TargetApi;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.os.Build;
import android.os.ParcelUuid;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@TargetApi(Build.VERSION_CODES.LOLLIPOP)
class BleScanner_API21 extends BleScanner
{
	private static final String TAG = "FL-BleScanner_API21";

	private final BluetoothAdapter mBluetoothAdapter;

	// Callback handles results from new devices that appear during a scan.
	// Batch results appear when scan delay filters are enabled.
	private ScanCallback mScanCallback = new ScanCallback()
	{
		@Override
		public void onScanResult(int callbackType, ScanResult result)
		{
			Log.d(TAG, "Discovered 1 device!");
			processResult(result);
		}

		@Override
		public void onBatchScanResults(List<ScanResult> results)
		{
			Log.d(TAG, "Discovered %d devices!", results.size());
			for (ScanResult result : results) {
				processResult(result);
			}
		}

		@Override
		public void onScanFailed(int errorCode)
		{
			Log.d(TAG, "BLE Scan Failed: " + errorCode);
			mDelegate.onScanFailure(errorCode);
		}

		private void processResult(ScanResult result)
		{
			final BluetoothDevice device = result.getDevice();
			Log.d(TAG, String.format("BLE Device=\"%s\" rssi=%d", device.getName(), result.getRssi()));
			mDelegate.onScanSuccess(device);
		}
	};

	public BleScanner_API21(BluetoothAdapter adapter, Delegate delegate)
	{
		super(delegate);
		mBluetoothAdapter = adapter;
	}

	// Start scanning for BT LE devices around.
	public void startScanning(final UUID service)
	{
		// Scan for devices advertising the provided service.
		final ScanFilter scanFilter = new ScanFilter.Builder()
			.setServiceUuid(new ParcelUuid(service))
			.build();

		final ArrayList<ScanFilter> filters = new ArrayList<>();
		filters.add(scanFilter);

		final ScanSettings settings = new ScanSettings.Builder()
			.setScanMode(ScanSettings.SCAN_MODE_BALANCED)
			.build();

		final BluetoothLeScanner scanner = mBluetoothAdapter.getBluetoothLeScanner();
		if (scanner != null) {
			scanner.startScan(filters, settings, mScanCallback);
		}
	}

	// stops current scanning
	public void stopScanning()
	{
		final BluetoothLeScanner scanner = mBluetoothAdapter.getBluetoothLeScanner();
		if (scanner != null) {
			scanner.stopScan(mScanCallback);
		}
	}
}

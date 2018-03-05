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

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.os.Build;

import java.util.UUID;

abstract class BleScanner
{
	interface Delegate
	{
		Delegate NULL = new Adapter();

		void onScanSuccess(BluetoothDevice device);

		void onScanFailure(int errorCode);

		// Adapter class
		class Adapter implements Delegate
		{
			@Override
			public void onScanSuccess(BluetoothDevice device)
			{
				// DO NOTHING
			}

			@Override
			public void onScanFailure(int errorCode)
			{
				// DO NOTHING
			}
		}
	}

	// Delegate object through which we are returning results to the caller.
	protected Delegate mDelegate = Delegate.NULL;

	public static BleScanner create(BluetoothAdapter adapter, Delegate delegate)
	{
		// We support two different ble scanners depending on os version.
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
			return new BleScanner_API21(adapter, delegate);
		} else {
			return new BleScanner_API19(adapter, delegate);
		}
	}

	public abstract void startScanning(final UUID service);

	public abstract void stopScanning();

	protected BleScanner(Delegate delegate)
	{
		this.mDelegate = delegate;
	}
}


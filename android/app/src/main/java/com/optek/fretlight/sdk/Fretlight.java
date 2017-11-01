/******************************************************************************
 *   ____     _____    _______   ______    _  __                              *
 *  / __ \   |  __ \  |__   __| |  ____|  | |/ /    Copyright (c) 2015        *
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

/**
 * Public access point for Fretlight SDK.
 */
public class Fretlight
{
	public static FretlightClient createClient(final Activity activity)
	{
		// Create a BleClient.
		final BleClient bleClient = new BleClient(activity);

		// The FretlightClient is an implementation of FretlightClient for BLE.
		final FretlightClient fretlightClient = new BleFretlightClient(activity, bleClient);

		return fretlightClient;
	}

	public static FretlightGuitar createGuitar(final Activity activity)
	{
		// Create a BleClient.
		final BleClient client = new BleClient(activity);

		// The FretlightDevice is an implementation of FretlightDevice for BLE.
		final FretlightDevice fretlightDevice = new BleFretlightDevice(activity, client);

		// The Guitar is the default implementation of FretlightGuitar.
		final FretlightGuitar guitar = new Guitar(fretlightDevice);

		return guitar;
	}

	public interface LogDelegate
	{
		void log(String tag, String message);

		void log(String tag, String message, Throwable throwable);

		/** Adapter class for delegate. */
		class Adapter implements LogDelegate
		{
			@Override
			public void log(String tag, String message)
			{
				// DO NOTHING
			}

			@Override
			public void log(String tag, String message, Throwable throwable)
			{
				// DO NOTHING
			}
		}

		/** Null delegate. */
		Adapter NULL = new Adapter();
	}

	public static void setLogDelegate(LogDelegate delegate)
	{
		Log.setDelegate(delegate);
	}

	private Fretlight()
	{
		// Prevent instantiation
	}
}

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

public interface FretlightClient
{
	/** Delegate interface. */
	interface Delegate
	{
		/**
		 * Called when a guitar device is found.
		 *
		 * @param guitar The guitar that was found.
		 */
		void guitarFound(final FretlightGuitar guitar);

		/**
		 * Called when a guitar device is connected.
		 *
		 * @param guitar The guitar that was connected.
		 */
		void guitarConnected(final FretlightGuitar guitar);

		/**
		 * Called when a guitar device is disconnected.
		 *
		 * @param guitar The guitar that was disconnected.
		 */
		void guitarDisconnected(final FretlightGuitar guitar);

		/** Adapter class for delegate. */
		class Adapter implements Delegate
		{
			@Override
			public void guitarFound(final FretlightGuitar guitar)
			{
				// DO NOTHING
			}

			@Override
			public void guitarConnected(final FretlightGuitar guitar)
			{
				// DO NOTHING
			}

			@Override
			public void guitarDisconnected(final FretlightGuitar guitar)
			{
				// DO NOTHING
			}
		}

		/** Null delegate. */
		Delegate NULL = new Adapter();
	}

	/** Initialize the fretlight client. */
	boolean initialize();

	/**
	 * Set the delegate.
	 *
	 * @param delegate The delegate to set.
	 */
	void setDelegate(final Delegate delegate);

	/**
	 * Determine if Bluetooth LE hardware is available.
	 *
	 * @return true if hardware is available, false if not.
	 */
	boolean isBleAvailable();

	/**
	 * Determine if Bluetooth LE is currently enabled.
	 *
	 * @return true of enabled, false if not.
	 */
	boolean isBleEnabled();

	/**
	 * Prompt to the user to enable Bluetooth LE. User may refuse.
	 *
	 * @param requestCode The requestCode to return to calling activity.
	 */
	void askUserToEnableBle(final int requestCode);

	/** Start scanning for suitable guitar devices. */
	void startScanning();

	/** Stop scanning for guitar devices. */
	void stopScanning();

	/** @return true if we are scanning for guitars, false if not. */
	boolean isScanning();

	/**
	 * Connect to a known guitar by its mac address.
	 * The guitar is delivered through the delegate.
	 *
	 * @param deviceAddress The mac address of the guitar to connect to.
	 */
	void connectToGuitar(final String deviceAddress);
}

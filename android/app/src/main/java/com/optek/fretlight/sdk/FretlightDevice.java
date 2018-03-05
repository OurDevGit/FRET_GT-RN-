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

interface FretlightDevice
{
	interface Delegate
	{
		void deviceConnected(final FretlightDevice device);

		void deviceDisconnected(final FretlightDevice device);

		class Adapter implements Delegate
		{
			@Override
			public void deviceConnected(final FretlightDevice device)
			{
				// DO NOTHING
			}

			@Override
			public void deviceDisconnected(final FretlightDevice device)
			{
				// DO NOTHING
			}
		}

		Delegate NULL = new Adapter();
	}

	FretlightExecutor getExecutor();

	void setDelegate(final Delegate delegate);

	/**
	 * @param deviceAddress The address of the guitar to connect.
	 */
	boolean connect(final String deviceAddress);

	/**
	 * Disconnect this guitar.
	 */
	void disconnect();

	/**
	 * Pause this guitar. Call when app is sent to the background.
	 */
	void pause();

	/**
	 * Resume this guitar. Call when app is brought to the foreground.
	 */
	void resume();

	/**
	 * @return The received signal strength of the guitar.
	 */
	int getRssi();

	/**
	 * @return The name of the guitar.
	 */
	String getName();

	/**
	 * @return The address of the guitar.
	 */
	String getAddress();

	boolean isConnected();

	void close();

	int write(final byte[] data);
}

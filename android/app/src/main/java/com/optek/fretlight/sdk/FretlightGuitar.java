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

/**
 * Interface to a Fretlight Guitar.
 */
public interface FretlightGuitar
{
	/**
	 * The guitar delegate.
	 * A delegate class for receiving async notifications about guitar
	 * state changes. Methods on this delegate will be called on a
	 * separate background thread so any UI reactions will need to be
	 * synchronized onto the main UI thread.
	 */
	interface Delegate
	{
		/**
		 * Called when the guitar has connected.
		 *
		 * @param guitar The guitar that connected.
		 */
		void guitarConnected(final FretlightGuitar guitar);

		/**
		 * Called when the guitar has disconnected.
		 *
		 * @param guitar The guitar that disconnected.
		 */
		void guitarDisconnected(final FretlightGuitar guitar);

		/**
		 * Called when the RSSI (Received Signal Strength Indicator) has changed.
		 *
		 * @param guitar The guitar we received rssi from.
		 * @param rssi The rssi value.
		 */
		void guitarRssiChanged(final FretlightGuitar guitar, final int rssi);

		/**
		 * Adapter class to make implementing the delegate easier.
		 * Simply extend this class and override the methods you are interested in.
		 */
		class Adapter implements Delegate
		{
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

			@Override
			public void guitarRssiChanged(final FretlightGuitar guitar, final int rssi)
			{
				// DO NOTHING
			}
		}

		/** A null delegate. */
		Delegate NULL = new Adapter();
	}

	/**
	 * Set the delegate for this guitar.
	 *
	 * @param delegate The delegate for the guitar.
	 */
	void setDelegate(final Delegate delegate);

	/**
	 * @param deviceAddress The address of the guitar to connect.
	 * @return true if success, false if not.
	 */
	boolean connect(final String deviceAddress);

	/** Disconnect this guitar. Can be reconnected. */
	void disconnect();

	/** Close this device. */
	void close();

	/** Pause this device. */
	void pause();

	/** Resume this device. */
	void resume();

	/** @return The received signal strength of the guitar. */
	int getRssi();

	/** @return The name of the guitar. */
	String getName();

	/** @return The address of the guitar. */
	String getAddress();

	/**
	 * Check the current connection status. Use the optional delegate object to
	 * receive notification of connection status change.
	 *
	 * @return The current connection state.
	 */
	boolean isConnected();

	/**
	 * Sets left-handed "lefty" display mode of LEDs.
	 *
	 * @param lefty The state of the lefty display mode to set.
	 */
	void setLefty(final boolean lefty);

	/**
	 * @return true if left-handed display mode is enabled, false if not.
	 */
	boolean isLefty();

	/**
	 * Sets "bass" display of LEDs.
	 *
	 * @param bass The state of the bass display mode to set.
	 */
	void setBass(final boolean bass);

	/**
	 * @return true if bass display mode is enabled, false if not.
	 */
	boolean isBass();

	/**
	 * Turns on all LEDs on the fretboard.
	 */
	void allOn();

	/**
	 * Turns off all LEDs on the fretboard.
	 */
	void allOff();

	/**
	 * Turns on or off an LED on the fretboard. LED will remain on until explicitly
	 * turned off.
	 *
	 * @param physicalString The string the LED is on (1..6).
	 * @param physicalFret The fret the LED is on (1..22).
	 * @param on Turn the LED on or off.
	 */
	void setNote(final int physicalString, final int physicalFret, final boolean on);

	/**
	 * Disable/Enable all LEDs.
	 * When disabled, setNote() calls will not light them.
	 *
	 * @param enable True to enable display, false to disable.
	 */
	void setDisplayEnable(final boolean enable);
}

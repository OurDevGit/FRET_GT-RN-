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
 * Default implementation of Fretlight guitar.
 */
class Guitar implements FretlightGuitar
{
	// Fretlight device and delegate.
	private final FretlightDevice mDevice;
	private final FretlightDevice.Delegate mDeviceDelegate = new DeviceDelegate();

	// Fretboard (LEDs)
	private final Fretboard mFretboard;

	// Fretlight guitar delegate.
	private Delegate mDelegate;

	// Guitar data.
	private boolean mDisplayEnabled = true;

	public Guitar(final FretlightDevice device)
	{
		mDevice = device;
		mDevice.setDelegate(mDeviceDelegate);

		mFretboard = new Fretboard(mDevice);

		mDelegate = Delegate.NULL;
	}

	@Override
	public void setDelegate(final Delegate delegate)
	{
		mDelegate = delegate != null ? delegate : Delegate.NULL;
	}

	@Override
	public boolean connect(final String deviceAddress)
	{
		return mDevice.connect(deviceAddress);
	}

	@Override
	public void disconnect()
	{
		mDevice.disconnect();
	}

	@Override
	public void close()
	{
		mDevice.close();
	}

	@Override
	public void pause()
	{
		mDevice.pause();
	}

	@Override
	public void resume()
	{
		mDevice.resume();
	}

	@Override
	public int getRssi()
	{
		return mDevice.getRssi();
	}

	@Override
	public String getName()
	{
		return mDevice.getName();
	}

	@Override
	public String getAddress()
	{
		return mDevice.getAddress();
	}

	@Override
	public boolean isConnected()
	{
		return mDevice.isConnected();
	}

	@Override
	public void setLefty(final boolean lefty)
	{
		mFretboard.setLefty(lefty);
		allOff();
	}

	@Override
	public boolean isLefty()
	{
		return mFretboard.isLefty();
	}

	@Override
	public void setBass(final boolean bass)
	{
		mFretboard.setBass(bass);
		allOff();
	}

	@Override
	public boolean isBass()
	{
		return mFretboard.isBass();
	}

	@Override
	public void allOff()
	{
		// Turn all lights off.
		mFretboard.allOff();
	}

	@Override
	public void allOn()
	{
		if (mDisplayEnabled)
		{
			// Turn all lights on.
			mFretboard.allOn();
		}
	}

	@Override
	public void setNote(final int string, final int fret, final boolean on)
	{
		if (mDisplayEnabled)
		{
			mFretboard.setNote(string, fret, on);
		}
	}

	@Override
	public void setDisplayEnable(final boolean enable)
	{
		if (!enable)
		{
			allOff();
		}

		mDisplayEnabled = enable;
	}

	// ------------------------------------------------------------------------
	// DeviceDelegate
	// ------------------------------------------------------------------------

	private class DeviceDelegate extends FretlightDevice.Delegate.Adapter
	{
		@Override
		public void deviceConnected(final FretlightDevice device)
		{
			mDelegate.guitarConnected(Guitar.this);
		}

		@Override
		public void deviceDisconnected(final FretlightDevice device)
		{
			mDelegate.guitarDisconnected(Guitar.this);
		}
	}
}

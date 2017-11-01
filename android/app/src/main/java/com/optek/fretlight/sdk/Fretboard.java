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
 * Represents the fretboard LED data.
 */
class Fretboard
{
	private static final String TAG = "FL-Fretboard";

	private final FretlightDevice mDevice;

	private final Section mTopSection;
	private final Section mMiddleSection;
	private final Section mBottomSection;

	private boolean mLefty;
	private boolean mBass;

	public Fretboard(final FretlightDevice device)
	{
		mDevice = device;

		// Start the executor.
		mDevice.getExecutor().start(new Updater());

		// Create our three sections of fretlight data.
		mTopSection = new Section(Section.ID.TOP);
		mMiddleSection = new Section(Section.ID.MIDDLE);
		mBottomSection = new Section(Section.ID.BOTTOM);
	}

	public void setLefty(final boolean lefty)
	{
		mLefty = lefty;
	}

	public boolean isLefty()
	{
		return mLefty;
	}

	public void setBass(final boolean bass)
	{
		mBass = bass;
	}

	public boolean isBass()
	{
		return mBass;
	}

	public void clearAll()
	{
		mDevice.getExecutor().execute(new Runnable()
		{
			@Override
			public void run()
			{
				mTopSection.allLightsOff();
				mMiddleSection.allLightsOff();
				mBottomSection.allLightsOff();
			}
		});
	}

	public void allOn()
	{
		mDevice.getExecutor().execute(new Runnable()
		{
			@Override
			public void run()
			{
				// Turn everything on
				mTopSection.allLightsOn();
				mMiddleSection.allLightsOn();
				mBottomSection.allLightsOn();
			}
		});
	}

	public void allOff()
	{
		mDevice.getExecutor().execute(new Runnable()
		{
			@Override
			public void run()
			{
				// Turn everything off
				mBottomSection.allLightsOff();
				mMiddleSection.allLightsOff();
				mTopSection.allLightsOff();
			}
		});
	}

	public void setNote(final int string, final int fret, final boolean on)
	{
		mDevice.getExecutor().execute(new Runnable()
		{
			@Override
			public void run()
			{
				log_v("setNote string=" + string + " fret=" + fret + " state=" + on);

				int missingStrings = mBass && mLefty ? 2 : 0;
				int physicalString = string;
				if (physicalString < missingStrings)
				{
					return;
				}
				else
				{
					physicalString -= missingStrings;
				}

				if (0 > fret || 0 > physicalString || 5 < physicalString || 22 < fret)
				{
					return;
				}

				Section section = null;
				int sectionIndex = 0;

				int stringBit;
				if (mLefty)
				{
					stringBit = (int) Math.pow(2.0f, (float) physicalString);
				}
				else
				{
					stringBit = (int) Math.pow(2.0f, (float) (5 - physicalString));
				}

				if (fret < 8)
				{
					section = mTopSection;
					sectionIndex = fret;
				}
				else if (fret < 16)
				{
					section = mMiddleSection;
					sectionIndex = fret - 8;
				}
				else if (fret < 22)
				{
					section = mBottomSection;
					sectionIndex = fret - 16;
				}

				if (section != null)
				{
					if (on)
					{
						section.setLightsOn(sectionIndex, stringBit);
					}
					else
					{
						int mask = (0xFF ^ stringBit);
						section.setLightsOff(sectionIndex, mask);
					}
				}
			}
		});
	}

	// ------------------------------------------------------------------------
	// Private Implementation
	// ------------------------------------------------------------------------

	private void update()
	{
		if (mTopSection.isDirty())
		{
			log_v("- UPDATE TOP SECTION -");
			writeSectionData(mTopSection);
		}
		else if (mMiddleSection.isDirty())
		{
			log_v("- UPDATE MIDDLE SECTION -");
			writeSectionData(mMiddleSection);
		}
		else if (mBottomSection.isDirty())
		{
			log_v("- UPDATE BOTTOM SECTION -");
			writeSectionData(mBottomSection);
		}
	}

	private void writeSectionData(final Section section)
	{
		final byte data[] = section.getData();
		logSection(data);
		mDevice.write(data);
	}

	private void logSection(final byte[] data)
	{
		final StringBuilder builder = new StringBuilder();
		for (final byte b : data)
		{
			builder.append(String.format("%02X", b));
			builder.append(":");
		}
		builder.setLength(builder.length() - 1);
		log_d("WRITE SECTION DATA - " + builder.toString());
	}

	private void log_d(String message, Object... args)
	{
		Log.d(TAG, message, args);
	}

	private void log_v(String message, Object... args)
	{
		Log.v(TAG, message, args);
	}

	// ------------------------------------------------------------------------
	// Updater
	// ------------------------------------------------------------------------

	private class Updater implements Runnable
	{
		@Override
		public void run()
		{
			update();
		}
	}
}

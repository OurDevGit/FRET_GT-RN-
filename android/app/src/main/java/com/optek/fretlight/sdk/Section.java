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

class Section
{
	// Enum to identify sections.
	public enum ID
	{
		TOP(1), MIDDLE(2), BOTTOM(3);

		private final int mValue;

		ID(final int value)
		{
			mValue = value;
		}

		public int getValue()
		{
			return mValue;
		}
	}

	private static final byte NO_STRINGS = 0;
	private static final byte E_STRING_LOW = 1;
	private static final byte A_STRING = 2;
	private static final byte D_STRING = 4;
	private static final byte G_STRING = 8;
	private static final byte B_STRING = 16;
	private static final byte E_STRING_HIGH = 32;
	private static final byte ALL_STRINGS = 63;

	private static final int FRET_A = 0;
	private static final int FRET_B = 1;
	private static final int FRET_C = 2;
	private static final int FRET_D = 3;
	private static final int FRET_E = 4;
	private static final int FRET_F = 5;
	private static final int FRET_G = 6;
	private static final int FRET_H = 7;

	// For example, we indicate in the comments the three values
	// fretA may represent on the E string. The other frets
	// proceed up the neck as expected from the origin points.
	//byte[0] - fretA        // The nut = E, fret 9 = C, fret 17 = G#
	//byte[1] - fretB
	//byte[2] - fretC
	//byte[3] - fretD
	//byte[4] - fretE
	//byte[5] - fretF
	//byte[6] - fretG        // Not used in kNeckSectionBottom
	//byte[7] - fretH        // Not used in kNeckSectionBottom

	// The ID of the section
	private final ID mID;

	// The LED data for this section.
	private static final int SECTION_SIZE = 8;
	private byte[] mStates = new byte[SECTION_SIZE];

	// The calculated Fretlight data.
	private byte[] mData = new byte[SECTION_SIZE];

	public Section(final Section.ID id)
	{
		mID = id;
	}

	public Section.ID getID()
	{
		return mID;
	}

	public boolean isDirty()
	{
		return mData == null;
	}

	public void allLightsOn()
	{
		setAllOn(mStates);
		setDirty();
	}

	public void allLightsOff()
	{
		setAllOff(mStates);
		setDirty();
	}

	public void setLightsOn(final int index, final int mask)
	{
		mStates[index] |= mask;
		setDirty();
	}

	public void setLightsOff(final int index, final int mask)
	{
		mStates[index] &= mask;
		setDirty();
	}

	public byte[] getData()
	{
		if (mData == null)
		{
			// The mData field is null so recalculate the data.
			mData = calculateFretlightData(mStates);
		}
		return mData;
	}

	// ------------------------------------------------------------------------
	// Private Implementation
	// ------------------------------------------------------------------------

	private void setDirty()
	{
		// Set mData to null to force recalculation on next request.
		mData = null;
	}

	private void setAllOff(final byte[] states)
	{
		setPattern(states, NO_STRINGS);
	}

	private void setAllOn(final byte[] states)
	{
		setPattern(states, ALL_STRINGS);
	}

	private void setPattern(final byte[] states, final byte pattern)
	{
		for (int i = 0; i < SECTION_SIZE; i++)
		{
			states[i] = pattern;
		}
	}

	private byte[] calculateFretlightData(final byte[] states)
	{
		// Set the appropriate bits in the output buffer based
		// on the state of the provided LED states.
		// FretLight Buffer format notes:
		//
		// outBuf[6] low bits control the section, so:
		//	outBuf[6] = 0x03 -> bottom
		//	outBuf[6] = 0x02 -> middle
		//	outBuf[6] = 0x01 -> top
		//
		// within a section, the bits then go from outBuf[0] up to outBuf[5].
		// for the last section, which is shorter, the bits don't
		// start being meaningful until midway through:
		//
		// outBuf[1] = 0x80 - > fourth fret to right on bottom
		// outBuf[1] = 0x40 - > third
		// outBuf[1] = 0x20 - > third
		// outBuf[1] = 0x10 - > third
		//
		// So everything is sort of "backwards" bitwise speaking
		//

		byte[] data = new byte[SECTION_SIZE];

		final byte fretA = states[FRET_A];
		final byte fretB = states[FRET_B];
		final byte fretC = states[FRET_C];
		final byte fretD = states[FRET_D];
		final byte fretE = states[FRET_E];
		final byte fretF = states[FRET_F];
		final byte fretG = states[FRET_G];
		final byte fretH = states[FRET_H];

		data[7] = 0; // HID report 0

		// Get LED states for every item in this section.
		data[5] = (byte) ((fretA << 2) | ((fretB & 0x30) >> 4));              // fretA (ignore two high bits) plus two bits of fret B
		data[4] = (byte) (((fretB & 0xf) << 4) | ((fretC & 0x3c) >> 2));      // 4 bits of fretB plus 4 bits of Fret C
		data[3] = (byte) (((fretC & 0x3) << 6) | (fretD & 0x3f));             // 2 bits of fretC plus Fret D (ignore high two bits)
		data[2] = (byte) ((fretE << 2) | ((fretF & 0x30) >> 4));              // fretE (ignore high two bits) plus two bits of fret F
		data[1] = (byte) (((fretF & 0xf) << 4) | ((fretG & 0x3c) >> 2));      // 4 bits of fretF plus 4 bits of Fret G
		data[0] = (byte) (((fretG & 0x3) << 6) | (fretH & 0x3f));             // 2 bits of fretG plus Fret H (ignore high two bits)

		// Identify the correct section of the neck.
		data[6] = (byte) mID.getValue();

		return data;
	}
}


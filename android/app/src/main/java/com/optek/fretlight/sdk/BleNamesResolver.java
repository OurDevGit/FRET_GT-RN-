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

import java.util.HashMap;
import java.util.Map;

class BleNamesResolver
{
	private static Map<String, String> mServices = new HashMap<>();
	private static Map<String, String> mCharacteristics = new HashMap<>();

	static public String resolveServiceName(final String uuid)
	{
		String result = mServices.get(uuid);
		if (result == null)
		{
			result = "Unknown Service";
		}
		return result;
	}

	static public String resolveCharacteristicName(final String uuid)
	{
		String result = mCharacteristics.get(uuid);
		if (result == null)
		{
			result = "Unknown Characteristic";
		}
		return result;
	}

	static
	{
		mServices.put(BleFretlightProfile.Service.GUITAR.toString(), "Guitar");

		mCharacteristics.put(BleFretlightProfile.Characteristic.FRETBOARD.toString(), "Fretboard");
	}
}
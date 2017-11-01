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

import com.optek.fretlight.sdk.Fretlight.LogDelegate;

class Log
{
	static LogDelegate sDelegate = LogDelegate.NULL;

	public static void setDelegate(LogDelegate delegate)
	{
		sDelegate = delegate != null ? delegate : LogDelegate.NULL;
	}

	public static void d(String tag, String message, Object... params)
	{
		sDelegate.log(tag, String.format(message, params));
	}

	public static void d(String tag, Throwable throwable, String message, Object... params)
	{
		sDelegate.log(tag, String.format(message, params), throwable);
	}

	public static void v(String tag, String message, Object... params)
	{
		sDelegate.log(tag, String.format(message, params));
	}

	public static void v(String tag, Throwable throwable, String message, Object... params)
	{
		sDelegate.log(tag, String.format(message, params), throwable);
	}
}

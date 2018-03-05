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

import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class FretlightExecutor
{
	private final ExecutorService mExecutor;
	private final ScheduledExecutorService mUpdateExecutor;
	private final CopyOnWriteArrayList<Runnable> mRunnables = new CopyOnWriteArrayList<>();

	public FretlightExecutor(long updateInterval)
	{
		// For executing our note updates.
		mExecutor = Executors.newSingleThreadExecutor();

		// For serializing our section writes.
		mUpdateExecutor = Executors.newSingleThreadScheduledExecutor();

		// Start the update executor.
		mUpdateExecutor.scheduleWithFixedDelay(new Updater(), 0, updateInterval, TimeUnit.MILLISECONDS);
	}

	public void start(Runnable runnable)
	{
		mRunnables.add(runnable);
	}

	public void execute(Runnable runnable)
	{
		mUpdateExecutor.execute(runnable);
	}

	// ------------------------------------------------------------------------
	// Updater
	// ------------------------------------------------------------------------

	private class Updater implements Runnable
	{
		@Override
		public void run()
		{
			for (Runnable r : mRunnables) {
				r.run();
			}
		}
	}
}

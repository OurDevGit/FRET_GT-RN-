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

import java.util.ArrayList;
import java.util.List;

/**
 * Represents the fretboard LED data.
 */
class Fretboard {
  private static final String TAG = "FL-Fretboard";

  private final FretlightDevice mDevice;

  private final List<Section> mSections = new ArrayList<>();

  private int mSectionNum;
  private boolean mLefty;
  private boolean mBass;

  public Fretboard(final FretlightDevice device) {
    mDevice = device;

    // Start the executor.
    mDevice.getExecutor().start(new Updater());

    // Create our three sections of fretlight data.
    mSections.add(new Section(Section.TOP));
    mSections.add(new Section(Section.MIDDLE));
    mSections.add(new Section(Section.BOTTOM));
  }

  public void setLefty(final boolean lefty) {
    mLefty = lefty;
  }

  public boolean isLefty() {
    return mLefty;
  }

  public void setBass(final boolean bass) {
    mBass = bass;
  }

  public boolean isBass() {
    return mBass;
  }

  public void allOn() {
    mDevice.getExecutor().execute(new Runnable() {
      @Override
      public void run() {
        // Turn everything on
        for (Section section : mSections) {
          section.allLightsOn();
        }
      }
    });
  }

  public void allOff() {
    mDevice.getExecutor().execute(new Runnable() {
      @Override
      public void run() {
        // Turn everything off
        for (Section section : mSections) {
          section.allLightsOff();
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // Package Private Implementation
  // ------------------------------------------------------------------------

  public void setNote(final int string, final int fret, final boolean on) {
    mDevice.getExecutor().execute(new Runnable() {
      @Override
      public void run() {
        Log.v(TAG, "setNote string=" + string + " fret=" + fret + " state=" + on);

        int missingStrings = mBass && mLefty ? 2 : 0;
        int physicalString = string;
        if (physicalString < missingStrings) {
          return;
        } else {
          physicalString -= missingStrings;
        }

        if (0 > fret || 0 > physicalString || 5 < physicalString || 22 < fret) {
          return;
        }

        int sectionType = Section.INVALID;
        int sectionIndex = 0;

        if (fret < 8) {
          sectionType = Section.TOP;
          sectionIndex = fret;
        } else if (fret < 16) {
          sectionType = Section.MIDDLE;
          sectionIndex = fret - 8;
        } else if (fret < 22) {
          sectionType = Section.BOTTOM;
          sectionIndex = fret - 16;
        }

        if (sectionType != Section.INVALID) {
          Section section = mSections.get(sectionType - 1);

          int stringBit = (int) Math.pow(2.0f, (float) (5 - physicalString));
          if (mLefty) {
            stringBit = (int) Math.pow(2.0f, (float) physicalString);
          }

          if (on) {
            section.setLightsOn(sectionIndex, stringBit);
          } else {
            section.setLightsOff(sectionIndex, (0xFF ^ stringBit));
          }
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // Private Implementation
  // ------------------------------------------------------------------------

  private Section nextSection() {
    mSectionNum++;
    if (mSectionNum > Section.NUM_SECTIONS) {
      mSectionNum = Section.FIRST;
    }
    return mSections.get(mSectionNum - 1);
  }

  private void update() {
    // NOTE: You must only update one section per call to this function
    // or else you risk overwhelming the guitar and causing errors.

    Section section = nextSection();
    if (section.isDirty()) {
      writeSectionData(section);
    }
  }

  private class Updater implements Runnable {
    @Override
    public void run() {
      // NOTE: You must only update one section per call to this function
      // or else you risk overwhelming the guitar and causing errors.

      Section section = nextSection();
      if (section.isDirty()) {
        writeSectionData(section);
      }
    }
  }

  private static long lastTime;

  private void writeSectionData(final Section section) {
    final byte data[] = section.getData();

    if (Log.hasDelegate()) {
      logSection(data);

      long currentTime = System.currentTimeMillis();
      long deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (deltaTime >= 15) {
        Log.d(TAG, "Writing to device. Write interval = %d ms", deltaTime);
      } else {
        Log.d(TAG, "ERROR writing to device too fast!!! - Write interval = %d ms", deltaTime);
      }
    }

    mDevice.write(data);
  }

  private void logSection(final byte[] data) {
    final StringBuilder builder = new StringBuilder();
    for (final byte b : data) {
      builder.append(String.format("%02X", b));
      builder.append(":");
    }
    builder.setLength(builder.length() - 1);
    Log.d(TAG, "WRITE SECTION DATA - " + builder.toString());
  }
}

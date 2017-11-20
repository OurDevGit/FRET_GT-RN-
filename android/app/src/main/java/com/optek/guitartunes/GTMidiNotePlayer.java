package com.optek.guitartunes;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.billthefarmer.mididriver.MidiDriver;

// https://stackoverflow.com/questions/36193250/android-6-0-marshmallow-how-to-play-midi-notes

public class GTMidiNotePlayer extends ReactContextBaseJavaModule {
  private MidiDriver midiDriver;
  private int currentNote;
  private byte[] event;

  public GTMidiNotePlayer(ReactApplicationContext context) {
    super(context);
    midiDriver = new MidiDriver();
  }

  private void setGuitarInstrument() {
    byte[] event = new byte[2];
    event[0] = (byte) 0xC0;
    event[1] = (byte) 0x1B;
    midiDriver.write(event);
  }

  private void setFineTuning(int fineTuning) {
    byte lsb = (byte) (fineTuning & 0x7F);
    byte msb = (byte) (fineTuning >> 7);

    //Log.d("GTMidiNotePlayer", "fine: " + fineTuning + "; lsb: " + lsb + "; msb: " + msb);

    byte[] event = new byte[4];
    event[0] = (byte) (0xE0 | 0x00);
    event[1] = (byte) lsb;
    event[2] = (byte) msb;
    midiDriver.write(event);
  }

  private byte[] noteEvent(int note, boolean isOn) {
    byte[] event = new byte[3];

    // 0x90 = note On, 0x00 = channel 1 || 0x80 = note Off, 0x00 = channel 1
    event[0] = isOn ? (byte) (0x90 | 0x00) : (byte) (0x80 | 0x00);
    // note byte
    event[1] = (byte) note;
    // 0x7F = the maximum velocity (127) || 0x00 = the minimum velocity (0)
    event[2] = isOn ? (byte) 0x7F : (byte) 0x00;

    currentNote = note;
    return event;
  }

  @Override
  public String getName() {
    return "GTMidiNotePlayer";
  }

  @ReactMethod
  public void start(int fineTuning) {
    midiDriver.start();
    setGuitarInstrument();

    if (fineTuning != 8192) {
      setFineTuning((int) fineTuning);
    }
  }

  @ReactMethod
  public void stop() {
    midiDriver.stop();
  }

  @ReactMethod
  public void play(int note) {
    byte[] event = noteEvent(note, true);
    midiDriver.write(event);
  }

  @ReactMethod
  public void clear() {
    byte[] event = noteEvent(currentNote, false);
    midiDriver.write(event);
  }
}
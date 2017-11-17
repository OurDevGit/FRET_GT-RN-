package com.optek.guitartunes;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.billthefarmer.mididriver.MidiDriver;

public class GTMidiNotePlayer extends ReactContextBaseJavaModule {
  private MidiDriver midiDriver;
  private byte[] event;

  public GTMidiNotePlayer(ReactApplicationContext context) {
    super(context);
    midiDriver = new MidiDriver();
  }

  @Override
  public String getName() {
    return "GTMidiNotePlayer";
  }

  @ReactMethod
  public void start() {
    midiDriver.start();

  }

  @ReactMethod
  public void stop() {
    midiDriver.stop();
  }

  @ReactMethod
  public void play() {
    event = new byte[3];
    event[0] = (byte) (0x90 | 0x00); // 0x90 = note On, 0x00 = channel 1
    event[1] = (byte) 0x3C; // 0x3C = middle C
    event[2] = (byte) 0x7F; // 0x7F = the maximum velocity (127)
    // Send the MIDI event to the synthesizer.
    //261.626
    midiDriver.write(event);
  }

  @ReactMethod
  public void clear() {
    event = new byte[3];
    event[0] = (byte) (0x80 | 0x00); // 0x80 = note Off, 0x00 = channel 1
    event[1] = (byte) 0x3C; // 0x3C = middle C
    event[2] = (byte) 0x00; // 0x00 = the minimum velocity (0)

    // Send the MIDI event to the synthesizer.
    midiDriver.write(event);
  }
}
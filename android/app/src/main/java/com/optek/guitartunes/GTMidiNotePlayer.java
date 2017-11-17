package com.optek.guitartunes;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.billthefarmer.mididriver.MidiDriver;

public class GTMidiNotePlayer extends ReactContextBaseJavaModule {
  MidiDriver midiDriver;

  public GTMidiNotePlayer(ReactApplicationContext context) {
    super(context);
    midiDriver = new MidiDriver();
  }

  @Override
  public String getName() {
    return "GTMidiNotePlayer";
  }

  @ReactMethod
  public void play() {

  }

  @ReactMethod
  public void stop() {

  }
}
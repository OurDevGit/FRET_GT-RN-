package com.optek.guitartunes.ble;

import com.optek.fretlight.sdk.FretlightGuitar;

import android.content.Context;
import android.content.ContentResolver;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;
import java.util.HashMap;
import java.lang.Thread;
import java.lang.Object;

public class GTGuitarController extends ReactContextBaseJavaModule {
  ReactApplicationContext context;
  private Guitars mGuitars;
  GuitarEmitter guitarEmitter;

  public GTGuitarController(ReactApplicationContext context) {
    super(context);

    this.context = context;
    mGuitars = Guitars.getInstance();
    guitarEmitter = GuitarEmitter.getInstance();
    mGuitars.setListener(new Guitars.ChangeListener() {
      @Override
      public void onChange(String action, String guitarId) {
        if (action == "connect") {
          guitarEmitter.emit("GUITAR_CONNECTED", guitarId);
          stopScanning();
          startScanning();
        } else {
          guitarEmitter.emit("GUITAR_DISCONNECTED", guitarId);
        }
      }
    });
  }

  @Override
  public String getName() {
    return "GTGuitarController";
  }

  // SCANNING

  @ReactMethod
  public void startScanning() {
    guitarEmitter.setContext(context);
    Intent intent = new Intent(context, ScanningActivity.class);
    context.startActivity(intent);
  }

  @ReactMethod
  public void stopScanning() {
    Intent intent = new Intent(context, ScanningActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
    intent.putExtra("EXIT", true);
    context.startActivity(intent);
  }

  // LIGHTING

  @ReactMethod
  public void lightAll(String guitarId) {
    FretlightGuitar guitar = mGuitars.getById(guitarId);
    guitar.allOn();
  }

  @ReactMethod
  public void lightString(int string, String guitarId) {
    for (int i = 1; i < 23; i++) {
      setNote(string, i, true, guitarId);
    }
  }

  @ReactMethod
  public void setNote(int string, int fret, boolean isOn, String guitarId) {
    FretlightGuitar guitar = mGuitars.getById(guitarId);
    guitar.setNote(string, fret, isOn);
  }

  // CLEARING

  @ReactMethod
  public void clearAll(String guitarId) {
    FretlightGuitar guitar = mGuitars.getById(guitarId);
    guitar.allOff();
  }

  @ReactMethod
  public void clearAllGuitars() {
    for (FretlightGuitar guitar : mGuitars) {
      guitar.allOff();
    }
  }

  // SETTINGS

  @ReactMethod
  public boolean getLeft(String guitarId) {
    FretlightGuitar guitar = mGuitars.getById(guitarId);
    return guitar.isLefty();
  }

  @ReactMethod
  public boolean getBass(String guitarId) {
    FretlightGuitar guitar = mGuitars.getById(guitarId);
    return guitar.isBass();
  }

  @ReactMethod
  public void setLeft(boolean isLeft, String guitarId) {
    FretlightGuitar guitar = mGuitars.getById(guitarId);
    guitar.setLefty(isLeft);
  }

  @ReactMethod
  public void setBass(boolean isBass, String guitarId) {
    FretlightGuitar guitar = mGuitars.getById(guitarId);
    guitar.setBass(isBass);
  }
}

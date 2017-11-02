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

import io.sentry.Sentry;
//import io.sentry.context.Context;
import io.sentry.event.BreadcrumbBuilder;

import java.util.Map;
import java.util.HashMap;
import java.lang.Thread;
import java.lang.Object;

public class GTGuitarController extends ReactContextBaseJavaModule {
  ReactApplicationContext context;
  io.sentry.context.Context sentryContext;
  private Guitars mGuitars;
  GuitarEmitter guitarEmitter;

  public GTGuitarController(ReactApplicationContext context) {
    super(context);

    this.context = context;
    sentryContext = Sentry.getContext();
    mGuitars = Guitars.getInstance();

    guitarEmitter = GuitarEmitter.getInstance();

    logSentryBreadcrumb("GTGuitarController instantiated");
    mGuitars.setListener(new Guitars.ChangeListener() {
      @Override
      public void onChange(String action, String guitarId) {
        if (action == "connect") {
          guitarEmitter.emit("GUITAR_CONNECTED", guitarId);
          logSentryBreadcrumb("GTGuitarController connected to guitar: " + guitarId);
          stopScanning();
          restartScanning();
        } else {
          logSentryBreadcrumb("GTGuitarController discconnected from guitar: " + guitarId);
          guitarEmitter.emit("GUITAR_DISCONNECTED", guitarId);
        }
      }
    });
  }

  @Override
  public String getName() {
    return "GTGuitarController";
  }

  private void logSentryBreadcrumb(String message) {
    sentryContext.recordBreadcrumb(new BreadcrumbBuilder().setMessage(message).build());
  }

  // REGISTER EMITTER

  @ReactMethod
  public void registerEmitter() {
    guitarEmitter.setContext(context);
  }

  // SCANNING

  @ReactMethod
  public void startScanning() {
    logSentryBreadcrumb("GTGuitarController startScanning");
    Intent intent = new Intent(context, ScanningActivity.class);
    context.startActivity(intent);
  }

  @ReactMethod
  public void stopScanning() {
    logSentryBreadcrumb("GTGuitarController stopScanning");
    Intent intent = new Intent(context, ScanningActivity.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.putExtra("EXIT", true);
    context.startActivity(intent);
  }

  private void restartScanning() {
    logSentryBreadcrumb("GTGuitarController restartScanning");
    Intent intent = new Intent(context, ScanningActivity.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
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

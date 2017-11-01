package com.optek.guitartunes.ble;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import com.optek.fretlight.sdk.FretlightGuitar;

public class GuitarEmitter {
  private static final GuitarEmitter sInstance = new GuitarEmitter();
  private RCTDeviceEventEmitter emitter;

  public static GuitarEmitter getInstance() {
    return sInstance;
  }

  public void setContext(ReactApplicationContext context) {
    emitter = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
  }

  public void emit(String type, String message) {
    emitter.emit(type, message);
  }

  private GuitarEmitter() {
  }
}
package com.optek.guitartunes;

import android.content.Context;
import android.content.ContentResolver;
import android.database.ContentObserver;
import android.os.HandlerThread;
import android.os.Handler;
import android.os.Message;
import android.media.AudioManager;
import android.net.Uri;
import android.provider.Settings;
import android.provider.Settings.System;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import java.util.Map;
import java.util.HashMap;
import java.lang.Thread;
import java.lang.Object;

public class BSVolumeController extends ReactContextBaseJavaModule {
  ReactApplicationContext context;
  HandlerThread thread;
  VolumeObserver volumeObserver;

  public BSVolumeController(ReactApplicationContext context) {
    super(context);
    this.context = context;
  }

  @Override
  public String getName() {
    return "BSVolumeController";
  }

  @ReactMethod
  public void setVolume(final Float value) {
    AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    int volume = Math.round(audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC) * value);
    audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, volume, 0);
  }

  @ReactMethod
  public void subscribe() {
    // start worker thread to update controller
    thread = new HandlerThread("BSVolumeControllerThread");
    thread.start();
    Handler handler = new Handler(thread.getLooper());

    ContentResolver resolver = context.getContentResolver();
    Uri musicURI = android.provider.Settings.System.CONTENT_URI;
    AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    RCTDeviceEventEmitter emitter = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

    volumeObserver = new VolumeObserver(handler, audioManager, emitter);
    resolver.registerContentObserver(musicURI, true, volumeObserver);
  }

  @ReactMethod
  public void unsubscribe() {
    ContentResolver resolver = context.getContentResolver();
    resolver.unregisterContentObserver(volumeObserver);
    thread.quit();
  }
}

class VolumeObserver extends ContentObserver {
  AudioManager audioManager;
  RCTDeviceEventEmitter emitter;

  public VolumeObserver(Handler handler, AudioManager manager, RCTDeviceEventEmitter deviceEmitter) {
    super(handler);
    audioManager = manager;
    emitter = deviceEmitter;
    this.emit();
  }

  private void emit() {
    float current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
    float max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
    float volume = current / max;
    emitter.emit("VOLUME_CHANGE", volume);
  }

  @Override
  public boolean deliverSelfNotifications() {
    return super.deliverSelfNotifications();
  }

  @Override
  public void onChange(boolean selfChange) {
    //Log.d("BSVolumeController", "volume changed");
  }

  @Override
  public void onChange(boolean selfChange, Uri uri) {
    emit();
  }
}
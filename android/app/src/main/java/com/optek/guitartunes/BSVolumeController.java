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
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;
import java.util.HashMap;
import java.lang.Thread;
import java.lang.Object;

public class BSVolumeController extends ReactContextBaseJavaModule {
  ReactApplicationContext context;
  HandlerThread workerThread;
  Handler workerQueue;
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
    Log.d("BSVolumeController", "set volume " + volume);
  }

  @ReactMethod
  public void getVolume(final Callback callback) {
    try {
      AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
      int current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
      int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
      callback.invoke(current / max);
    } catch (Exception error) {
      WritableMap e = Arguments.createMap();
      e.putInt("code", -1);
      e.putString("message", error.getMessage());
      callback.invoke(e);
    }
  }

  @ReactMethod
  public void subscribe(final Callback callback) {
    // start worker thread to update controller
    workerThread = new HandlerThread("BSVolumeController worker");
    workerThread.start();
    workerQueue = new Handler(workerThread.getLooper());

    final ContentResolver resolver = context.getContentResolver();
    final Uri musicURI = System.getUriFor("volume_music");
    AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    volumeObserver = new VolumeObserver(workerQueue, audioManager, callback);
    resolver.registerContentObserver(musicURI, false, volumeObserver);

    int current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
    int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
    callback.invoke(current / max);
    Log.d("BSVolumeController", "subscribing");
    Log.d("BSVolumeController", "callback " + callback);
    Log.d("BSVolumeController", "volume " + (current / max));
  }

  @ReactMethod
  public void unsubscribe() {
    ContentResolver resolver = context.getContentResolver();
    resolver.unregisterContentObserver(volumeObserver);
    workerThread.quit();
    Log.d("BSVolumeController", "unsubscribing");
  }
}

class VolumeObserver extends ContentObserver {
  AudioManager audioManager;
  Callback volumeCallback;

  public VolumeObserver(Handler handler, AudioManager manager, Callback callback) {
    super(handler);
    audioManager = manager;
    volumeCallback = callback;
  }

  @Override
  public void onChange(boolean selfChange) {
    this.onChange(selfChange);

    int current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
    int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
    Log.d("BSVolumeController", "volume changed " + current / max);
    volumeCallback.invoke(current / max);
  }
}
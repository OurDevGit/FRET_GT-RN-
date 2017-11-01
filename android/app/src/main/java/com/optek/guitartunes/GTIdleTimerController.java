package com.optek.guitartunes;

import android.content.Context;
import android.app.Activity;
import android.view.WindowManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class GTIdleTimerController extends ReactContextBaseJavaModule {
  public GTIdleTimerController(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "GTIdleTimerController";
  }

  private void toggleTimer(final boolean shouldDisable) {
    final Activity activity = this.getCurrentActivity();
    if (activity != null) {
      activity.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          if (shouldDisable) {
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
          } else {
            activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
          }
        }
      });
    }
  }

  @ReactMethod
  public void stop() {
    this.toggleTimer(true);
  }

  @ReactMethod
  public void start() {
    this.toggleTimer(false);
  }
}
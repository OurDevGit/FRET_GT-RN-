package com.optek.guitartunes;

import java.util.Arrays;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class GTCrypto extends ReactContextBaseJavaModule {
  public static byte[] appSalt;

  public GTCrypto(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "GTCrypto";
  }

  @ReactMethod
  public void setSalt(String salt) {
    GTCrypto.appSalt = Arrays.copyOfRange(salt.getBytes(), 0, 8);
  }
}
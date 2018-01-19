package com.optek.guitartunes;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.horcrux.svg.SvgPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.RNFetchBlob.RNFetchBlobPackage;
import cn.qiuxiang.react.recording.RecordingPackage;
import org.wonday.pdf.RCTPdfView;
import com.chirag.RNMail.RNMail;
import io.sentry.RNSentryPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

// Facebook SDK
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  StreamProxy webServer;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(), new SvgPackage(), new RNMixpanel(),
          new RecordingPackage(), new RCTPdfView(), new RNMail(), new RNFetchBlobPackage(),
          new RNSentryPackage(MainApplication.this), new ReactVideoPackage(), new InAppBillingBridgePackage(),
          new RNSoundPackage(), new GTReactPackage(), new FBSDKPackage(mCallbackManager));
    }
  };

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    webServer = new StreamProxy();
    webServer.start();
  }
}

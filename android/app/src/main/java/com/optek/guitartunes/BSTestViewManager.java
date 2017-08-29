package com.optek.guitartunes;

import android.view.View;
import android.util.Log;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReadableArray;
import javax.annotation.Nullable;

import android.graphics.Canvas;
import com.optek.guitartunes.GuitarTunesStyleKit;

public class BSTestViewManager extends SimpleViewManager<BSPaintCodeView> {

  public static final String REACT_CLASS = "RCTBsTestView";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public BSPaintCodeView createViewInstance(ThemedReactContext context) {
    return new BSPaintCodeView(context);
    // return new View(context);
    // return new ReactImageView(context, Fresco.newDraweeControllerBuilder(), mCallerContext);
  }

  @ReactProp(name = "drawMethod")
  public void setDrawMethod(BSPaintCodeView view, @Nullable String drawMethod) {
    view.drawMethod = drawMethod;
    view.invalidate();
  }

  @ReactProp(name = "drawArgs")
  public void setArgs(BSPaintCodeView view, @Nullable ReadableArray drawArgs) {
    view.drawArgs = drawArgs;
    view.invalidate();
  }

}
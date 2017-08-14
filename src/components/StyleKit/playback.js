import React, { Component } from "react";
import { View } from "react-native";
import { PaintCode, PaintCodeButton, PaintCodeButtonWithColor } from "./lib";

export const BtnPlay = props => {
  return (
    <PaintCodeButtonWithColor
      //drawBtnPlay(Canvas canvas, boolean isPressed, boolean isShowingPause, float redValue, float greenValue, float blueValue) {
      drawMethod="BtnPlay"
      drawArgs={[
        "isPressed",
        "isShowingPause",
        "redValue",
        "greenValue",
        "blueValue"
      ]}
      {...props}
    />
  );
};

export const Heart = () => {
  return (
    //drawBtnPlayiPhone(Canvas canvas, boolean isPressed, boolean isShowingPause, float redValue, float greenValue, float blueValue)
    <View>
      <PaintCodeButton
        drawMethod="BtnFavorite"
        style={{ width: 20, height: 20 }}
      />
    </View>
  );
};

/*
drawBtnRewind(Canvas canvas, Context context, boolean isPressed, float redValue, float greenValue, float blueValue)
drawBtnForward(Canvas canvas, Context context, boolean isPressed, float redValue, float greenValue, float blueValue)
drawBtnLoopRight(Canvas canvas)
drawBtnLoopLeft(Canvas canvas)
drawBtnLoop(Canvas canvas, boolean isPressed, boolean loopsEnabled)
drawBtnSettings(Canvas canvas, boolean isPressed)
drawBtnLibrary(Canvas canvas, boolean isPressed)
drawBtnPrevious(Canvas canvas, boolean isPressed, float redValue, float greenValue, float blueValue)
drawBtnNext(Canvas canvas, boolean isPressed, float redValue, float greenValue, float blueValue)
drawBtnFavorite(Canvas canvas, boolean isPressed)
drawBtnTuner(Canvas canvas, boolean hasAlternateTuning)
drawBtnPreviousCompact(Canvas canvas, RectF frame, boolean isPressed)
drawBtnNextCompact(Canvas canvas, RectF frame, boolean isPressed)
drawBtnPlayCompact(Canvas canvas, RectF frame, boolean isPressed, boolean isShowingPause)
drawBtnForwardCompact(Canvas canvas, RectF frame, boolean isPressed)
drawBtnRewindCompact(Canvas canvas, RectF frame, boolean isPressed)
drawSeekSliderCompact(Canvas canvas, float percent, PointF scrollSize, float loopLeft, float loopRight, boolean loopsEnabled)
drawBtnLibraryCompact(Canvas canvas, RectF frame, boolean isPressed)
drawIconStatusConnected(Canvas canvas)
drawBtnNextiPhone(Canvas canvas, boolean isPressed, float redValue, float greenValue, float blueValue)
drawBtnPlayiPhone(Canvas canvas, boolean isPressed, boolean isShowingPause, float redValue, float greenValue, float blueValue)
drawBtnRewindiPhone(Canvas canvas, boolean isPressed, float redValue, float greenValue, float blueValue)
drawBtnForwardiPhone(Canvas canvas, boolean isPressed, float redValue, float greenValue, float blueValue)
drawBtnPreviousiPhone(Canvas canvas, boolean isPressed, float redValue, float greenValue, float blueValue)
drawIPhoneBtnFretlightStatus(Canvas canvas, Context context, boolean isPressed, float redValue, float greenValue, float blueValue, float connectedDevices)
drawIPhoneBtnTempo(Canvas canvas, Context context, boolean isPressed, boolean isAlt, float rate)
drawIPhoneVolumeIcon(Canvas canvas)
drawIPhoneBtnLoopToggle(Canvas canvas, boolean isPressed, boolean isAlt, boolean loopsEnabled)
drawIPhoneBtnLoopSave(Canvas canvas, boolean isPressed, boolean isAlt)
drawIPhoneBtnMyLoops(Canvas canvas, boolean isPressed, boolean isAlt)
drawBtnTwitter(Canvas canvas, boolean isPressed)
drawBtnFacebook(Canvas canvas, boolean isPressed)
drawBtnMail(Canvas canvas, boolean isPressed)
drawBtnStepNext(Canvas canvas, RectF frame, boolean isPressed)
drawBtnStepPrev(Canvas canvas, RectF frame, boolean isPressed)
drawBtnFullscreen(Canvas canvas) 
drawBtnFretboard(Canvas canvas, boolean isPressed)
drawBtnChordsAndScales(Canvas canvas, boolean isChordsAndScales)
drawJambarBG(Canvas canvas, RectF frame)
drawJambarBGIphone(Canvas canvas, RectF frame)
drawJambarLens(Canvas canvas, RectF frame) 
drawJambarLensWide(Canvas canvas, RectF frame)
drawBtnExitFullscreen(Canvas canvas)
drawBtnMailSignup(Canvas canvas, boolean isPressed)
drawBtnHome(Canvas canvas, boolean isHome)
drawBtnCloudDownload(Canvas canvas, RectF targetFrame, ResizingBehavior resizing)
drawIndeterminateCircle(Canvas canvas, RectF targetFrame, ResizingBehavior resizing, float angle)
drawCircularProgress(Canvas canvas, RectF targetFrame, ResizingBehavior resizing, float angle)
drawBuyButton(Canvas canvas, Context context, RectF targetFrame, ResizingBehavior resizing, String priceText, float fontSize, String topText, String bottomText)
drawBtnFavoriteSmall(Canvas canvas, boolean isPressed)
drawBtnTrashCan(Canvas canvas, RectF targetFrame, ResizingBehavior resizing)
drawPreviewProgress(Canvas canvas, RectF targetFrame, ResizingBehavior resizing, float angle)
drawPreviewPlay(Canvas canvas, RectF targetFrame, ResizingBehavior resizing, boolean isShowingPause)
drawTunerBG(Canvas canvas, RectF frame, float tuningDistance)
drawTunerNeedle(Canvas canvas, RectF frame)
*/

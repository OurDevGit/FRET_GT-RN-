package com.guitartunes;

import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Collections;
import java.util.Arrays;
import java.lang.Double;
import java.lang.reflect.*;
import java.lang.reflect.Method;
import android.view.View;
import jdk.internal.dynalink.linker.MethodTypeConversionStrategy;
import android.util.Log;
import android.util.AttributeSet;
import android.content.Context;
import android.graphics.Canvas;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableArray;

public class BSPaintCodeView extends View {

  public String drawMethod = "BtnLoopLeft";
  public ReadableArray drawArgs;

  private static final Map<String, String[]> paintCodeTypes;
  static {
    // TODO: handle PC types PointF, RectF, ResizingBehavior
    /*
    public enum ResizingBehavior {
        AspectFit, //!< The content is proportionally resized to fit into the target rectangle.
        AspectFill, //!< The content is proportionally resized to completely fill the target rectangle.
        Stretch, //!< The content is stretched to match the entire target rectangle.
        Center, //!< The content is centered in the target rectangle, but it is NOT resized.
    }
    */

    Map<String, String[]> aMap = new HashMap<String, String[]>();
    aMap.put(ReadableType.Boolean.toString(), new String[] { "boolean" });
    aMap.put(ReadableType.Number.toString(), new String[] { "float" });
    aMap.put(ReadableType.String.toString(), new String[] { "string" });
    // aMap.put(ReadableType.Map.toString(), new String[] { "map" });
    // aMap.put(ReadableType.Array.toString(), new String[] { "array" });
    paintCodeTypes = Collections.unmodifiableMap(aMap);
  }

  public BSPaintCodeView(Context context) {
    super(context);
  }

  @Override
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);

    String methodName = "draw" + this.drawMethod;
    Class clazz = GuitarTunesStyleKit.class;

    Method[] allMethods = clazz.getMethods();
    Method foundMethod = null;

    foundMethod = findCanvasOnlyMatch(allMethods, methodName);

    if (foundMethod != null) {
      Log.w("BSPaintCodeView", "found a matching draw method.");

      try {
        ArrayList drawArgsList = this.drawArgs.toArrayList();
        drawArgsList.add(0, canvas); // make param 0 the Canvas object
        ArrayList paintCodeArgs = convertArgs(drawArgsList);

        foundMethod.invoke(null, paintCodeArgs.toArray());
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      }
    } else {
      Log.w("BSPaintCodeView", "no matching draw method found.");
      // TODO: Inform the user that their draw method couldn't be found
    }

    // GuitarTunesStyleKit.drawBtnLoopRight(canvas);
    // GuitarTunesStyleKit.drawBtnSettings(canvas, true);
    // Boolean arg = false;
    // if (this.drawArgs != null) {
    //   Log.d("PC View", "using drawArgs");
    //   arg = this.drawArgs.getBoolean(0);
    // } else {
    //   Log.d("PC View", "NOT using drawArgs");
    // }
    // GuitarTunesStyleKit.drawPreviewPlay(canvas, arg);
  }

  private Method findCanvasOnlyMatch(Method[] allMethods, String methodName) {
    // Method foundMethod = null;

    // Look for a matching method
    for (Method method : allMethods) {
      // check method name
      if (method.getName().equals(methodName)) {
        Type[] methodParamTypes = method.getGenericParameterTypes();

        // check it has the same number of params (not counting Canvas as param 1)
        if (methodParamTypes.length == this.drawArgs.size() + 1) {
          boolean isMatch = true;
          int i = 0;

          // check that each param has the same type as the passed drawArgs
          for (Type t : methodParamTypes) {
            String methodType = t.toString();
            String argType = this.drawArgs.getType(i).toString();
            if (methodType.equalsIgnoreCase("class android.graphics.Canvas") && i == 0) {
              // ignore the first param if it's Canvas
            } else {
              // if there is a type mis-match, then this isn't the right match
              if (propertyMatches(methodType, argType) == false) {
                // if (methodType.equalsIgnoreCase(argType) == false) {
                Log.d("match checker", "mis-match");
                Log.d("match checker", methodType);
                Log.d("match checker", argType);
                isMatch = false;
              }

              i += 1;
            }
          }

          // if we matched, use this Method
          if (isMatch) {
            // foundMethod = method;
            return method;
          }
        }
      }
    }

    return null;
  }

  private ArrayList convertArgs(ArrayList args) {

    ArrayList<Object> newArgs = new ArrayList<>(args.size());
    for (Object object : args) {
      Log.d("iterating args", object.getClass().getName());
      if (object.getClass().getName().equals("java.lang.Float")) {
        Log.d("iterating args", "converting Float");
        newArgs.add(((Float) object).floatValue());
      } else if (object.getClass().getName().equals("java.lang.Double")) {
        Log.d("iterating args", "converting Double");
        newArgs.add(((Double) object).floatValue());
      } else if (object.getClass().getName().equals("java.lang.Boolean")) {
        Log.d("iterating args", "converting Boolean");
        newArgs.add(((Boolean) object).booleanValue());
      } else {
        newArgs.add(object);
      }
    }

    return newArgs;
  }

  private boolean propertyMatches(String paintCodeParam, String jsProp) {
    String[] pcTypes = BSPaintCodeView.paintCodeTypes.get(jsProp);
    boolean doesMatch = Arrays.asList(pcTypes).contains(paintCodeParam.toLowerCase());

    if (doesMatch) {
      Log.d("propertyMatches", "found match: " + paintCodeParam + " / " + jsProp);
    } else {
      Log.d("propertyMatches", "found MISmatch: " + paintCodeParam + " / " + jsProp);
    }

    return doesMatch;
  }
}
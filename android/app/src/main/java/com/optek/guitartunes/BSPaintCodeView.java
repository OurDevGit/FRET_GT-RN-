package com.optek.guitartunes;

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
import android.graphics.RectF;
import android.graphics.PointF;
import jdk.internal.dynalink.linker.MethodTypeConversionStrategy;
import android.util.Log;
import android.util.AttributeSet;
import android.content.Context;
import android.graphics.Canvas;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public class BSPaintCodeView extends View {

  private static final String TAG = "BSPaintCodeView";

  public String drawMethod = "BtnLoopLeft";
  public ReadableArray drawArgs;
  public String styleKitClass = "com.optek.guitartunes.GuitarTunesStyleKit";
  public Context ctx;

  private static final Map<String, String[]> paintCodeTypes;
  static {
    // TODO: handle PC types String
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
    aMap.put(ReadableType.Map.toString(), new String[] { "class android.graphics.RectF" });
    // aMap.put(ReadableType.Map.toString(), new String[] { "map" });
    // aMap.put(ReadableType.Array.toString(), new String[] { "array" });
    paintCodeTypes = Collections.unmodifiableMap(aMap);
  }

  public BSPaintCodeView(Context context) {
    super(context);
    this.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
    this.ctx = context;
  }

  @Override
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);

    float displayDensity = getResources().getDisplayMetrics().density;
    canvas.scale(displayDensity, displayDensity);

    String methodName = "draw" + this.drawMethod;
    try {
      Class clazz = Class.forName(this.styleKitClass);

      Method[] allMethods = clazz.getMethods();
      Method foundMethod = null;
      boolean usesContext = false;

      // Log.d(TAG, "onDraw: " + methodName);

      foundMethod = findCanvasOnlyMatch(allMethods, methodName);
      if (foundMethod == null) {
        // Log.d(TAG, "Canvas-only not found, looking for Context version");
        foundMethod = findContextMatch(allMethods, methodName);
        usesContext = true;
      }

      if (foundMethod != null) {
        // Log.w(TAG, "found a matching draw method.");

        try {
          ArrayList drawArgsList = this.drawArgs.toArrayList();
          drawArgsList.add(0, canvas); // make param 0 the Canvas object
          if (usesContext) {
            drawArgsList.add(1, this.ctx);
          }
          ArrayList paintCodeArgs = convertArgs(drawArgsList);

          // Log.d(TAG, "dynamically invoking " + foundMethod.toString() + " with: " + paintCodeArgs.toString());

          foundMethod.invoke(null, paintCodeArgs.toArray());
        } catch (InvocationTargetException e) {
          e.printStackTrace();
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        }
      } else {
        // Log.w(TAG, "no matching draw method found.");
        // TODO: Inform the user that their draw method couldn't be found
      }
    } catch (ClassNotFoundException e) {
      // Log.e(TAG, e.toString());
    }
  }

  private Method findContextMatch(Method[] allMethods, String methodName) {
    String[] args = { "class android.graphics.Canvas", "class android.content.Context" };

    Method foundMethod = findMatchWithDefaults(allMethods, methodName, args);
    if (foundMethod != null) {
      // Log.d(TAG, "found a method");
    } else {
      // Log.d(TAG, "no method found");
    }

    return foundMethod;
  }

  // Look for a matching method which takes Canvas as arg 1 (but does not take Context as arg 2)
  private Method findCanvasOnlyMatch(Method[] allMethods, String methodName) {

    String[] args = { "class android.graphics.Canvas" };

    Method foundMethod = findMatchWithDefaults(allMethods, methodName, args);
    if (foundMethod != null) {
      // Log.d(TAG, "found a method");
    } else {
      // Log.d(TAG, "no method found");
    }
    return foundMethod;
  }

  private Method findMatchWithDefaults(Method[] allMethods, String methodName, String[] defaultArgs) {
    // Look for a matching method
    for (Method method : allMethods) {
      // check method name
      if (method.getName().equals(methodName)) {
        Type[] methodParamTypes = method.getGenericParameterTypes();
        // Log.d(TAG, methodParamTypes.toString());

        if (methodParamTypes.length == this.drawArgs.size() + defaultArgs.length) {

          // compare the method params with the default args and if any are different then return null early
          for (int i = 0; i < defaultArgs.length; i++) {
            if (methodParamTypes[i].toString().equals(defaultArgs[i]) == false) {
              // Log.d(TAG, "right number of args, but default arg type mismatch");
              // Log.d(TAG, methodParamTypes[i].toString());
              // Log.d(TAG, defaultArgs[i]);
              return null;
            }
          }

          boolean isMatch = true;
          // check that each param has the same type as the passed drawArgs
          for (int i = 0; i < this.drawArgs.size(); i++) {
            Type t = methodParamTypes[i + defaultArgs.length];
            String methodType = t.toString();
            String argType = this.drawArgs.getType(i).toString();
            if (i >= defaultArgs.length) {
              // if there is a type mis-match, then this isn't the right match
              if (propertyMatches(methodType, argType) == false) {
                isMatch = false;
              }
            }
          }

          // if we matched, return this Method
          if (isMatch) {
            return method;
          }
        } else {
          // Log.d(TAG, "right name, wrong number of arguments");
        }
      } // method name check
    } // for allMethods

    return null;
  }

  private boolean isPoint(Object object) {
    if (object instanceof HashMap) {
      return isPoint((HashMap) object);
    } else {
      return false;
    }
  }

  private boolean isRect(Object object) {
    if (object instanceof HashMap) {
      return isRect((HashMap) object);
    } else {
      return false;
    }
  }

  private boolean isResizingBehavior(Object object) {
    if (object instanceof String) {
      return isResizingBehavior((String) object);
    } else {
      return false;
    }
  }

  private boolean isPoint(HashMap map) {
    return (map.containsKey("x") && map.containsKey("y") && map.size() == 2);
  }

  private boolean isRect(HashMap map) {
    return (map.containsKey("left") && map.containsKey("top") && map.containsKey("right") && map.containsKey("bottom")
        && map.size() == 4);
  }

  private boolean isResizingBehavior(String str) {
    return (str.equals("ResizingBehavior.AspectFit") || str.equals("ResizingBehavior.AspectFill")
        || str.equals("ResizingBehavior.Stretch") || str.equals("ResizingBehavior.Center"));
  }

  private RectF makeRectF(HashMap map) {
    if (isRect(map)) {
      Double left = (Double) map.get("left");
      Double top = (Double) map.get("top");
      Double right = (Double) map.get("right");
      Double bottom = (Double) map.get("bottom");
      RectF newRect = new RectF(left.floatValue(), top.floatValue(), right.floatValue(), bottom.floatValue());
      return newRect;
    } else {
      return null;
    }
  }

  private PointF makePointF(HashMap map) {
    if (isPoint(map)) {
      Double x = (Double) map.get("x");
      Double y = (Double) map.get("y");

      PointF newPoint = new PointF(x.floatValue(), y.floatValue());
      return newPoint;
    } else {
      return null;
    }
  }

  // https://stackoverflow.com/questions/3735927/java-instantiating-an-enum-using-reflection
  private Object makeResizingBehavior(String behavior) {
    // Log.d(TAG, "making resizing behavior: " + behavior);
    String behaviorVal = behavior.split("\\.")[1];

    try {
      Class klass = Class.forName(this.styleKitClass + "$ResizingBehavior");
      Field field = klass.getDeclaredField(behaviorVal);

      if (field.getType().isEnum()) {
        // Log.d(TAG, "is Enum!");
        Object resizeBehavior = Enum.valueOf((Class<Enum>) field.getType(), behaviorVal);
        // Log.d(TAG, resizeBehavior.toString());
        return resizeBehavior;
      }
    } catch (ClassNotFoundException e) {
      // Log.d(TAG, "Couldn't create ResizingBehavior class for " + this.styleKitClass);
    } catch (NoSuchFieldException e) {
      // Log.d(TAG, "ResizingBehavior getDeclareField failed...");
      // Log.e(TAG, e.toString());
      return null;
    }

    return null;
  }

  private ArrayList convertArgs(ArrayList args) {

    ArrayList<Object> newArgs = new ArrayList<>(args.size());

    // iterate through the args and replace them one by one
    for (Object object : args) {
      // Log.d(TAG, object.getClass().getName());

      // ResizingBehavior
      if (isResizingBehavior(object)) {
        // Log.d(TAG, "is a ResizingBehavior String");
        Object resizingBehavior = makeResizingBehavior((String) object);
        // Log.d(TAG, "made it!");
        newArgs.add(resizingBehavior);

        // String to String
      } else if (object instanceof String) {
        // Log.d(TAG, "converting String");
        newArgs.add(object);
        // Float to float
      } else if (object.getClass().getName().equals("java.lang.Float")) {
        // Log.d(TAG, "converting Float");
        newArgs.add(((Float) object).floatValue());

        // Double to float
      } else if (object.getClass().getName().equals("java.lang.Double")) {
        // Log.d(TAG, "converting Double");
        newArgs.add(((Double) object).floatValue());

        // Boolean to boolean
      } else if (object.getClass().getName().equals("java.lang.Boolean")) {
        // Log.d(TAG, "converting Boolean");
        newArgs.add(((Boolean) object).booleanValue());

        // Point to PointF
      } else if (isPoint(object)) {
        // Log.d(TAG, "Doing Point");
        HashMap point = (HashMap) object;
        PointF jPoint = makePointF(point);
        newArgs.add(jPoint);

        // Rect to RectF
      } else if (isRect(object)) {
        // Log.d(TAG, "Doing HashMap");
        HashMap rect = (HashMap) object;
        RectF jRect = makeRectF(rect);
        newArgs.add(jRect);
      } else {
        // Log.w(TAG, "adding arg object without converting it: " + object.toString());
        // Log.w(TAG, "adding arg object without converting it: " + object.getClass().getName());
        newArgs.add(object);
      }
    }

    return newArgs;

  }

  private boolean propertyMatches(String paintCodeParam, String jsProp) {
    // Log.d("propertyMatches", paintCodeParam);
    // Log.d("propertyMatches", jsProp);
    String[] pcTypes = BSPaintCodeView.paintCodeTypes.get(jsProp);

    if (pcTypes == null) {
      // Log.d("propertyMatches", "no matching types found for " + jsProp + "!");
      return false;
    } else {
      return true;
    }

    // boolean doesMatch = Arrays.asList(pcTypes).contains(paintCodeParam.toLowerCase());

    // if (doesMatch) {
    //   Log.d("propertyMatches", "found match: " + paintCodeParam + " / " + jsProp);
    // } else {
    //   Log.d("propertyMatches", "found MISmatch: " + paintCodeParam + " / " + jsProp);
    // }

    // return doesMatch;
  }
}
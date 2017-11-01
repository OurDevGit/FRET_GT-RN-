package com.optek.guitartunes.ble;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import android.util.Log;

import com.optek.fretlight.sdk.FretlightGuitar;

public class Guitars implements Iterable<FretlightGuitar> {
  private List<FretlightGuitar> mGuitars = new ArrayList<>();
  private ChangeListener listener;

  private static final Guitars sInstance = new Guitars();

  private static final String TAG = "GTGuitarController";

  public static Guitars getInstance() {
    return sInstance;
  }

  public ChangeListener getListener() {
    return listener;
  }

  public void setListener(ChangeListener listener) {
    Log.d(TAG, "setListener");
    this.listener = listener;
  }

  public interface ChangeListener {
    void onChange(String action, String guitarId);
  }

  public void add(FretlightGuitar guitar) {
    Log.d(TAG, "add");
    mGuitars.add(guitar);

    if (listener != null) {
      String name = guitar.getName();
      name = name.replaceAll("Fretlight Guitar - ", "");
      listener.onChange("connect", name);
    }
  }

  public void remove(FretlightGuitar guitar) {
    Log.d(TAG, "remove");
    mGuitars.remove(guitar);

    if (listener != null) {
      String name = guitar.getName();
      name = name.replaceAll("Fretlight Guitar - ", "");
      listener.onChange("disconnect", name);
    }
  }

  public FretlightGuitar get(int index) {
    return mGuitars.get(index);
  }

  public FretlightGuitar getById(String guitarId) {
    for (FretlightGuitar guitar : mGuitars) {
      if (guitar.getName().equals("Fretlight Guitar - " + guitarId)) {
        return guitar;
      }
    }
    return null;
  }

  public void clear() {
    Log.d(TAG, "clear");
    mGuitars.clear();
  }

  public List<FretlightGuitar> getGuitarList() {
    Log.d(TAG, "getGuitarList");
    return mGuitars;
  }

  @Override
  public Iterator<FretlightGuitar> iterator() {
    return mGuitars.iterator();
  }

  private Guitars() {
    Log.d(TAG, "Guitars()");
  }
}
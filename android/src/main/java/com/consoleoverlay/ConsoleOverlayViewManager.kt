package com.consoleoverlay

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.ConsoleOverlayViewManagerInterface
import com.facebook.react.viewmanagers.ConsoleOverlayViewManagerDelegate

@ReactModule(name = ConsoleOverlayViewManager.NAME)
class ConsoleOverlayViewManager : SimpleViewManager<ConsoleOverlayView>(),
  ConsoleOverlayViewManagerInterface<ConsoleOverlayView> {
  private val mDelegate: ViewManagerDelegate<ConsoleOverlayView>

  init {
    mDelegate = ConsoleOverlayViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<ConsoleOverlayView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): ConsoleOverlayView {
    return ConsoleOverlayView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: ConsoleOverlayView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "ConsoleOverlayView"
  }
}

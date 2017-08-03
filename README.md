# Developing

## First Time
1. `npm install -g react-native-cli`
1. `npm install`
1. `react-native link`

## Developing
1. start your emulator or connect device over USB
    1. start your emulator
        1. `cd ~/Library/Android/sdk/tools`
        1. `emulator -list-avds`
        1. `emulator @[DEVICE_NAME]`
    1. connect to device  _(TODO: write device debugging section)_
1. `npm start`
1. `react-native run-android`
1. `react-native log-android` (optional)

The general development cycle is:
1. Make some changes
1. Reload in the app (on emulator or device).  
    **Tip:** You can enable "Live Reload" and "Hot Reloading" in the RN app menu. Both are ways to make it so you don't have to manually reload every time. They work differently both have their own pro's/con's
1. When you make some changes and they don't seem to be showing up:
    1. Run `react-native run-android` again.
    1. If that doesn't work, `control-c` the JS server and run `npm start` again, followed by a manual reload in the app

## In the Emulator
* ⌘M for **RN Menu** in emulator
* Double-tap the **r** key on your keyboard to reload

## On Device
Shake to get **RN Menu**

## Debugging in Chrome
TODO: Fill this out!

## Upgrading to the latest React Native
1. Install `react-native-git-upgrade` globally with NPM
1. run `react-native-git-upgrade`

# Keeping your environment and development tools up to date
1. Update Android Studio every once in a while by opening. It will prompt you for updates when opening.2
1. In Android Studio, go to the menu
    1. Tools -> Android -> SDK Manager
    1. Under Android SDK, choose the SDK Tools tabs and find updates
1. To update to the latest React Native (can be dangerous), run `react-native-git-upgrade`

# When things don't work
## Try:
1. `watchman watch-del-all`
1. `rm -rf $TMPDIR/react-*`
1. `cd android` then `./gradlew clean` then `cd ..`
1. `rm -rf node_modules && npm install` and then `npm start`

# Release Build
* `cd android && ./gradlew assembleRelease && cd ..` 
    * Fish: `cd android; and ./gradlew assembleRelease; and cd ..`
* `react-native run-android --variant=release` to test the build  
* `open android/app/build/outputs/apk/` to find the release apk

Version is set via `package.json` with [this technique](https://medium.com/@andr3wjack/versioning-react-native-apps-407469707661)

# Flexbox

[React Native uses Flexbox for layout](https://facebook.github.io/react-native/docs/flexbox.html). There is one caveat:
> Flexbox works the same way in React Native as it does in CSS on the web, with a few exceptions. The defaults are different, with **flexDirection defaulting to column instead of row**, and the **flex parameter only supporting a single number**.

## Useful Flexbox pages:
[CSSReference.io](http://cssreference.io/flexbox/)  
[Flexbox Patterns](http://www.flexboxpatterns.com/home)  
[Flexbox Cheatsheet](http://yoksel.github.io/flex-cheatsheet/)  

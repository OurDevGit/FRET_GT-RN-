# React and React Native

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

The general development is:
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

# Flexbox

[React Native uses Flexbox for layout](https://facebook.github.io/react-native/docs/flexbox.html). There is one caveat:
> Flexbox works the same way in React Native as it does in CSS on the web, with a few exceptions. The defaults are different, with **flexDirection defaulting to column instead of row**, and the **flex parameter only supporting a single number**.

## Useful Flexbox pages:
[CSSReference.io](http://cssreference.io/flexbox/)  
[Flexbox Patterns](http://www.flexboxpatterns.com/home)  
[Flexbox Cheatsheet](http://yoksel.github.io/flex-cheatsheet/)  

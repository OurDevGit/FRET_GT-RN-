# Getting Going

## First Time
1. `npm install -g react-native-cli`
1. `npm install`
1. `react-native link`

## Developing
1. start your emulator _(TODO: write emulator section)_ or connect device over USB _(TODO: write device debugging section)_
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

## Add Flexbox links here

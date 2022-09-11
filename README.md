**_NOTE_**: you must have the knowledge about [commitlint convention](https://github.com/conventional-changelog/commitlint), [react hooks](https://reactjs.org/docs/hooks-intro.html), [redux](https://redux.js.org/introduction/getting-started), [redux-toolkit](https://redux-toolkit.js.org/tutorials/typescript), [redux-saga](https://redux-saga.js.org/docs/introduction/BeginnerTutorial)

**Why we need commit convension?** ===> [Read here](https://www.mokkapps.de/blog/how-to-automatically-generate-a-helpful-changelog-from-your-git-commit-messages)

## Commit message convention

We follow the conventional commits specification for our commit messages:

- fix: Bug fixes, e.g. fix Button color on DarkTheme.
- feat: New features, e.g. add Snackbar component.
- refactor: Code refactor, e.g. new folder structure for components.
- docs: Changes into documentation, e.g. add usage example for Button.
- test: Adding or updating tests, eg unit, snapshot testing.
- chore: Tooling changes, e.g. change circleci config.
- BREAKING CHANGE: For changes that break existing usage, e.g. change API of a component.

## Installation

Install the package:

```bash
$ yarn install
```

Reinstall the package, it will remove `node_modules` folder :

```bash
$ yarn reinstall
```

Pod install:

```bash
$ yarn pod:install
```

Pod reinstall: if you { have } any error with pod, you can reinstall by this script

```bash
$ yarn pod:reinstall
```

Pod update: you can update your pod with this script

```bash
$ yarn pod:update
```

## Development

### Bundle

You can run the application bundle by the script below

```bash
$ yarn start
```

_Note_: If you want to reset cached bundle, you can use this script

```bash
$ yarn dev
```

### Android

Run this script to build a development android application.

```bash
$ yarn android
```

### iOS

Run this script to build a development android application.

```bash
$ yarn ios
```

_Note_: Read this doc if you { want } to run on your device [React native | Run on device](https://facebook.github.io/react-native/docs/running-on-device)

### Generate CHANGELOG.md and inc release version

You need generate changelog for every production release

```bash
$ yarn release
```

## Setup flipper debugger tool with redux

Step 1: Install flipper debbug app

Step 2: Set up Doctor ( Flipper )
Android SDK location: Android/sdk
IDB binary location: /usr/local/bin/idb

If you don't have IDB:

Install pip: https://pip.pypa.io/en/stable/installation/
python -m ensurepip --upgrade
python get-pip.py

Upgrading pip
python -m pip install --upgrade pip

Install IDB companion: https://fbidb.io/docs/installation/#idb-client
brew tap facebook/fb
brew install idb-companion

IDB client:
pip3 install fb-idb

Export IDB companion:
add export PATH=$PATH:/usr/local/bin/idb_companion to .bash_profile
source ~/.bash_profile

Step 3: Install react-native-flipper in project
yarn add react-native-flipper
Add use_flipper!({ 'Flipper' => 'version react-native-flipper' }) in Podfile
cd ios
pod install

Step 4: Install flipper redux
install Redux Debugger in Flipper: Plugin Manager -> Install Plugins -> search redux-debugger
-> install redux-debugger ( Redux Debugger for Flipper )

install in project: https://github.com/jk-gan/flipper-plugin-redux-debugger

Step 5: ( 144 duplicate symbols for architecture x86_64 )
Xcode -> Folder -> Pods -> Build Phases
CocaAsyncSocket -> Remove GCDAsyncUdpSocket.m
TcSockets -> Remove GCDAsyncSoket.m

**updating...**

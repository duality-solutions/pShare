## Private Share

### Software Objectives: 
- Privately and securely share data with friends, family, and business associates.
- Integrated with the operating system's file explorer.  
- Run as a distributed system without centralized adminstrators and prying eyes monitoring your activity and data.

## Boilet Plate Imported README.md

# electron-typescript-react-redux-vscode-boilerplate
> A quick-start template based-off [`electron-webpack-quick-start`](https://github.com/electron-userland/electron-webpack-quick-start)

With:

* typescript
* hot-reloading
* redux/react/react-perf devtools
* F5 debugging and breakpoints from within VSCode for both the main and renderer processes
* redux [`epics`](https://github.com/redux-observable/redux-observable) and [`sagas`](https://github.com/redux-saga/redux-saga)
* store persistence
* [`routing`](https://github.com/supasate/connected-react-router)
* unit-testing with [`Jest`](https://github.com/facebook/jest)
* e2e testing with [`Spectron`](https://github.com/electron/spectron)/[`WebDriverIO`](https://github.com/webdriverio/webdriverio)

As mentioned below, use **yarn**, not **npm**

# electron-webpack-quick-start
> A bare minimum project structure to get started developing with [`electron-webpack`](https://github.com/electron-userland/electron-webpack).

Thanks to the power of `electron-webpack` this template comes packed with...

* Use of [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) for development
* HMR for both `renderer` and `main` processes
* Use of [`babel-preset-env`](https://github.com/babel/babel-preset-env) that is automatically configured based on your `electron` version
* Use of [`electron-builder`](https://github.com/electron-userland/electron-builder) to package and build a distributable electron application

Make sure to check out [`electron-webpack`'s documentation](https://webpack.electron.build/) for more details.

## Getting Started
Simply clone down this reposity, install dependencies, and get started on your application.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

```bash
# create a directory of your choice, and copy template using curl
mkdir new-electron-webpack-project && cd new-electron-webpack-project
curl -fsSL https://github.com/electron-userland/electron-webpack-quick-start/archive/master.tar.gz | tar -xz --strip-components 1

# or copy template using git clone
git clone https://github.com/electron-userland/electron-webpack-quick-start.git
cd electron-webpack-quick-start
rm -rf .git

# install dependencies
yarn
```

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```
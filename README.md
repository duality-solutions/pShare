## pShare

### Software Objectives:
- Privately and securely share data with friends, family, and business associates.
- Integrated with the operating system's file explorer.  
- Run as a distributed system without centralized adminstrators and prying eyes monitoring your activity and data.

### Prerequisite

* `npm` - Strongly suggest using NVM outside of containers to manage multiple node versions
* `Node v8.12.0+`
* `yarn v1.16.0+`

### Development

```bash
# install any new dependencies
yarn install

# run application in development mode
yarn dev
```

### Building

```bash
# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create linux build with electron-builder on any OS
yarn dist-linux

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

### Bundling pShare's Dynamicd

To distribute pShare with a specific Dynamicd version, you must place the binaries in the specific OS folder and then build as described above.

```
   src/
   └── static/
       └── dynamicd
           ├── darwin
           |   └── dynamicd (mac binary)
           |   └── dynamic-cli (mac binary)
           ├── linux
           |   └── dynamicd (linux binary)
           |   └── dynamic-cli (linux binary)
           └── win32
               └── dynamicd (windows binary)
               └── dynamic-cli (windows binary)

```

Platform examples:
```bash
# Windows installer (.exe)
yarn dist --win
# Ubuntu package (Debian package)
yarn dist --linux
# MacOS Disk Image (DMG)
yarn dist --mac --x64
```

### Building pShare Dynamicd

New binaries can be created by following https://github.com/HiddenField/dynamic-vagrant/blob/master/docker.md#extracting-the-binary-build-artefacts-from-the-docker-image

### Installing and Running Electron App on Linux

* Run a distribution build as mentioned above
* Use your preferred distributable from within the `dist` folder. Currently available: `deb`, `tar.gz`, and `AppImage`. We test with AppImage
* Copy `pshare-0.X.X-x86_64.AppImage` onto your system (Currently tested on Ubuntu 18.04 Desktop)
* Run the pShare electron app by double clicking on the AppImage file - App should launch

### Configuring pShare on Linux

* Config is stored in `~/.pshare/.dynamic/dynamic.conf`
* Data folder is located at - `~/.pshare/.dynamic`

### Stopping pShare

* Quiting the pShare Electron App will also terminate the bundled pShare Dynamicd daemon.

### Application architecture

Information about the architecture of the application can be found in [this document](documentation/electron-redux-architecture.md)

### License

See LICENSE.md file for copying and use information.
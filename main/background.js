/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const path = require('path');
const os = require('os');
const envPath = path.resolve(process.cwd(), 'config/.env');
require('dotenv').config({ path: envPath });
const electron = require('electron');
const { app } = electron;
const serve = require('electron-serve');
const { createTaskbar } = require('./views/taskbar');
const { createContentView } = require('./views/content');
const { createPasswordView } = require('./views/password');
const { createMainWindow, attachViews } = require('./windows/main');
const { attachIPCListeners } = require('./communication/ipc');
const { isProduction, platform } = require('./utility/env_config');
const { passwords } = require('./services');
const { log } = require('./utility/logger');

// References to prevent garbage collection
global.electronRefs = {
  windows: {
    mainWindow: null,
    taskbarWindow: null
  },
  views: {
    taskbarView: null,
    contentView: null,
    passwordView: null
  }
};

global.appName = app.name;

if (isProduction) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const initialize = () => {
  app.dock.setIcon(electron.nativeImage.createFromPath(app.getAppPath() + "/resources/icons/linux/icon_256x256.png"));
  createTaskbar(app);
  createContentView(app);
  createPasswordView(app);
  createMainWindow(app);
  attachViews([global.electronRefs.views.contentView, global.electronRefs.views.taskbarView, global.electronRefs.views.passwordView]);
  attachIPCListeners();
  loadWindowContents();
};

const clearViewContent = () => {
  global.electronRefs.views.taskbarView.webContents.loadFile('');
  global.electronRefs.views.contentView.webContents.loadFile('');
};

const loadPasswordPage = () => {
  const port = process.argv[2];
  if (isProduction) {
    global.electronRefs.views.passwordView.webContents.loadURL('app://./password.html');
  } else {
    global.electronRefs.views.passwordView.webContents.loadURL(`http://localhost:${port}/password`);
  }
}

const loadCreatePasswordPage = () => {
  const port = process.argv[2];
  if (isProduction) {
    global.electronRefs.views.passwordView.webContents.loadURL('app://./create-password.html');
  } else {
    global.electronRefs.views.passwordView.webContents.loadURL(`http://localhost:${port}/create-password`);
  }
}

const loadTaskbar = () => {
  const port = process.argv[2];
  if (isProduction) {
    global.electronRefs.views.taskbarView.webContents.loadURL('app://./home.html');
  } else {
    global.electronRefs.views.taskbarView.webContents.loadURL(`http://localhost:${port}/home`);
  }
}

const loadHomepage = () => {
  global.electronRefs.views.contentView.webContents.loadURL('https://www.google.com/');
  // if(!isProduction){
  //   global.electronRefs.views.contentView.webContents.openDevTools({ mode: 'detach' });
  // } 
}

const loadWindowContents = () => {
  global.electronRefs.views.contentView.setBackgroundColor('#2B2E3B');

  passwords.getPassword('app:global')
    .then(data => data ? loadPasswordPage() : loadCreatePasswordPage())
    .catch(error => {
      loadCreatePasswordPage();
    });

  global.electronRefs.views.passwordView.webContents.once('did-finish-load', () => {
    setTimeout(() => {
      loadTaskbar();

      global.electronRefs.views.taskbarView.webContents.once('did-finish-load', () => {
        // if(!isProduction){
        //   global.electronRefs.views.taskbarView.webContents.openDevTools({ mode: 'detach' });
        // } 
        loadHomepage();
      });
    }, 2000);
  });

};

app.on('ready', () => initialize());

// (macOS) app icon clicked in dock
app.on('activate', () => initialize());

app.on('window-all-closed', () => {
  global.electronRefs.views.contentView.webContents.clearHistory();
  clearViewContent();
  if (platform !== 'darwin') app.quit();
});

app.on('browser-window-blur', e => log.info('app::', 'Focus Lost'));

app.on('browser-window-focus', e => log.info('app::', 'Focus Gained'));

app.on('before-quit', e => log.info('app::', 'About to Quit'));

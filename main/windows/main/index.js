/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { createWindow } = require('../generic/create_window');
const { setViewBoundsTaskbar } = require('../../views/taskbar');
const { setViewBoundsContent } = require('../../views/content');
const {setViewBoundsPassword} = require('../../views/password');

const resizeInnerContents = () => {
  const { width, height } = global.electronRefs.windows.mainWindow.getBounds();
  setViewBoundsTaskbar(width, height);
  setViewBoundsContent(width, height);
  setViewBoundsPassword(width, height);
};

const attachViews = (views) => {
  for (let v of views) {
    global.electronRefs.windows.mainWindow.addBrowserView(v);
  }
  resizeInnerContents();
};

const createMainWindow = (app) => {
  if (global.electronRefs.windows.mainWindow !== null)
    return null;

  global.electronRefs.windows.mainWindow = createWindow(app.name, {
    title: app.name,
    icon: `${__dirname}/../../../resources/icons/mac/wanami.icns`,
    resizable: true,
    backgroundColor: '#2B2E3B',
    opacity: 1,
    width: 1000,
    height: 800,
    minWidth: 520,
    minHeight: 360,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false
    }
  });

  global.electronRefs.windows.mainWindow.on('resize', resizeInnerContents);

  global.electronRefs.windows.mainWindow.on('closed', () => {
    global.electronRefs.windows.mainWindow = null;
  });

};

module.exports = {
  createMainWindow,
  attachViews
};

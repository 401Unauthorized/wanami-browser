/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { BrowserView } = require('electron');
const { isProduction } = require('../../utility/env_config');
const { log } = require('../../utility/logger');

const setViewBoundsTaskbar = (width, height) => {
  global.electronRefs.views.taskbarView.setBounds({ x: 0, y: 0, width, height: 56 });
}

const createTaskbar = (app) => {
  if (global.electronRefs.views.taskbarView !== null)
    return null;

  global.electronRefs.views.taskbarView = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      backgroundThrottling: false
    }
  });

  attachListeners();
};

const attachListeners = () => {
  if(attachListeners.singleton) return;

  global.electronRefs.views.taskbarView.webContents.on('console-message', (e, level, message) => {
    log.info('Taskbar::log', level, message);
  });

  attachListeners.singleton = true;
};

module.exports = {
  createTaskbar,
  setViewBoundsTaskbar
};

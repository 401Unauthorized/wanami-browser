/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { screen, BrowserWindow, Menu, Tray } = require('electron');
const Store = require('electron-store');
const { menubar, contextMenu } = require('./menu');

let trayMenu = null;

function createWindow(windowName, options) {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  win = new BrowserWindow({
    ...options,
    ...state,
    webPreferences: {
      ...options.webPreferences,
    }
  });

  tray = new Tray(`${__dirname}/../resources/icons/linux/icon_16x16.png`);
  tray.setToolTip(windowName);
  tray.on('click', e => win.show());
  tray.on('right-click', e => {
    trayMenu = Menu.buildFromTemplate([
      { role: 'quit' }
    ]);
    tray.setContextMenu(trayMenu);
    tray.popUpContextMenu(trayMenu);
  });

  const mainMenu = Menu.buildFromTemplate(menubar);
  const context = Menu.buildFromTemplate(contextMenu);
  Menu.setApplicationMenu(mainMenu);

  win.on('close', saveState);

  win.webContents.on('context-menu', e => {
    context.popup();
  });

  return win;
};

module.exports = {
  createWindow
};

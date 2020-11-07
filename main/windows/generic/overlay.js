/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { BrowserWindow } = require('electron');
const { log } = require('../../utility/logger');

const openOverlay = (options) => {
    global.electronRefs.windows.taskbarWindow = new BrowserWindow({
        width: global.electronRefs.windows.mainWindow.getBounds().width, 
        height: global.electronRefs.windows.mainWindow.getBounds().height,
        backgroundColor: '#2B2E3B',
        opacity: .95,
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false
        },
        parent: global.electronRefs.windows.mainWindow,
        modal: true,
        show: true
    });

    global.electronRefs.windows.taskbarWindow.on('closed', () => {
        log.info('taskbarWindow::closed');
        global.electronRefs.windows.taskbarWindow = null;
    });
};

module.exports = {
    openOverlay
};

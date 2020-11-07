/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { BrowserView } = require('electron');
const { log } = require('../../utility/logger');

const setViewBoundsPassword = (width, height) => {
    global.electronRefs.views.passwordView.setBounds({ x: 0, y: 0, width, height });
}

const createPasswordView = (app) => {
    if (global.electronRefs.views.passwordView !== null)
        return null;

    global.electronRefs.views.passwordView = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            backgroundThrottling: false
        }
    });

    attachListeners();
};

const attachListeners = () => {
    if (attachListeners.singleton) return;

    global.electronRefs.views.passwordView.webContents.on('console-message', (e, level, message) => {
        log.info('Taskbar::log', level, message);
    });

    attachListeners.singleton = true;
};

module.exports = {
    createPasswordView,
    setViewBoundsPassword
};

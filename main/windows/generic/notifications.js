/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { Notification } = require('electron');
const { loadNewPage } = require('../../views/content/controller');

const launchNotification = (options) => {
    let notification = new Notification({
        title: global.appName,
        ...options
    });

    notification.show();

    notification.on('click', e => {
        if (!global.electronRefs.windows.mainWindow.isVisible()) {
            global.electronRefs.windows.mainWindow.show();
        }
    });
};

const navigateNotification = (options, url) => {
    let notification = new Notification({
        title: global.appName,
        ...options
    });

    notification.show();

    notification.on('click', e => {
        if (!global.electronRefs.windows.mainWindow.isVisible()) {
            global.electronRefs.windows.mainWindow.show();
        }
        global.electronRefs.views.contentView.webContents.loadURL(url);
    });
};

module.exports = {
    launchNotification,
    navigateNotification
};
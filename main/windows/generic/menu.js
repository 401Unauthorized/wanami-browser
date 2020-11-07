/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { platform } = require('../../utility/env_config');
const { shell } = require('electron');
const openAboutWindow = require('electron-about-window').default;
const { join } = require('path');

const menubar = [
    ...(platform === 'darwin' ? [{
        label: 'Wanami Browser',
        submenu: [
            {
                label: 'About Wanami Browser',
                click: () => {
                    // TODO: Figure out why this does not work.
                    openAboutWindow({
                        icon_path: join(__dirname, '../../../resources/icons/linux/icon_256x256.png'),
                        copyright: 'Copyright © 2020 Stephen Mendez',
                        package_json_dir: join(__dirname, '../../../'),
                        open_devtools: process.env.NODE_ENV !== 'production',
                        win_options: {
                            webPreferences: {
                                nodeIntegration: true
                            }
                        }
                    })
                }
            },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    {
        role: 'fileMenu'
    },
    {
        role: 'editMenu'
    },
    {
        role: 'viewMenu'
    },
    {
        role: 'windowMenu'
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: () => {
                    shell.openExternal('https://github.com/401unauthorized/wanami-browser')
                }
            }
        ]
    }
];

const contextMenu = [
    { role: 'editMenu' }
];

module.exports = {
    menubar,
    contextMenu
}
/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { ipcMain } = require('electron');
const domainParser = require('psl');
const { loadNewPage } = require('../../views/content/controller');
const { uplead, otp, passwords } = require('../../services');
const { sleep, validURL, checkForUpdates } = require('../../utility/helper');
const { log } = require('../../utility/logger');

const attachIPCListeners = () => {
    if (attachIPCListeners.singleton) return;

    ipcMain.handle('taskbar::navigate', (e, { protocol, url }) => {
        let toLoadURL = validURL(protocol, url) || validURL('https://', `duckduckgo.com/?q=${encodeURI(url)}`);
        try {
            log.info('taskbar::navigate', toLoadURL);
            loadNewPage(toLoadURL);
        } catch (err) {
            console.error('app::navigate', protocol, url);
        }
        return { toLoadURL };
    });

    ipcMain.handle('taskbar::open', () => {
        const { width, height } = global.electronRefs.windows.mainWindow.getBounds();
        global.electronRefs.views.taskbarView.setBounds({ x: 0, y: 0, width, height });
    });

    ipcMain.handle('taskbar::close', () => {
        const { width } = global.electronRefs.windows.mainWindow.getBounds();
        global.electronRefs.views.taskbarView.setBounds({ x: 0, y: 0, width, height: 56 });
    });

    ipcMain.handle('taskbar::reload', () => {
        global.electronRefs.views.contentView.webContents.reload();
    });

    ipcMain.handle('taskbar::back', () => {
        if (global.electronRefs.views.contentView.webContents.canGoBack()) {
            global.electronRefs.views.contentView.webContents.goBack();
        }
    });

    ipcMain.handle('taskbar::forward', () => {
        if (global.electronRefs.views.contentView.webContents.canGoForward()) {
            global.electronRefs.views.contentView.webContents.goForward();
        }
    });

    ipcMain.handle('taskbar::company-info', async (e, url) => {
        try {
            const justDomain = domainParser.get(url);
            const { data } = await uplead.getCompanyInfo(justDomain);
            log.info('app::getCompanyInfo', data);
            return data;
        } catch (error) {
            log.info('app::getCompanyInfo', error);
        }
    });

    ipcMain.handle('taskbar::otp-capture', async (e, navigation) => {
        const nativeImage = await global.electronRefs.views.contentView.webContents.capturePage();
        const jpegData = nativeImage.toJPEG(100);
        const otpObj = otp.handleOTP(jpegData, navigation);
        if (otpObj) {
            otpObj.navigation = navigation;
            const response = {
                issuer: otpObj.issuer,
                label: otpObj.label,
                digits: otpObj.digits,
                navigation
            }
            log.info(otpObj);
            return response;
        }
        return null;
    });

    ipcMain.handle('taskbar::otp-codes', async (e) => {
        return otp.getCodes();
    });

    ipcMain.handle('password::enter', async (e, input) => {
        await sleep(2000);
        if (await passwords.verifyPassword('app:global', input)) {
            log.info('app::password', 'Password Success');
            setTimeout(() => {
                global.electronRefs.windows.mainWindow.removeBrowserView(global.electronRefs.views.passwordView);
                global.electronRefs.views.passwordView.destroy();
                global.electronRefs.views.passwordView = null;
            }, 500);
            otp.initializeStore(input);
            checkForUpdates();
            return true;
        }
        log.error('app::password', 'Password Failure');
        return false;
    });

    ipcMain.handle('password::create', async (e, { password, confirmedPassword }) => {
        await sleep(2000);
        if (password === confirmedPassword) {
            return passwords.setPassword('app:global', password).then(data => {
                log.info('app::password', 'Create Password Success');
                setTimeout(() => {
                    global.electronRefs.windows.mainWindow.removeBrowserView(global.electronRefs.views.passwordView);
                    global.electronRefs.views.passwordView.destroy();
                    global.electronRefs.views.passwordView = null;
                }, 500);
                otp.initializeStore(password);
                return true;
            }).catch(error => {
                console.error('app::password', error);
                return false;
            })
        } else {
            log.error('app::password', 'Create Password Failure');
            return false;
        }
    });

    attachIPCListeners.singleton = true;
};

module.exports = {
    attachIPCListeners
};
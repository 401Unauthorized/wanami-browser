/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const normalizeUrl = require('normalize-url');
const versionCheck = require('github-version-checker');
const domainParser = require('psl');
const { URL } = require("url");
const pkg = require('../../package.json');
const { navigateNotification } = require('../windows/generic/notifications');
const { log } = require('./logger');

const getPropertySafe = (func, defaultValue) => {
    try {
        return func();
    } catch (e) {
        return defaultValue;
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const validURL = (protocol, url) => {
    try {
        log.info('app::url-check', url);
        const urlObj = new URL(normalizeUrl(url, { forceHttps: true }));
        const validDomain = domainParser.get(urlObj.hostname);
        const remProto = normalizeUrl(url, { stripProtocol: true });
        return validDomain && normalizeUrl(`${protocol}${remProto}`);
    } catch (error) {
        console.error('app::url-check', url, error);
        return false;
    }
}

const checkForUpdates = () => {
    versionCheck({
        repo: pkg.name,
        owner: pkg.repository.owner,
        currentVersion: pkg.version
    }, function (error, update) {
        if (error) {
            log.error('app::', 'Unable to Check for Available', error);
        } else if (update) {
            log.info('app::', 'Update Available', JSON.stringify(update));
            if (!update.isPrerelease) {
                navigateNotification({
                    subtitle: 'Update Available!',
                    body: `Version ${update.name} is available on GitHub`,
                    urgency: 'normal'
                },
                    update.url);
            }
        } else {
            log.info('app::', 'No Update Available');
        }
    });
};

module.exports = {
    getPropertySafe,
    sleep,
    validURL,
    checkForUpdates
};

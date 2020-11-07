/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const urlParser = require('url');
const { fetchCertificate, parseCertificate } = require('../../utility/certificates');
const { apivoid } = require('../../services');
const { launchNotification } = require('../../windows/generic/notifications');
const { log } = require('../../utility/logger');

const completedNavigation = (url) => {
    let parsedURL = urlParser.parse(url);
    let certificateError = null;
    fetchCertificate({ hostname: parsedURL.hostname }).then(function (certificate) {
        const { error, value } = parseCertificate(certificate);
        log.info('app::certificate', error, value);
        if (!error) {
            global.electronRefs.views.taskbarView.webContents.send("organization::certificate", value);
        }
    }).catch(error => {
        log.info('app::certificate', error);
        certificateError = error;
    }).finally(() => {
        if (parsedURL.protocol === 'http:' || certificateError !== null) {
            parsedURL.protocol = 'http:';
            launchNotification({
                subtitle: 'Security Warning!',
                body: 'Review the secuity panel for more information.',
                urgency: 'critical'
            });
        }

        global.electronRefs.views.taskbarView.webContents.send('navigate::new', parsedURL);
    });

    if (process.env['ENABLE_URL_CHECK'] === 'true') {
        log.info('app::getSecurityInfo', 'Fetching URL Info');
        apivoid.getSecurityInfo(url)
            .then(({ data }) => {
                log.info('app::getSecurityInfo', data);
                const response = {
                    detections: data.report.domain_blacklist.detections,
                    risk: data.report.risk_score.result,
                    security_checks: data.report.security_checks
                }

                const securityScore = Object.values(response.security_checks).reduce((accumulator, currentValue) => {
                    if (!currentValue) {
                        return accumulator + 1;
                    }
                });

                response.warning = (response.risk > 75 && response.detections > 10 && securityScore > 5);

                if (response.warning) {
                    launchNotification({
                        subtitle: 'Security Warning!',
                        body: 'Review the secuity panel for more information.',
                        urgency: 'critical'
                    });
                }

                global.electronRefs.views.taskbarView.webContents.send("security::checkup", response);

            })
            .catch(function (error) {
                console.error('app::getSecurityInfo', error);
            });
    } else {
        log.info('app::getSecurityInfo', 'Skipping Security Checks');
    }
};

const loadNewPage = (url) => {
    global.electronRefs.views.contentView.webContents.loadURL(url);
};

module.exports = {
    completedNavigation,
    loadNewPage
};

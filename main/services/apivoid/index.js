/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const axios = require('axios');
const memo = require("memoizee");
const token = process.env['APIVOID_API_TOKEN'];
const { log } = require('../../utility/logger');

const uplead = axios.create({
    baseURL: 'https://endpoint.apivoid.com/urlrep/v1/pay-as-you-go',
    timeout: 1500
});

const getSecurityInfo = async (url) => {
    log.info('app::getSecurityInfo', `Fetching ${url}`);
    const response = await uplead.get('/', {
        params: {
            key: token,
            url
        }
    }).catch(e => {
        console.error('app::getSecurityInfo', e);
    });
    return response && response.data;
};

module.exports = {
    getSecurityInfo: memo(getSecurityInfo)
};

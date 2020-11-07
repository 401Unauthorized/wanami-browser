/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const axios = require('axios');
const memo = require("memoizee");
const token = process.env['UPLEAD_API_TOKEN'];

const uplead = axios.create({
    baseURL: 'https://api.uplead.com/v2/',
    timeout: 1000,
    headers: { 'Authorization': token }
});

const getCompanyInfo = async (domain) => {
    if (process.env['ENABLE_COMPANY_DATA'] === 'true'){
        const data = await uplead.get('company-search', {
            params: {
                domain
            }
        }).catch(e => {
            console.error('app::getCompanyInfo', e);
        });
        return data && data.data;
    }
    return {};
};

module.exports = {
    getCompanyInfo: memo(getCompanyInfo)
};

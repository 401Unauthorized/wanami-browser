/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const keytar = require('keytar');
const argon2 = require('argon2');

const getPassword = async (account) => {
    return await keytar.getPassword(global.appName, account);
};

const verifyPassword = async (account, password) => {
    try {
        const hash = await getPassword(account);
        return await argon2.verify(hash, password);
    } catch (error) {
        console.error('passwords::verify', error);
        return false
    }
};

const setPassword = async (account, password) => {
    try {
        const hash = await argon2.hash(password);
        await keytar.setPassword(global.appName, account, hash);
        return true;
    } catch (error) {
        console.error('passwords::set', error);
        return false;
    }
};

module.exports = {
    getPassword,
    verifyPassword,
    setPassword
}

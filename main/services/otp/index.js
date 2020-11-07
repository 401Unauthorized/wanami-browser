/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require('fs');
const jsQR = require("jsqr");
const jpeg = require('jpeg-js');
const OTPAuth = require('otpauth');
const Store = require('electron-store');

let store = null;
let otp = [];

const handleOTP = (data, metadata = false) => {
    const code = extractQRCode(data);
    const otpConfig = code && parseOTPLink(code.data);
    const otpItem = createOTP(otpConfig);
    if (otpItem) {
        store.set(`${otpItem.issuer}-${otpItem.label}`, { otp: otpItem.toString(), metadata });
        restoreItems();
    }

    return otpItem;
};

const extractQRCode = (rawJpegData) => {
    try {
        const { data, width, height } = jpeg.decode(rawJpegData, { useTArray: true });
        return jsQR(data, width, height);
    } catch (err) {
        console.error(err);
        return null;
    }
};

const parseOTPLink = (uri) => {
    try {
        return OTPAuth.URI.parse(uri);
    } catch (err) {
        console.error(err);
        return null;
    }
};

const createOTP = (otpObject) => {
    if (otpObject instanceof OTPAuth.TOTP) {
        return new OTPAuth.TOTP(otpObject);
    } else if (otpObject instanceof OTPAuth.HOTP) {
        return OTPAuth.HOTP(otpObject);
    } else {
        return null;
    }
};

const restoreItems = () => {
    otp = [];
    for (let x of store) {
        if(x[1])
        otp.push({
            otp: createOTP(parseOTPLink(x[1].otp)),
            metadata: x[1].metadata
        });
    }
};

const getCodes = () => {
    return otp.map(x => {
        return {
            issuer: x.otp.issuer,
            label: x.otp.label,
            digits: x.otp.digits,
            code: x.otp.generate(),
            hostname: x.metadata.hostname
        }
    });
};

const seedStore = () => {
    // Example of a TOTP URI
    // otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example

    const sample = [
        'otpauth://totp/Google:alice@wanamibrowser.com?secret=JBSWY3DPEHPK3PXP&issuer=Google',
        'otpauth://totp/Facebook:alice@wanamibrowser.com?secret=JBSWY3DPEHPK3PXW&issuer=Facebook',
        'otpauth://totp/Twitter:alice@wanamibrowser.com?secret=JBSWY3DPEHPK3PXF&issuer=Twitter'
    ];

    for(let link of sample){
        const otpConfig = parseOTPLink(link);
        const otpItem = createOTP(otpConfig);
        if (otpItem) {
            store.set(`${otpItem.issuer}-${otpItem.label}`, { otp: otpItem.toString(), metadata: { hostname: 'Sample' } });
        }
    }
    restoreItems();
}

const initializeStore = (encryptionKey) => {
    store = new Store({ name: 'otp-mfa-store', accessPropertiesByDotNotation: false, encryptionKey });
    // seedStore(); // For demo purposes
    restoreItems();
};

module.exports = {
    handleOTP,
    getCodes,
    restoreItems,
    initializeStore
};

/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const https = require('https');
const Joi = require('joi');

const certificateSchema = Joi.object({
    subject: Joi.object({
        CN: Joi.optional(),
        O: Joi.optional(),
        C: Joi.optional()
    }).optional(),
    subjectaltname: Joi.optional(),
    valid_to: Joi.optional(),
    issuer: Joi.object({
        CN: Joi.optional(),
        O: Joi.optional(),
        C: Joi.optional()
    }).optional(),
}).options({ stripUnknown: true });

const fetchCertificate = (options) => {
    let config = {
        agent: false,
        ciphers: 'ALL',
        method: 'GET',
        rejectUnauthorized: true,
        ...options
    };

    return new Promise(function (resolve, reject) {
        const req = https.request(config, function (res) {
            const certificate = res.socket.getPeerCertificate();
            if (typeof (certificate) === 'undefined' || certificate === null) {
                reject({ message: 'The website did not provide a valid certificate', error: '' });
            } else {
                resolve(certificate);
            }
        });
        req.end();
        req.on('error', (error) => {
            reject({ message: 'The website did not provide a valid certificate', error });
        });
    });
};

const parseCertificate = (certificate) => {
    return certificateSchema.validate(certificate);
};

module.exports = {
    fetchCertificate,
    parseCertificate
};


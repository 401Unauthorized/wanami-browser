/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState, memo, useEffect } from 'react';
import { Icon } from "semantic-ui-react";
import { motion } from "framer-motion";
import axios from "axios";

const CompanyLogo = ({ source }) => {
    const [image, setImage] = useState(<Icon circular inverted color='grey' name='question circle' />);

    useEffect(() => {
        console.log('Fetching Company Logo', source, image);
        axios.get(source, {
            responseType: 'blob'
        })
            .then(response => {
                let imgUrl = URL.createObjectURL(response.data);
                console.log('Got Company Logo', imgUrl);
                setImage(<img src={imgUrl} />);
            })
            .catch(function (error) {
                console.log('Get Company Logo Error', error);
                const icon = (
                    <motion.div
                        initial={{ scale: .5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: .5, repeat: 4, repeatType: 'reverse' }}
                    >
                        <Icon circular inverted color='yellow' name='question circle' />
                    </motion.div>
                );
                setImage(icon);
            });

        return () => {};
    }, [source]);

    return image;
}

export default memo(CompanyLogo);
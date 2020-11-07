/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ipcRenderer } from "electron";
import React, { useState } from "react";
import Head from "next/head";
import { Segment, Input, Header, Icon } from "semantic-ui-react";
import { motion } from "framer-motion";

const Password = () => {
    const [isError, setIsError] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [animVal, setAnimValue] = useState(1);
    const [isCreated, setIsCreated] = useState(false);

    const onKeyUp = async (event) => {
        if (event.key === "Enter") {
            setIsLoading(true);
            const result = await ipcRenderer.invoke("password::enter", password);
            setIsLoading(false);
            if(result){
                setAnimValue(0);
            } else {
                setIsError(true);
            }
        }
    };

    return (
        <React.Fragment>
            <Head>
                <title>Password Protected</title>
            </Head>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: animVal, opacity: animVal }}
                transition={{ duration: .4 }}
            >
                <Segment placeholder style={{ 'height': '100vh' }}>
                    <Header icon>
                        <Icon name='lock' />
                        Password Protected
                    </Header>
                    <Input
                        error={isError}
                        type="password"
                        value={password}
                        loading={isLoading}
                        onKeyPress={(e) => onKeyUp(e)}
                        onChange={(e) => setPassword(e.target.value)}
                        ></Input>
                </Segment>
            </motion.div>
        </React.Fragment>
    );
};

export default Password;

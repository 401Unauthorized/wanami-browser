/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ipcRenderer } from "electron";
import React, { useState } from "react";
import Head from "next/head";
import { Segment, Input, Header, Icon, Button } from "semantic-ui-react";
import { motion } from "framer-motion";

const CreatePassword = () => {
    const [isError, setIsError] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [animVal, setAnimValue] = useState(1);

    const submit = async () => {
        setIsLoading(true);
        const result = await ipcRenderer.invoke("password::create", { password, confirmedPassword });
        setIsLoading(false);
        if (result) {
            setAnimValue(0);
        } else {
            setIsError(true);
        }
    }

    const onKeyUp = async (event) => {
        if (event.key === "Enter") {
            submit();
        }
    };

    return (
        <React.Fragment>
            <Head>
                <title>Create A Password</title>
            </Head>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: animVal, opacity: animVal }}
                transition={{ duration: .4 }}
            >
                <Segment placeholder style={{ 'height': '100vh' }}>
                    <Header icon>
                        <Icon name='unlock' />
                         Create Password
                     </Header>
                    <Input
                        style={{"marginBottom": "1em"}}
                        error={isError}
                        placeholder="Enter A Password"
                        type="password"
                        value={password}
                        loading={isLoading}
                        onKeyPress={(e) => onKeyUp(e)}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Input>
                    <Input
                        style={{"marginBottom": "1em"}}
                        error={isError}
                        placeholder="Confirm The Password"
                        type="password"
                        value={confirmedPassword}
                        loading={isLoading}
                        onKeyPress={(e) => onKeyUp(e)}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    ></Input>
                    <Button primary onClick={submit}>Submit</Button>
                </Segment>
            </motion.div>
        </React.Fragment>
    );
};

export default CreatePassword;

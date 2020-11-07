/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ipcRenderer } from "electron";
import React, { useState, useEffect } from "react";
import { Icon, Dropdown, Label, Menu } from "semantic-ui-react";
import copy from 'copy-to-clipboard';

const defaultIcon = <Icon circular inverted color='grey' name="key" />;

export default function OTP({ taskbar, navigation, setIsScanning }) {
    const [otpCodes, setOTPCodes] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [value, setValue] = useState(false);
    const [dropdownIcon, setDropdownIcon] = useState(defaultIcon);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleChange = (e, { value }) => {
        if (value === 'qrcode') {
            setIsSearching(true);
            taskbar.setIsScanning(true);
            processOTP();
            setTimeout(() => {
                setIsSearching(false);
                taskbar.setIsScanning(false);
                taskbar.shrinkTaskbar();
            }, 3000);
        } else {
            copy(value);
            taskbar.shrinkTaskbar()
        }
        setValue(null);
    };

    const trigger = isSearching ? <Icon inverted name="" /> : dropdownIcon;

    const createLabel = (issuer, label) => {
        return (
            <Label color='teal'>
                {issuer}
                <Label.Detail>{label}</Label.Detail>
            </Label>
        );
    };

    const formatDropdown = () => {
        const menu = [
            {
                key: 'new',
                text: (
                    <span>
                        <Icon name="qrcode"></Icon>
                        <strong>Virtually Scan MFA QR Code</strong>
                    </span>
                ),
                value: 'qrcode',
                selected: false
            }
        ]
        const codes = otpCodes.map(x => {
            return {
                ...x,
                key: `${x.issuer}-${x.label}`,
                text: x.code,
                value: x.code,
                label: createLabel(x.issuer, x.label)
            }
        });
        return menu.concat(codes);
    }

    const processOTP = async () => {
        const otp = await ipcRenderer.invoke("taskbar::otp-capture", navigation);
        if (otp) {
            setDropdownIcon(<Icon inverted color="green" name="check square" />);
        } else {
            setDropdownIcon(<Icon inverted color="red" name="dont" />);
        }
        setTimeout(() => {
            setDropdownIcon(defaultIcon);
        }, 4000);
    };

    const getOTPCodes = () => {
        ipcRenderer.invoke("taskbar::otp-codes", true).then(data => {
            setOTPCodes(data);
        });
    };

    useEffect(() => {
        // componentDidMount()
        console.log('Mounted OTP');

        return () => {
            // componentWillUnmount()
            console.log('Removed OTP');

        };
    }, []);

    return (
        <Menu.Item name="OTP">
            <Dropdown
                floating
                compact
                loading={isSearching}
                pointing='top right'
                icon={null}
                value={value}
                options={formatDropdown()}
                trigger={trigger}
                onChange={handleChange}
                onClick={taskbar.expandTaskbar}
                onClose={() => isSearching && taskbar.shrinkTaskbar()}
                onOpen={getOTPCodes}
            />
        </Menu.Item>
    );
};
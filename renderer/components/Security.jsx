/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState, useEffect } from "react";
import { Icon, Statistic } from "semantic-ui-react";

const defaultIcon = <Icon color='grey' name='question circle' />;

export default function WebsiteInfo({ security }) {
 
  useEffect(() => {
    // componentDidMount()
    console.log('Mounted WebsiteInfo');

    return () => {
      // componentWillUnmount()
      console.log('Removed WebsiteInfo');

    };
  }, []);

  const status = (bool) => {
    return bool ? <Icon color="green" name="check circle"/> : <Icon color="red" name="times circle outline"/>
  }

  return (
    <React.Fragment>
      <Statistic.Group widths='four' size='mini'>

        <Statistic>
          <Statistic.Value>
            {status(security?.encryption)}
          </Statistic.Value>
          <Statistic.Label>Secure Website</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {status(!security?.warning)}
          </Statistic.Value>
          <Statistic.Label>Safe Content</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {100 - security?.risk}
          </Statistic.Value>
          <Statistic.Label>Trust Level</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {status(!security?.detections) || defaultIcon}
          </Statistic.Value>
          <Statistic.Label>Security Warnings</Statistic.Label>
        </Statistic>

      </Statistic.Group>
    </React.Fragment>
  );
};

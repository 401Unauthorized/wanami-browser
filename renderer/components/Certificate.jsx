/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState, useEffect } from "react";
import { Icon, Statistic } from "semantic-ui-react";
import moment from 'moment';

export default function WebsiteInfo({ certificate }) {

  useEffect(() => {
    // componentDidMount()
    console.log('Mounted WebsiteInfo');

    return () => {
      // componentWillUnmount()
      console.log('Removed WebsiteInfo');

    };
  }, []);

  return (
    <React.Fragment>
      <Statistic.Group widths='four' size='mini'>

        <Statistic>
          <Statistic.Value>
            {certificate?.subject?.C}
          </Statistic.Value>
          <Statistic.Label>Country</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {certificate?.subject?.O}
          </Statistic.Value>
          <Statistic.Label>Organization</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {certificate?.subject?.CN}
          </Statistic.Value>
          <Statistic.Label>Website</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {moment(certificate.valid_to).fromNow()}
          </Statistic.Value>
          <Statistic.Label>Expires</Statistic.Label>
        </Statistic>

      </Statistic.Group>
    </React.Fragment>
  );
};

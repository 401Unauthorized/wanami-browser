/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ipcRenderer } from "electron";
import React, { useState, useEffect } from "react";
import { Icon, Statistic } from "semantic-ui-react";

export default function Company({ url }) {
  const [company, setCompany] = useState({});

  const getData = () => {
    ipcRenderer.invoke("taskbar::company-info", url).then(data => {
      setCompany(data);
    });
  };

  useEffect(() => {
    // componentDidMount()
    console.log('Mounted WebsiteInfo');
    getData();

    return () => {
      // componentWillUnmount()
      console.log('Removed WebsiteInfo');

    };
  }, []);

  const status = (bool) => {
    return bool ? <Icon color="green" name="check circle" /> : <Icon color="red" name="times circle outline" />
  }

  return (
    <React.Fragment>
      <Statistic.Group widths='four' size='mini'>

        <Statistic>
          <Statistic.Value>
            {company?.company_name}
          </Statistic.Value>
          <Statistic.Label>Website Owner</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {company?.country}
          </Statistic.Value>
          <Statistic.Label>Country</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {company?.alexa_rank}
          </Statistic.Value>
          <Statistic.Label>Website Rank</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            {company?.domain}
          </Statistic.Value>
          <Statistic.Label>Main Website</Statistic.Label>
        </Statistic>

      </Statistic.Group>
    </React.Fragment>
  );
};

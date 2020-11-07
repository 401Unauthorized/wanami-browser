/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useEffect } from "react";
import styles from './Scanner.module.css';

export default function Scanner() {

  useEffect(() => {
    // componentDidMount()
    console.log('Mounted Scanner');

    return () => {
      // componentWillUnmount()
      console.log('Removed Scanner');

    };
  }, []);

  return <div className={styles.laser}></div>
};

/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const progressBar = (interval=75) => {
    let progress = 0.01;

    const progressInterval = setInterval(() => {
        global.electronRefs.windows.mainWindow.setProgressBar(progress);
        if (progress <= 1) {
            progress += 0.01;
        } else {
            global.electronRefs.windows.mainWindow.setProgressBar(-1);
            clearInterval(progressInterval);
        }
    }, interval);
}

module.exports = {
    progressBar
};

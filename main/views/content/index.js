/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { BrowserView } = require('electron');
const urlParser = require('url');
const { completedNavigation, loadNewPage } = require('./controller');
const { log } = require('../../utility/logger');

const setViewBoundsContent = (width, height) => {
  global.electronRefs.views.contentView.setBounds({ x: 0, y: 52, width, height: height - 72 });
}

const createContentView = (app) => {
  if (global.electronRefs.views.contentView !== null)
    return null;

  global.electronRefs.views.contentView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      enableRemoteModule: false,
      backgroundThrottling: false
    }
  });

  attachListeners();
};


const attachListeners = () => {
  if (attachListeners.singleton) return;

  global.electronRefs.views.contentView.webContents.on('console-message', (e, level, message) => {
    log.info('Content::console-message', level, message);
  });

  global.electronRefs.views.contentView.webContents.on('page-title-updated', (e, title) => {
    log.info('Content::page-title-updated', title);
  });

  global.electronRefs.views.contentView.webContents.on('did-navigate', async (e, url) => {
    log.info('Content::did-navigate', url);
    completedNavigation(url);
  });

  global.electronRefs.views.contentView.webContents.on('did-navigate-in-page', async (e, url, isMainFrame) => {
    log.info('Content::did-navigate-in-page', url, isMainFrame);
    if (isMainFrame) {
      completedNavigation(url);
    }
  });

  global.electronRefs.views.contentView.webContents.on('did-stop-loading', () => {
    log.info('Content::did-stop-loading');
  });

  global.electronRefs.views.contentView.webContents.on('did-start-loading', () => {
    log.info('Content::did-start-loading');
  });

  global.electronRefs.views.contentView.webContents.on('did-start-navigation', async (e, ...args) => {
    log.info('Content::did-start-navigation');
  });

  global.electronRefs.views.contentView.webContents.on('new-window', async (e, url, frameName, disposition) => {
    e.preventDefault();
    log.info('Content::new-window', url, frameName, disposition);
    loadNewPage(url);
  });

  global.electronRefs.views.contentView.webContents.on('did-fail-load', (e, errorCode, errorDescription, validatedURL, isMainFrame) => {
    log.info('Content::did-fail-load', errorCode, errorDescription, validatedURL, isMainFrame);
  });

  global.electronRefs.views.contentView.webContents.on('page-favicon-updated', async (e, favicons) => {
    log.info('Content::page-favicon-updated', favicons);
  });

  global.electronRefs.views.contentView.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    // log.info('Content::certificate-error', url, error, certificate);
    event.preventDefault();
    callback(true);
  });

  global.electronRefs.views.contentView.webContents.on('render-process-gone', (event, details) => {
    log.info('Content::render-process-gone', details);
  });

  global.electronRefs.views.contentView.webContents.on('unresponsive', (event) => {
    log.info('Content::unresponsive');
  });

  global.electronRefs.views.contentView.webContents.on('destroyed', (event) => {
    log.info('Content::destroyed');
  });

  attachListeners.singleton = true;
};

module.exports = {
  createContentView,
  setViewBoundsContent
};

/* Copyright (c) 2020 Stephen Mendez. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ipcRenderer } from "electron";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Menu, Icon, Input, Dropdown, Modal, Button, Popup, Label } from "semantic-ui-react";
import { motion } from "framer-motion";
import Company from "../components/Company";
import Security from "../components/Security";
import CompanyLogo from "../components/CompanyLogo";
import OTP from "../components/OTP";
import Scanner from '../components/Scanner';

const options = [
  { key: "https:", text: "Secure", value: "https://" },
  { key: "http:", text: "Legacy", value: "http://" }
];

const Home = () => {
  const [displayedURL, setDisplayedURL] = useState("www.google.com");
  const [protocolOption, setProtocolOption] = useState(options[0].value);
  const [certificate, setCertificate] = useState({});
  const [navigation, setNavigation] = useState({
    protocol: "https:",
    hostname: "www.google.com",
    path: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const [securityCheckup, setSecurityCheckup] = useState({});
  const [securityModalOpen, setSecurityModalOpen] = React.useState(false);
  const [companyModalOpen, setCompanyModalOpen] = React.useState(false);

  const navigate = async (protocol = null, url = null) => {
    setIsLoading(true);
    await ipcRenderer.invoke("taskbar::navigate", {
      protocol: protocol || protocolOption,
      url: url || displayedURL,
    });
  };

  const onKeyUp = (event) => {
    if (event.key === "Enter") {
      navigate();
    }
  };

  const expandTaskbar = async () => {
    await ipcRenderer.invoke("taskbar::open", true);
  };

  const shrinkTaskbar = async () => {
    await ipcRenderer.invoke("taskbar::close", true);
  };

  const performAction = async (e, { name }) => {
    switch (name) {
      case "back":
        await ipcRenderer.invoke("taskbar::back");
        break;
      case "forward":
        await ipcRenderer.invoke("taskbar::forward");
        break;
      case "reload":
        await ipcRenderer.invoke('taskbar::reload');
        break;
      default:
        console.log('Unsupported Function');
    }
  };

  const shortenURL = (navigation) => {
    setDisplayedURL(navigation.hostname);
  };

  const expandURL = () => {
    setDisplayedURL(`${navigation.hostname}${navigation.path}`);
  };

  const updateDisplay = (parsedURL) => {
    setDisplayedURL(parsedURL.hostname);
    setNavigation(parsedURL);
    setProtocolOption(options.find((obj) => obj.key === parsedURL.protocol).value);
    setIsLoading(false);
  };

  const showSecurityModal = () => {
    expandTaskbar().then(() => {
      setSecurityModalOpen(true);
    });
  };

  const hideSecurityModal = () => {
    shrinkTaskbar().then(() => {
      setSecurityModalOpen(false);
    });
  };


  const showCompanyModal = () => {
    expandTaskbar().then(() => {
      setCompanyModalOpen(true);
    });
  };

  const hideCompanyModal = () => {
    shrinkTaskbar().then(() => {
      setCompanyModalOpen(false);
    });
  };

  const protocolBackground = () => {
    return protocolOption === 'http://' && navigation.protocol === 'http:' ? 'red' : '';
  }

  const securityIcon = () => {
    let icon = null;
    if (protocolOption === 'https://' && navigation.protocol === 'https:' && !securityCheckup?.warning) {
      icon = <Icon circular inverted color="green" name="lock" />;
    } else {
      icon = (
        <motion.div
          initial={{ scale: .5 }}
          animate={{ scale: 1 }}
          transition={{ duration: .5, repeat: 4, repeatType: 'reverse' }}
        >
          <Icon circular inverted color='red' name='warning sign' />
        </motion.div>
      )
    }
    return icon;
  };

  useEffect(() => {
    // componentDidMount()
    ipcRenderer.on("navigate::new", (e, parsedURL) => {
      updateDisplay(parsedURL);
    });

    ipcRenderer.on("organization::certificate", (e, certificate) => {
      setCertificate(certificate);
    });

    ipcRenderer.on("security::checkup", (e, data) => {
      setSecurityCheckup(data);
    });

    return () => {
      // componentWillUnmount()
    };
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Wanami Browser</title>
      </Head>
      <Menu inverted attached style={{ backgroundColor: "#2B2E3B" }}>
        <Menu.Item name="back" onClick={performAction}>
          <Icon inverted name="angle left" />
        </Menu.Item>
        <Menu.Item name="forward" onClick={performAction}>
          <Icon inverted name="angle right" />
        </Menu.Item>
        <Menu.Item name="reload" onClick={performAction}>
          <Icon inverted name="redo" />
        </Menu.Item>
        <Menu.Item name="search" style={{ flexGrow: "1" }}>
          <Input
            label={
              <Dropdown
                options={options}
                onClick={expandTaskbar}
                onClose={shrinkTaskbar}
                onChange={(e, { value }) => setProtocolOption(value)}
                value={protocolOption}
                style={{ backgroundColor: protocolBackground() }}
              />
            }
            labelPosition="left"
            value={displayedURL}
            loading={isLoading}
            onKeyPress={(e) => onKeyUp(e)}
            onChange={(e) => setDisplayedURL(e.target.value)}
            action={isLoading ? { onClick: navigate } : { icon: "search", onClick: navigate }}
            onFocus={() => {
              expandURL();
            }}
            onBlur={() => {
              setTimeout(() => {
                shortenURL(navigation);
              }, 1000);
            }}
            error={navigation.protocol === 'http:'}
          />
        </Menu.Item>
        <Menu.Menu position="right">
          <Popup
            content={
              <Label inverted as='a' color='grey' onClick={(evt) => navigate('https://', 'clearbit.com')}>
                Logos provided by Clearbit
              </Label>
            }
            mouseEnterDelay={1000}
            mouseLeaveDelay={1000}
            on='hover'
            trigger={
              <Menu.Item name="company" onClick={showCompanyModal}>
                <CompanyLogo source={`https://logo.clearbit.com/${navigation.hostname}`}></CompanyLogo>
              </Menu.Item>
            }
            position='left center'
          />
          <Modal
            onClose={hideCompanyModal}
            onOpen={showCompanyModal}
            open={companyModalOpen}
          >
            <Modal.Header>
              Company Information
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Company url={displayedURL} />
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => {
                hideCompanyModal();
                performAction(null, { name: 'back' });
              }}>
                Previous Page
              </Button>
              <Button
                content="Proceed"
                labelPosition='right'
                icon='checkmark'
                onClick={hideCompanyModal}
                positive
              />
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={hideSecurityModal}
            onOpen={showSecurityModal}
            open={securityModalOpen}
            trigger={<Menu.Item>{securityIcon()}</Menu.Item>}
          >
            <Modal.Header>Website Security</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Security security={{
                  encryption: (protocolOption === 'https://'),
                  ...securityCheckup
                }} />
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => {
                hideSecurityModal();
                performAction(null, { name: 'back' });
              }}>
                Previous Page
                </Button>
              <Button
                content="Proceed"
                labelPosition='right'
                icon='checkmark'
                onClick={hideSecurityModal}
                positive
              />
            </Modal.Actions>
          </Modal>
          <OTP taskbar={{ expandTaskbar, shrinkTaskbar, setIsScanning }} navigation={navigation}></OTP>
        </Menu.Menu>
      </Menu>
      {isScanning && <Scanner></Scanner>}
    </React.Fragment>
  );
};

export default Home;

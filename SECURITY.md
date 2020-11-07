## Security

> **The project is not "production ready" and is in early development! There should be no reasonable expectation of stability, reliablity, availability or security.**

If you have discovered a new security vulnerability, please report it through the means described below.

## Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Send an email to [git@stephenmendez.dev](mailto:git@stephenmendez.dev). Expect to receive a response within 72 hours. 

Please include the following information (when available):

* Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit the issue

## Known Vulnerabilities

> For the sake of transparency, this project may publicly disclose some known vulnerabilities.

> For full functionality, this project requires the use of paid third party APIs. There should be no claims of privacy nor can this project attest to the API providers' privacy policies. If you do not feel comfortable with the following, do not use this application.
* Third Party API Usage:
    * logo.clearbit.com
        * This API is used for fetching and displaying the company logo while navigating to a webpage
        * This API is free and is not able to be disabled without modifying the code
        * Every domain which a user visits will be sent to clearbit
    * APIVoid
        * This API is used for real time vulnerability detection
        * This API is paid and requires an API token to be used
        * This feature can be disabled as documented in this project's documentation
        * The entire URL, including query strings, will be provided to APIVoid
    * Uplead
        * This API is used to enrich company data
        * This API is paid and requires an API token to be used
        * This feature can be disabled as documented in this project's documentation
        * Only the domain of the current web page will be sent to Uplead when a user clicks the company logo in the taskbar

* Password Protection
    * In the current implementation, this feature is really for encryption and not to strongly prevent anyone from accessing the browser's main features
    * The password protection page is a rendered view in its own process. Someone with access to the computer could stop the process to destroy the view and bypass the security screen on the application
        * Done successfully, the person would have access to a semi-initialized application
        * Good news, the encrypted configs and data such as MFA tokens **would not** be decrypted so they should **not** have access to them in plain-text or in the UI
    
* Privacy Protection
    * Electron/Chromium
        * Many files are automatically generated which may contain some sensitive information such as cookies and browsing history
        * Wanami does make an effort to clear the browsing history everytime the window is closed
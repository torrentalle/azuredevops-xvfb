# Xvfb extension for Azure DevOps

[![Build Status](https://dev.azure.com/torrentalle/vsts-xvfb/_apis/build/status/torrentalle.vsts-xvfb?branchName=master)](https://dev.azure.com/torrentalle/azuredevops-xvfb/_build/latest?definitionId=2&branchName=master)

## Overview

This extension installs a Build/Release task that can be used to manage [Xvfb](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml)
in Linux agent machines. This is useful when running UI tests such as Selenium or Coded UI test

The task can start Xvfb daemon and configure subsequent tasks to automatically use the X display. You can also specify custom screen resolution values by providing desired width and height, in pixels.

## Getting started



## Building

You need node 10.x or grather to build this extension

```bash
npm install
npm run build
```

## Create extension

Be sure to manually increment the version number befor executing the create step in the files:

* [vss-extension.json](vss-extension.json)
* [tasks/StartXvfb/task.json](tasks/StartXvfb/task.json)

After installing dependencies and build the packagem you can create `vsix` package.

```bash
npm run create
```

## Testing

To run tests

```bash
rpm run test
```

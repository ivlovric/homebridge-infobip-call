
<p align="center">
<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">
</p>
<p align="center">
<img src="https://www.infobip.com/wp-content/themes/infobip/static/ui/infobip-logo.svg" width="230">
</p>


# Homebridge plugin for Infobip Call TTS platform

This is a Homebridge accessory plugin for Infobip Call TTS platform that enables creating of outbound call to specified number with specific message to be converted from text to speach.

It is forked from generic switch plugin https://github.com/nfarina/homebridge-dummy 

## Get infobip subscription

Infobip offers trial accout that can be created freely with fair ammount of credits for many types of Voice, SMS or OTT services.

Getting started with Infobip APIs - https://www.infobip.com/docs/api

Trial account registration page - https://www.infobip.com/signup

## Install

### Manual
Using a terminal, navigate to the project folder and run this command to install the development dependencies:

```
npm install
```

### Using Homebridge Plugin search pane

## Build Plugin

TypeScript needs to be compiled into JavaScript before it can run. The following command will compile the contents of your [`src`](./src) directory and put the resulting code into the `dist` folder.

```
npm run build
```

## Link To Homebridge

Run this command so your global install of Homebridge can discover the plugin in your development environment:

```
npm link
```

You can now start Homebridge, use the `-D` flag so you can see debug log messages in your plugin:

```
homebridge -D
```

## Watch For Changes and Build Automatically

If you want to have your code compile automatically as you make changes, and restart Homebridge automatically between changes you can run:

```
npm run watch
```

This will launch an instance of Homebridge in debug mode which will restart every time you make a change to the source code. It will load the config stored in the default location under `~/.homebridge`. You may need to stop other running instances of Homebridge while using this command to prevent conflicts. You can adjust the Homebridge startup command in the [`nodemon.json`](./nodemon.json) file.



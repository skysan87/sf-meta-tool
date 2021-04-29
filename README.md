# About
* Retrieve sObject Metadata from yout Salesforce organization
* Save `SObject Fileds` info to Database

## Install
```
$ npm install
```

## Setup
* Open `src/retrieveMeta.js`
* Set Login Info

```js
const USER = ''
const PASSWORD = ''
const SECURITY_TOKEN = '' // this depends on organization setting.
```

## Run
```
$ npm run retrieve
```
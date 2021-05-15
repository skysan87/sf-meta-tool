# About
* Retrieve sObject Metadata from yout Salesforce organization
* Save `SObject Fileds` info to Database

## Install
```
$ npm install
```

## Setup
* Create `config/default.js`
  * see `node-config`
* Set Login Info

```js
{
  "Account": {
    "user": "",
    "password": "",
    "security_token": "" // this depends on organization.
  }
}
```

## Run
```
$ npm run retrieve
```
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

```json
{
  "Account": {
    "user": "",
    "password": "",
    "security_token": "", // this depends on organization.
    "sandbox": true
  },
  "ObjectList": {
    "retrieve": [ "Account", "Contact"] // set retrieve targets.
  }
}
```

## Run
```
$ npm run retrieve
```
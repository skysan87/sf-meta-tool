class SObjectField {
  constructor (param) {
    this.label = param.label
    this.api_name = param.api_name
    this.type = param.type
    this.valueset = null
  }
}

module.exports = SObjectField
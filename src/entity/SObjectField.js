class SObjectField {
  constructor (param) {
    this.object_api = param.object_api || ''
    this.object_label = param.object_label || ''
    this.field_api = param.field_api || ''
    this.field_label = param.field_label || ''
    this.field_type = param.field_type || ''
    this.valueset = null
    this.formula = null
  }

  get isCustom() {
    return this.field_api.endsWith('__c')
  }
}

module.exports = SObjectField
const SObjectDao = require('../dao/SObjectDao')
const DB = require('../dao/DB')
const SObjectField = require('../entity/SObjectField')

class SaveMetadataTask {

  static async run (metadata) {

    // Refresh DB
    DB.init()
    await SObjectDao.drop()
    await SObjectDao.createTableIfNotExists()

    const insertData = []

    metadata.fields.forEach(async (f) => {
      const field = new SObjectField({
        object_api: metadata.fullName,
        object_label: metadata.label,
        field_api: f.fullName,
        field_label: f.label,
        field_type: f.type,
        text_length: f.length
      })

      // picklist
      if (f.hasOwnProperty('valueSet')) {
        field.valueset = f.valueSet.valueSetDefinition.value
          .map((list) => list.label)
          .join(';')
      }

      // lookup
      if (f.hasOwnProperty('type') && f.type.toLowerCase() === 'lookup') {
        field.field_type = `${f.type}(${f.referenceTo})`
      }

      // formula
      if (f.hasOwnProperty('formula')) {
        field.field_type = `formula(${f.type})`
        field.formula = f.formula
      }

      insertData.push(field)
    })

    // save to db
    await SObjectDao.save(insertData)
  }
}

module.exports = SaveMetadataTask

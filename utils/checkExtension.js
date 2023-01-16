function checkExtension(extension, referenceList) {

  const references = Array.isArray(referenceList) ? referenceList : new Array(referenceList)

  const result = references.some((reference) => {
    return reference === extension
  })

  return result
}

module.exports = {
  checkExtension
}

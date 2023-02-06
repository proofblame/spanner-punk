function checkExtension(extension: string, referenceList: string | string[]) {
  const references = Array.isArray(referenceList) ? referenceList : new Array(referenceList);

  const result = references.some((reference) => reference === extension);

  return result;
}

module.exports = {
  checkExtension,
};

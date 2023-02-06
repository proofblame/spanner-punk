class Extention {
  static get = (fileName: string) => {
    return fileName.split(".").reverse()[0];
  };

  static delete(fileName: string) {
    return fileName.split(".")[0];
  }

  static check(extension: string, referenceList: string | string[]) {
    const references = Array.isArray(referenceList)
      ? referenceList
      : new Array(referenceList);

    const result = references.some((reference) => reference === extension);

    return result;
  }
}

export default Extention;

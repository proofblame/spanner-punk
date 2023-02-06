function getExtension(fileName: string) {
  return fileName.split('.').reverse()[0];
}

module.exports = {
  getExtension,
};

function getExtension(fileName){
  return fileName.split('.').reverse()[0];
}

module.exports = {
  getExtension
}

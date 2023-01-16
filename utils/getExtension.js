function getExtension(fileName){
  console.log("//------getExtension-------//")
  console.log(fileName)
  return fileName.split('.').reverse()[0];
}

module.exports = {
  getExtension
}

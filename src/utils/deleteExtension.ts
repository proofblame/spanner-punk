function deleteExtension(file: any) {
  return file.split('.')[0];
}

module.exports = {
  deleteExtension,
};

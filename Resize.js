const sharp = require('sharp');
const { v1: uuidv1 } = require('uuid');
const path = require('path');
const upload = require('./uploadMiddleware');

class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    
    return filename;
  }
  static filename() {
    return `${uuidv1()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize;
const fs = require('fs');
const crypto = require('crypto');
const ctx = `${__dirname}/../build/cdn/`;
const files = {
  'main.js': {
    path: `${ctx}adaptive.min.js`,
    fileName: 'adaptive.min.js'
  },
  'main.js.map': {
    path: `${ctx}adaptive.min.js.map`,
    fileName: 'adaptive.min.js.map'
  },
};

const generateIntegrity = (input) => {
  const hash256 = crypto.createHash('sha256').update(input, 'utf8').digest('base64');
  const hash384 = crypto.createHash('sha384').update(input, 'utf8').digest('base64');
  const hash512 = crypto.createHash('sha512').update(input, 'utf8').digest('base64');
  return `sha256-${hash256} sha384-${hash384} sha512-${hash512}`;
};

const generateManifest = (files) => {
  const manifest = {};
  try {
    Object.entries(files).forEach(
      ([key, value]) => {
        var file = fs.readFileSync(value.path);
        manifest[key] = {
          src: value.fileName,
          integrity: generateIntegrity(file)
        }
      }
    );
    fs.writeFile(`${ctx}manifest.json`, JSON.stringify(manifest, null, 2), (err) => {
      if (err) throw err;
      console.log('manifest.json created!');
    });
  } catch(err) {
    console.error(err, 'some errors occured while creating manifest.json!');
  }
};

generateManifest(files)

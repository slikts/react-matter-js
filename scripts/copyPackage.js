const fs = require('fs');

const {
  name,
  dependencies,
  repository,
  keywords,
  author,
  license,
  bugs,
  homepage,
  description,
  version,
} = require('../package.json');

const json = JSON.stringify(
  {
    main: 'index.js',
    typings: 'index.d.ts',
    module: 'rmjs.esm.js',
    name,
    dependencies,
    repository,
    keywords,
    author,
    license,
    bugs,
    homepage,
    description,
    version,
  },
  null,
  2
);
try {
  fs.mkdirSync('dist');
} catch (e) {}
fs.writeFileSync('dist/package.json', json);

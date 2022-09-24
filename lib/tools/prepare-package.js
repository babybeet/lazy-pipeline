const { mkdir, writeFile } = require('fs/promises');
const { resolve } = require('path');

const distFolder = resolve(__dirname, '..', 'dist');
const subPackages = ['collectors', 'operators', 'stages'];

for (const subPackage of subPackages) {
  const subPackageFolder = resolve(distFolder, subPackage);
  const packageJsonFileContent = JSON.stringify({
    name: `lazy-pipeline/${subPackage}`,
    main: `../cjs/${subPackage}/index.js`,
    module: `../esm/${subPackage}/index.js`,
    types: `../types/${subPackage}/index.d.ts`,
    sideEffects: false
  }, null, 4);

  mkdir(subPackageFolder)
    .then(() => writeFile(resolve(subPackageFolder, 'package.json'), packageJsonFileContent))
    .catch(console.error);
}

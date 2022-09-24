const { mkdirSync, writeFile } = require('fs');
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

  mkdirSync(subPackageFolder);

  writeFile(resolve(subPackageFolder, 'package.json'), packageJsonFileContent, error => {
    if (error) {
      console.error(error);
    }
  });
}

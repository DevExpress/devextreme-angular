/* ==============================
NOTE: 
  When modifying this file, 
  copy-paste it to these repos:
  - devextreme-angular
  - devextreme-vue
  - devextreme-react
===============================*/
const yargs = require('yargs/yargs');
const fs = require('fs');
const { resolve, join } = require('path');
const { hideBin } = require('yargs/helpers');
const { spawnSync } = require('child_process');
const { version: dxVersion } = require('os');

const { framework, metadataFileName, metadataGenerator } = parseJSON(join(__dirname, 'package.json')).workspaceTaskOptions;

const customDevextremeLocation = process.env['devextreme-location'];
const defaultDevextremeLocation = join(__dirname, '../devextreme');
const devextremeLocation = resolve(customDevextremeLocation || defaultDevextremeLocation);

const defaultMetadataLocation = join(devextremeLocation, 'artifacts/internal-tools');
const customMetadataLocation = process.env['metadata-location'];
const metadataLocation = resolve(customMetadataLocation || defaultMetadataLocation);

const argv = yargs(hideBin(process.argv))
    .alias('c', 'clone-devextreme')
    .alias('m', 'generate-metadata')
    .argv;

const dxVersion = getVersion();

function main() {
    if (argv.cloneDevextreme) {
        cloneDevextreme();
    }
    if (argv.generateMetadata) {
        generateMetadata();
    }
}

async function cloneDevextreme() {
    if (fs.existsSync(devextremeLocation)) {
        return;
    }
    if (!run(`git clone -b ${dxVersion} --depth 1 https://github.com/DevExpress/DevExtreme.git ${devextremeLocation}`)) {
        throw new Error('Unable to clone repo');
    }
}
async function generateMetadata() {
    const sourceMetadataAbsoluteFileName = resolve(metadataLocation, metadataFileName);

    if (!customMetadataLocation || !fs.existsSync(customMetadataLocation)) {
        if (!fs.existsSync(devextremeLocation)) {
            throw new Error('Metadata file and DevExtreme repo do not exist');
        }
        if (!runOptions({}).run(
            `npm.cmd run internal-tool -- discover --js-scripts ${devextremeLocation}/js --exclude js/renovation/ --output-path ${metadataLocation}`,
            `npm.cmd run internal-tool -- integration-data-generator --js-scripts ${devextremeLocation}/js --declarations-path ${metadataLocation}/Declarations.json --output-path ${metadataLocation}/integration-data.json`,
            metadataGenerator && `npm.cmd run internal-tool -- ${metadataGenerator} --js-scripts ${devextremeLocation}/js --declarations-path ${metadataLocation}/Declarations.json --output-path ${sourceMetadataAbsoluteFileName} --version ${dxVersion}`
        )) {
            throw new Error('Unable to generate metadata');
        }
        if (!fs.existsSync(sourceMetadataAbsoluteFileName)) {
            throw new Error('Metadata file was not found after generator completion');
        }
    }

    fs.writeFileSync(resolve(__dirname, `packages/devextreme-${framework}/metadata/${metadataFileName}`), fs.readFileSync(sourceMetadataAbsoluteFileName));
}

//utility functions:
function run(...commands) {
    return runOptions().run(...commands);
}
function runOptions(options) {
    return {
        run: (...commandList) => {
            for (let i = 0; i < commandList.length; i++) {
                const command = commandList[i];
                if (!command)
                    continue;
                const spawnResult = spawnSync('cmd', [`/c ${command}`], { ...options, stdio: 'inherit' });
                if (spawnResult.error) {
                    return false;
                }
            }
            return true;
        }
    }
}
function parseJSON(fileName) {
    return JSON.parse(fs.readFileSync(fileName).toString());
}
function getVersion() {
    const { version } = parseJSON(join(__dirname, `packages/devextreme-${framework}/package.json`));
    return version.split('.').slice(0, 2).join('_');
}

main();

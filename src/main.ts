
import { 
    calcBuildingHeatingNeed
} from "./costCalculations";

// handles input arguments
import * as minimist from 'minimist';
import * as fs from 'fs';

// handles json schema validation
import * as Ajv from 'ajv';
import * as schema from "../schema/schema.json" // todo: currently validates everything

// read arguments and call main
const argv = minimist(process.argv.slice(1));
main(argv);

function main(argv: any) {
    let calcData = _parseFile(argv.file);
    // for each scenario, get the heating need of each building
    // how to store this data?
    calcData.buildings.forEach(building => {
        building.heatingNeed = calcBuildingHeatingNeed(building);
    });
    testFun();
}

// reads a file from a supplied path, checking if it is valid json according to schema/schema.json
function _parseFile(filePath: string) {
    let fileContents = fs.readFileSync(filePath, 'utf-8');
    let validator = new Ajv();
    if (!validator.validate(schema,fileContents))
        throw "JSON data is not valid";
    let calcData = JSON.parse(fileContents);
    return calcData;
}
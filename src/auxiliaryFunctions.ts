import {
    CalcData
} from './classes';

import * as fs from 'fs';

// handles json schema validation
import * as Ajv from 'ajv';
import * as schema from "../schema/schema.json" // todo: currently validates everything

// reads a file from a supplied path, checking if it is valid json according to schema/schema.json
export function _parseFile(filePath: string) {
    let fileContents = fs.readFileSync(filePath, 'utf-8');
    let validator = new Ajv();
    if (!validator.validate(schema,fileContents))
        throw "JSON data is not valid";
    let calcData = JSON.parse(fileContents);
    return calcData;
}

export function _test(data: CalcData) {
    data.buildings.forEach(building=>{
        console.log(building.heatingNeed);
    });
    data.energySystems.forEach(sys=>{
        console.log(sys.energyCarrier.primaryEnergyFactor);
    });
    console.log(JSON.stringify(data.resultData));
}
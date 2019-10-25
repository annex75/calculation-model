// class definitions
import {
    Building,
    RenovationPackage,
    CalcData
} from './classes';

// import auxiliary functions
import {
    _parseFile,
    _test
} from './auxiliaryFunctions';

// handles input arguments
import * as minimist from 'minimist';

// read arguments and call main
export interface IArguments { file: string }
const argv = minimist(process.argv.slice(1));
console.log("hello world");
main(argv);

export function main(argv: IArguments) {
    let jsonData = _parseFile(argv.file);
    // convert json data to the calcdata format we control
    let calcData = new CalcData(jsonData);
    // for each scenario, get the heating need of each building
    _test(calcData);
    return true;
}
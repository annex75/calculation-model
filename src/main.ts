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
} from './auxiliaryFunctions'

// handles input arguments
import * as minimist from 'minimist';

// read arguments and call main
interface IArguments { file: "string" }
const argv = minimist(process.argv.slice(1));
main(argv);

function main(argv: IArguments) {
    let jsonData = _parseFile(argv.file);
    // for each scenario, get the heating need of each building
    // how to store this data?
    let calcData = new CalcData(jsonData);
    _test(calcData);
}
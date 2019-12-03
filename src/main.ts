// class definitions
import {
    CalcData
} from './classes';

// import calculation functions
import {
    performCalculations
} from './calculations';

// import auxiliary functions
import {
    _parseFile,
    _test
} from './auxiliaryFunctions';

// handles input arguments
import * as minimist from 'minimist';

// read arguments and call main
export interface IArguments { file: string };
const argv = minimist(process.argv.slice(1));
main(argv);

function main(argv: IArguments) {
    let jsonData = _parseFile(argv.file);
    // convert json data to the calcdata format we control
    const calcData = new CalcData(jsonData);
    const resData = performCalculations(calcData);
    _test(resData);
    return true;
}
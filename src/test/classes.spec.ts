// functions/classes to test
import { 
    Building,
    RenovationPackage,
    EnergyCarrier,
    EnergySystem,
    Scenario,
    CalcData
} from "../classes";

import {
    parseFile,
    getTestFile,
} from "../auxiliaryFunctions"

test('parse good input data', () => {
    //GIVEN
    let goodInput =  parseFile(getTestFile('test_good.json'));
    //WHEN
    //THEN
    expect(() => {
        const cd = new CalcData(goodInput);
    }).not.toThrow();
});



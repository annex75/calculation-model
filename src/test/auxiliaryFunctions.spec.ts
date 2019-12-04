// functions/classes to test
import {
    parseFile,
    getTestFile
} from '../auxiliaryFunctions';

test('parse good input file', () => {
    //GIVEN
    let goodInput:string =  getTestFile('test_good.json');
    //WHEN
    //THEN
    expect(() => {
        parseFile(goodInput);
    }).not.toThrow();
});

/* todo: implement once we have schemas in place
test('parse bad input file', () => {
    //GIVEN
    let badInput:string =  getTestFile('test_bad.json');
    //WHEN
    //THEN
    expect(() => {
        parseFile(badInput);
    }).toThrow();
});
*/
// functions/classes to test
import {
    _parseFile
} from '../auxiliaryFunctions';

test('parse good input file', () => {
    //GIVEN
    let cwd = process.cwd();
    let goodInput:string =  cwd+"\\data\\test.json";
    //WHEN
    //THEN
    expect(_parseFile(goodInput)).not.toThrow;
});

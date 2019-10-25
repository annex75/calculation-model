// unit testing
import {
    expect
} from 'chai';
import 'mocha';

// functions/classes to test
import {
    _parseFile
} from '../auxiliaryFunctions';

describe('auxiliary', () => {
    describe('parse good input file', () => {
        it('should run without error', () => {
            let cwd = process.cwd();
            let goodInput:string =  cwd+"\\data\\test.json";
            expect(() => _parseFile(goodInput)).not.to.throw();
        });
    });
});
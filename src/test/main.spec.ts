// unit testing
import {
    expect
} from 'chai';
import 'mocha';

// functions/classes to test
import {
    main,
    IArguments
} from '../main';

describe('main', () => {
    describe('call main with good input', () => {
        it('should run without error', () => {
            let goodInput: IArguments = {
                file: "../data/test.json"
            };
            expect(main(goodInput)).to.not.throw();
        });
    });
});
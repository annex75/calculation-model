
import { testFun } from "./test";
import * as minimist from 'minimist';
import * as fs from 'fs';

const argv = minimist(process.argv.slice(1));
main(argv);

function main(argv) {
    let file = fs.readFileSync(argv.file, 'utf-8');
    let obj = JSON.parse(file);
    console.log(obj.message);
    testFun();
}
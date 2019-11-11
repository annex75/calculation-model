import {
    CalcData, RenovationPackage, Building, ResultData
} from "./classes";

// lenses
import * as R from 'ramda';

export function _performCalculations(calcData: CalcData) {
    
    let newData: CalcData = R.clone(calcData);

    const calcBuildingHeatingNeed = (data: CalcData) => {
        for (let building of data.buildings) {
            let gfa: number = building.gfa;
            let heatingNeeds:Map<string,number> = new Map<string,number>();
            for (let scenario of calcData.scenarios) {
                let renPkg: RenovationPackage = scenario.renovationPackage;
                let specHeatNeed: number = renPkg.specificHeatingNeed;
                let heatNeed: number = specHeatNeed*gfa;
                let id: string = scenario.id;
                heatingNeeds.set(id, heatNeed);
            }
            building.heatingNeed = heatingNeeds;    
        }
        return data;
    }

    calcBuildingHeatingNeed(newData);
    
    const calcSpecificHeatingNeed = (data: CalcData) => {
        let res:ResultData = new ResultData();
        let heatingNeeds = new Map<string,number>();
        for (let building of data.buildings) {
            for (const [scenario,heatingNeed] of building.heatingNeed) {
                let old: number|undefined = heatingNeeds.get(scenario);
                if (old) {
                    heatingNeeds.set(scenario, old + heatingNeed);    
                } else {
                    heatingNeeds.set(scenario, heatingNeed);
                }    
            }
        }

        let gfa = data.project.gfa;
        res.specificHeatingNeed = new Map<string,number>();
        for (const [scenario, heatingNeed] of heatingNeeds) {
            res.specificHeatingNeed.set(scenario, heatingNeed/gfa);
        }
        return res;        
    }

    newData.resultData = calcSpecificHeatingNeed(newData);

    return newData;
    
    /* Attempt FP, didn't work out...
    const calcBuildingHeatingNeed = (building: Building) => {
        console.log(building);
        let gfa: number = building.gfa;
        let heatingNeeds:Record<string,number> = {};
        for (let scenario of calcData.scenarios) {
            let renPkg: RenovationPackage = scenario.renovationPackage;
            let specHeatNeed: number = renPkg.specificHeatingNeed;
            let heatNeed: number = specHeatNeed*gfa;
            let id: string = scenario.id;
            heatingNeeds[id] = heatNeed;
        }
        building.heatingNeed = heatingNeeds;
        
        return building;
    }

    const calcSpecificHeatingNeed = (resultData: ResultData) => {
        let heatingNeeds:Record<string,number> = {};
        for (let building of calcData.buildings) {

        }
        return new ResultData();
    }

    const buildingLens = R.lensProp('buildings');
    const resultLens = R.lensProp('resultData');

    const setBuildingHeatingNeed = data => R.over(buildingLens,R.map(calcBuildingHeatingNeed),data);
    const setSpecificHeatingNeed = data => R.set(resultLens,R.map(calcSpecificHeatingNeed),data);

    const calcPipe = data => R.pipe(
        setBuildingHeatingNeed,
        setSpecificHeatingNeed
    )(data);

    const newData:CalcData = calcPipe(calcData);

    return newData;
    */
}

/*
export function calcBuildingHeatingNeed(building: any) {
    let specificHeatingNeed = 15.8;
    let heatingNeed: number = building.gfa;
    return heatingNeed;
}
*/
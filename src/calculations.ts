import { IDictNumeric } from "./classes";

import {
    CalcData, RenovationPackage, Building, ResultData
} from "./classes";

// lenses
import * as R from 'ramda';

export function _performCalculations(calcData: CalcData) {

    const calcBuildingHeatingNeed = (building: Building) => {
        let gfa: number = building.gfa;
        let heatingNeeds: IDictNumeric = {};
        for (let scenario of calcData.scenarios) {
            let renPkg: RenovationPackage = scenario.renovationPackage;
            let specHeatNeed: number = renPkg.specificHeatingNeed;
            let heatNeed: number = specHeatNeed*gfa;
            let id: string = scenario.id;
            heatingNeeds[id] = heatNeed;
            console.log(id, heatNeed, heatingNeeds[id]);
        }
        building.heatingNeed = heatingNeeds;    
        console.log(JSON.stringify(building));
        return building;
    }
    
    const calcSpecificHeatingNeed = (buildings: Building[]) => {
        let res:ResultData = new ResultData();
        let heatingNeeds:IDictNumeric = {};

        let gfa:number = 0;

        for (let building of buildings) {
            gfa += building.gfa;
            for (const [scenario, heatingNeed] of Object.entries(building.heatingNeed)) {
                let old: number|undefined = heatingNeeds[scenario];
                if (old) {
                    heatingNeeds[scenario] += heatingNeed;    
                } else {
                    heatingNeeds[scenario] = heatingNeed;
                }    
            }
        }
        for (const [scenario, heatingNeed] of Object.entries(heatingNeeds)) {
            res.specificHeatingNeed[scenario] = heatingNeed/gfa;
        }
        return res;
    }

    const buildingLens = R.lensProp('buildings');
    const resultLens = R.lensProp('resultData');

    const calc = R.pipe(
        R.over(buildingLens, R.map(calcBuildingHeatingNeed)),
        R.chain(
            R.set(resultLens),
            R.pipe(R.view(buildingLens), calcSpecificHeatingNeed)
        )
    )

    const newData:CalcData = calc(calcData);

    return newData;
}
import { IDictNumeric } from "./classes";

import {
    CalcData, RenovationPackage, Building, ResultData, Scenario
} from "./classes";

// lenses
import * as R from 'ramda';

/* public functions */
export function performCalculations(calcData: CalcData): CalcData {
    /* lenses */
    const buildingLens = R.lensProp('buildings');
    const scenarioLens = R.lensProp('scenarios');
    const resultLens = R.lensPath(['resultData']);
    const specificHeatingNeedLens = R.lensPath(['specificHeatingNeed']);
    const result0specificHeatingNeedLens = <R.Lens>R.pipe(specificHeatingNeedLens);

    /* function call logic */
    const doCalcBuildingHeatingNeed = R.chain(
        R.over(buildingLens),
        R.pipe(R.view(scenarioLens), R.curry(_calcBuildingHeatingNeed), R.map)
    );
    
    const doCalcSpecificHeatingNeed = R.chain(
        R.set(result0specificHeatingNeedLens),
        R.pipe(R.view(buildingLens), _calcSpecificHeatingNeed)
    );

    /* perform function calls */
    const doCalc = R.pipe(
        doCalcBuildingHeatingNeed,
        doCalcSpecificHeatingNeed        
    )
    const newData:CalcData = doCalc(calcData) as CalcData;
    return newData;
}

/* private functions */
function _calcBuildingHeatingNeed(scenarios: Scenario[], building: Building){
    let gfa = building.gfa;
    let heatingNeeds: IDictNumeric = {};
    for (let scenario of scenarios) {
        let renPkg = scenario.renovationPackage;
        let specHeatNeed = renPkg.specificHeatingNeed;
        let heatNeed = specHeatNeed*gfa;
        let id = scenario.id;
        heatingNeeds[id] = heatNeed;
        console.log(id, heatNeed, heatingNeeds[id]);
    }
    building.heatingNeed = heatingNeeds;
    return building;
}

function _calcSpecificHeatingNeed(buildings: Building[]) {
    let heatingNeeds:IDictNumeric = {};
    let specificHeatingNeeds:IDictNumeric = {};
    let totalGfa = 0;

    for (let building of buildings) {
        totalGfa += building.gfa;
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
        specificHeatingNeeds[scenario] = heatingNeed/totalGfa;
    }
    return specificHeatingNeeds;
}
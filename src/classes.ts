import * as uuid from 'uuid/v1';

import { 
    
} from "./calculations";

/* interface defintions */

// defines a dictionary with string keys and numeric values
export interface IDictNumeric {
    [index: string]: number;
}

/* class definitions */
export interface Project {
    id:string;
    gfa:number;
}

export interface Building {
    id:string;
    gfa:number;
    heatingNeed:IDictNumeric;
}

export interface RenovationPackage {
    id:string;
    specificHeatingNeed:number;
    specificCost:number;
    specificEmbodiedEnergy:number;
    specificEmbodiedEmissions:number;
}

export interface EnergyCarrier {
    id:string;
    primaryEnergyFactor:number;
    emissionFactor:number;
}

export interface EnergySystem {
    id:string;
    category:string;
    key:string;
    lifeLength:number;
    energyCarrier:EnergyCarrier;
}

export interface Scenario {
    id:string;
    renovationPackage:RenovationPackage;
    energySystem:EnergySystem;
    specificHeatingNeed:number;
}

/* CalcData structure:

CalcData
    uuid
    project
        id
        gfa
    energyCarriers [
        carrier1
            id
            primaryEnergyFactor
            emissionFactor
        ...
    ]
    buildings [
        building1
            id
            gfa
            heatingNeed
                scenario1:
                ...
        ...
    ]
    renovationPackages [
        package1
            id
            specificHeatingNeed
            specificCost
            specificEmbodiedEnergy
            specificEmbodiedEmissions
        ...
    ]
    energySystems [
        system1
            id
            category
            energyCarrier
            lifeLength
        ...
    ]
    scenarios [
        scenario1
            renovationPackage
            energySystem
        ...
    ]
    resultData
        specificHeatingNeed
            scenario1:
            ...
*/

/*todo: right now we store the entire object in e.g. scenario[n].renovationPackage. 
        would be better to just store a reference to the relevant entry in renovationPackages*/
//todo: make sure that everything is unique (check IDs). can this be done by the constructor?
export class CalcData {
    uuid:string = uuid();
    project:Project;
    buildings:Building[] = [];
    renovationPackages:RenovationPackage[] = [];
    energySystems:EnergySystem[] = [];
    energyCarriers:EnergyCarrier[] = [];
    scenarios:Scenario[] = [];
    resultData:ResultData;

    // question: should we define an interface for inData here? or assume that the data is correct once it reaches this point
    constructor(inData: any) {
        let totalGfa = 0;

        inData.buildings.forEach((building:Building) => {
            totalGfa += building.gfa;
            this.buildings.push(building);
        });

        inData.energyCarriers.forEach((carrier:EnergyCarrier)=> {
            this.energyCarriers.push(carrier);
        });

        inData.renovationPackages.forEach((pkg:RenovationPackage) => {
            this.renovationPackages.push(pkg);
        });

        inData.energySystems.forEach(sys=> {
            let thisCarrier:EnergyCarrier|undefined;
            this.energyCarriers.forEach(carrier=>{
                if (sys.energyCarrier === carrier.id) {
                    thisCarrier = carrier;
                }
            })
            if (thisCarrier == null) {
                throw Error(`energy carrier is undefined: ${sys.energyCarrier}`);
            }
            sys.energyCarrier = thisCarrier;
            this.energySystems.push(sys);
        });

        inData.scenarios.forEach(scenario=> {
            let thisEnergySys:EnergySystem|undefined;
            this.energySystems.forEach(system=>{
                if (scenario.energySystem === system.id) {
                    thisEnergySys = system;
                }
            })
            if (thisEnergySys == null) {
                throw "energy system is undefined: " + scenario.energySystem;
            }
            scenario.energySystem = thisEnergySys;

            let thisRenovationPkg:RenovationPackage|undefined;
            this.renovationPackages.forEach(pkg=>{
                if (scenario.renovationPackage === pkg.id) {
                    thisRenovationPkg = pkg;
                }
            })
            if (thisRenovationPkg == null) {
                throw "renovation package is undefined: " + scenario.renovationPackage;
            }
            scenario.renovationPackage = thisRenovationPkg;

            this.scenarios.push(scenario);
        });
        
        this.project = {id: inData.project, gfa: totalGfa};
        this.resultData = {specificHeatingNeed: {}};
    }
}

export interface ResultData {
    specificHeatingNeed:IDictNumeric;
}
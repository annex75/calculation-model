import * as uuid from 'uuid/v1';

import { 
    
} from "./calculations";
import { timingSafeEqual } from 'crypto';

/* class definitions */
export class Project {
    id:string;
    gfa:number;
    constructor(id: string, gfa:number) {
        this.id = id;
        this.gfa = gfa;
    }
}

export class Building {
    id:string;
    gfa:number;
    heatingNeed:Map<string,number>;
}

export class RenovationPackage {
    id:string;
    specificHeatingNeed:number;
    specificCost:number;
    specificEmbodiedEnergy:number;
    specificEmbodiedEmissions:number;
}

export class EnergyCarrier {
    id:string;
    primaryEnergyFactor:number;
    emissionFactor:number;
}

export class EnergySystem {
    id:string;
    category:string;
    key:string;
    lifeLength:number;
    energyCarrier:EnergyCarrier;
    constructor(id:string,category:string,key:string,lifeLength:number,energyCarrier:EnergyCarrier) {
        this.id = id;
        this.category = category;
        this.key = key;
        this.lifeLength = lifeLength;
        this.energyCarrier = energyCarrier;
    }
}

export class Scenario {
    id:string;
    renovationPackage:RenovationPackage;
    energySystem:EnergySystem;
    specificHeatingNeed:number;
    constructor(id:string,renovationPackage:RenovationPackage,energySystem:EnergySystem) {
        this.id=id;
        this.renovationPackage=renovationPackage;
        this.energySystem=energySystem;
    }
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

        inData.buildings.forEach(building=> {
            let b:Building = Object.assign(new Building(),building);
            totalGfa += b.gfa;
            this.buildings.push(b);
        });

        inData.energyCarriers.forEach(carrier=> {
            this.energyCarriers.push(Object.assign(new EnergyCarrier(),carrier));
        });

        inData.renovationPackages.forEach(pkg=> {
            this.renovationPackages.push(Object.assign(new RenovationPackage(),pkg));
        });

        inData.energySystems.forEach(sys=> {
            let thisCarrier:EnergyCarrier|undefined;
            this.energyCarriers.forEach(carrier=>{
                if (sys.energyCarrier === carrier.id) {
                    thisCarrier = carrier;
                }
            })
            if (thisCarrier == null) {
                throw "energy carrier is undefined: " + sys.energyCarrier;
            }
            this.energySystems.push(new EnergySystem(sys.id,sys.category,sys.key,sys.lifeLength,thisCarrier));
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

            let thisRenovationPkg:RenovationPackage|undefined;
            this.renovationPackages.forEach(pkg=>{
                if (scenario.renovationPackage === pkg.id) {
                    thisRenovationPkg = pkg;
                }
            })
            if (thisRenovationPkg == null) {
                throw "renovation package is undefined: " + scenario.renovationPackage;
            }

            this.scenarios.push(new Scenario(scenario.id,thisRenovationPkg,thisEnergySys));
        });
        
        this.project = new Project(inData.project,totalGfa);
        this.resultData = new ResultData();
    }
}

export class ResultData {
    specificHeatingNeed:Map<string,number>;
}
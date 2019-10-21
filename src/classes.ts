import * as uuid from 'uuid/v1';

import { 
    calcBuildingHeatingNeed
} from "./costCalculations";

export class Building {
    id:string;
    gfa:number;
    heatingNeed:number = calcBuildingHeatingNeed(this);
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
    constructor(id:string,renovationPackage:RenovationPackage,energySystem:EnergySystem) {
        this.id=id;
        this.renovationPackage=renovationPackage;
        this.energySystem=energySystem;
    }
}

export class CalcData {
    uuid:string = uuid();
    buildings:Building[] = [];
    renovationPackages:RenovationPackage[] = [];
    energySystems:EnergySystem[] = [];
    energyCarriers:EnergyCarrier[] = [];
    scenarios:Scenario[] = [];

    // question: should we define an interface here? or is this the interface
    constructor(inData: any) {
        inData.buildings.forEach(building=> {
            this.buildings.push(Object.assign(new Building(),building));
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
            this.renovationPackages.forEach(package=>{
                if (scenario.renovationPackage === package.id) {
                    thisRenovationPkg = package;
                }
            })
            if (thisRenovationPkg == null) {
                throw "renovation package is undefined: " + scenario.renovationPackage;
            }

            this.scenarios.push(new Scenario(scenario.id,thisRenovationPkg,thisEnergySys));
        });
    }
}


import {BuildingMasterInterface ,BuildingInterface ,ElevatorInterface} from './interfaces'
class Elevator implements ElevatorInterface {
    id: number;
    currentFloor: number;
    direction: string;
    destinationQueue: number[];
    lastFloor: number | undefined;

    constructor(elevatorId: number) {
        this.id = elevatorId;
        this.currentFloor = 1; 
        this.direction = "stationary"; 
        this.destinationQueue = []; 
    }

    getCurrentFloor(): number {
        return this.currentFloor;
    }

    getLastFloor(): number {
        return this.lastFloor || 1; 
    }

    // Method to move the elevator to a destination floor
    move(destinationFloor: number): void {
        // Update direction based on the destination floor
        if (destinationFloor > this.currentFloor) {
            this.direction = "up";
        } else if (destinationFloor < this.currentFloor) {
            this.direction = "down";
        } else {
            this.direction = "stationary";
        }

        // Update current floor
        this.lastFloor = this.currentFloor;
        this.currentFloor = destinationFloor;
        this.destinationQueue.shift(); 
    }

    addToQueue(floor: number): void {
        this.destinationQueue.push(floor);
    }

    handleRequest(floor: number): void {
        this.addToQueue(floor);

        if (this.direction === "stationary") {
            this.move(this.destinationQueue[0]);
        }
    }
}

class ElevatorFactory {
    static createElevator(elevatorId: number): Elevator {
        return new Elevator(elevatorId);
    }
}

 class Building implements BuildingInterface {
    elevators: Elevator[];
    idsList:number[];

    constructor(numElevators: number) {
        this.idsList = Array.from({ length: numElevators }, () => Math.floor(Math.random() * (100 - 1 + 1)) + 1);
        this.elevators = this.idsList.map(id => ElevatorFactory.createElevator(id));
    }

    numberOfElevators(): number {
        return this.elevators.length;
    }

    elevatorsIdsList(): Array<number>{
        return this.idsList;
    }

    getElevatorById(elevatorId: number): Elevator | null {
        const elevator = this.elevators.find(elevator => elevator.id === elevatorId);
        return elevator ? elevator : null;
    }

    callElevator(floor: number): number {
        // Determine the best elevator to handle the request
        let bestElevator: Elevator | null = null;
        let minDistance = Infinity;

        for (const elevator of this.elevators) {
            if (elevator.direction === "stationary") {
                const distance = Math.abs(elevator.currentFloor - floor);
                if (distance < minDistance) {
                    bestElevator = elevator;
                    minDistance = distance;
                }
            }
        }

        if (bestElevator) {
            bestElevator.handleRequest(floor);
            return bestElevator.id;
        } else {
            console.log("No available elevators.");
            
            return 0;
        }

        
    }

    releaseElevator(elevatorId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                const elevator = this.getElevatorById(elevatorId);
                if (elevator) {
                    elevator.direction = "stationary";
                    resolve(); // Resolve the promise after releasing elevator
                } else {
                    reject("Elevator not found");
                }
            }, 4000);
        });
    }
    
   
}

 class BuildingMaster implements BuildingMasterInterface{
    buildings: Building[];
    numOfFloors: number;

    constructor(numBuildings: number, numElevatorsPerBuilding: number,numOfFloors: number) {
        this.buildings = Array.from({ length: numBuildings }, () => new Building(numElevatorsPerBuilding));
        this.numOfFloors = numOfFloors;
    }

    numberOfBuildings(): number {
        return this.buildings.length;
    }

    callElevator(buildingIndex: number, floor: number): number {
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length && floor <= this.numOfFloors ) {
            return this.buildings[buildingIndex].callElevator(floor);
        } else {
            console.log("Building index out of range.");
            return 0;
        }
    }

    releaseElevator(buildingIndex: number, elevatorId: number): Promise<void> {
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length) {
            return this.buildings[buildingIndex].releaseElevator(elevatorId);
        } else {
            console.log("Building index out of range.");
            return Promise.reject("Building index out of range.");
        }
    }
}

class BuildingMasterFactory {
    static createBuildingMaster(numBuildings: number, numElevatorsPerBuilding: number, numOfFloors: number): BuildingMaster {
        return new BuildingMaster(numBuildings, numElevatorsPerBuilding, numOfFloors);
    }
}

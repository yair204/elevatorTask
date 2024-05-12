import { BuildingMasterInterface, BuildingInterface, ElevatorInterface } from './interfaces';

// Define the Elevator class implementing the ElevatorInterface
class Elevator implements ElevatorInterface {
    id: number;
    currentFloor: number;
    direction: string;
    destinationQueue: number[];
    lastFloor: number | undefined;

    // Constructor to initialize elevator properties
    constructor(elevatorId: number) {
        this.id = elevatorId;
        this.currentFloor = 1; // Set initial floor to 1
        this.direction = "stationary"; // Set initial direction to stationary
        this.destinationQueue = []; // Initialize destination queue
    }

    // Method to get the current floor of the elevator
    getCurrentFloor(): number {
        return this.currentFloor;
    }

    // Method to get the last floor visited by the elevator
    getLastFloor(): number {
        return this.lastFloor || 1; // If last floor is undefined, default to 1
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

        // Update current floor and remove the destination floor from queue
        this.lastFloor = this.currentFloor;
        this.currentFloor = destinationFloor;
        this.destinationQueue.shift();
    }

    // Method to add a floor to the destination queue
    addToQueue(floor: number): void {
        this.destinationQueue.push(floor);
    }

    // Method to handle a floor request
    handleRequest(floor: number): void {
        this.addToQueue(floor); // Add floor to destination queue

        // If elevator is stationary, move to the first floor in the queue
        if (this.direction === "stationary") {
            this.move(this.destinationQueue[0]);
        }
    }
}

// Factory class to create instances of Elevator
class ElevatorFactory {
    static createElevator(elevatorId: number): Elevator {
        return new Elevator(elevatorId);
    }
}

// Define the Building class implementing the BuildingInterface
class Building implements BuildingInterface {
    elevators: Elevator[];
    idsList: number[];
    buildingIndex: number;

    // Constructor to initialize building properties and create elevators
    constructor(numElevators: number, BIndex: number) {
        this.buildingIndex = BIndex; // Set building index
        // Generate unique elevator IDs based on building index and elevator index
        this.idsList = Array.from({ length: numElevators }, (_, index) => (this.buildingIndex * 100) + index + 1);
        // Create elevators using the generated IDs
        this.elevators = this.idsList.map(id => ElevatorFactory.createElevator(id));
    }

    // Method to get the number of elevators in the building
    numberOfElevators(): number {
        return this.elevators.length;
    }

    // Method to get the list of elevator IDs in the building
    elevatorsIdsList(): Array<number> {
        return this.idsList;
    }

    // Method to get an elevator by its ID
    getElevatorById(elevatorId: number): Elevator | null {
        const elevator = this.elevators.find(elevator => elevator.id === elevatorId);
        return elevator ? elevator : null;
    }

    // Method to call an elevator to a specific floor
    callElevator(floor: number): number {
        // Determine the best elevator to handle the request
        let bestElevator: Elevator | null = null;
        let minDistance = Infinity;

        // Iterate through elevators to find the closest available one
        for (const elevator of this.elevators) {
            if (elevator.direction === "stationary") {
                const distance = Math.abs(elevator.currentFloor - floor);
                if (distance < minDistance) {
                    bestElevator = elevator;
                    minDistance = distance;
                }
            }
        }

        // If an available elevator is found, handle the request
        if (bestElevator) {
            bestElevator.handleRequest(floor);
            return bestElevator.id; // Return the ID of the assigned elevator
        } else {
            console.log("No available elevators.");
            return 0; // Return 0 indicating no available elevators
        }
    }

    // Method to release an elevator after a certain time
    releaseElevator(elevatorId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                const elevator = this.getElevatorById(elevatorId);
                if (elevator) {
                    elevator.direction = "stationary"; // Set elevator direction to stationary
                    resolve(); // Resolve the promise after releasing elevator
                } else {
                    reject("Elevator not found"); // Reject if elevator is not found
                }
            }, 4000); // Release after 4 seconds (4000 milliseconds)
        });
    }
}

// Define the BuildingMaster class implementing the BuildingMasterInterface
class BuildingMaster implements BuildingMasterInterface {
    buildings: Building[];
    numOfFloors: number;

    // Constructor to initialize building master properties and create buildings
    constructor(numBuildings: number, numElevatorsPerBuilding: number, numOfFloors: number) {
        // Create buildings with the specified number of elevators and floors
        this.buildings = Array.from({ length: numBuildings }, (_, BIndex: number) => new Building(numElevatorsPerBuilding, BIndex));
        this.numOfFloors = numOfFloors; // Set the total number of floors
    }

    // Method to get the number of buildings managed by the building master
    numberOfBuildings(): number {
        return this.buildings.length;
    }

    // Method to call an elevator in a specific building to a certain floor
    callElevator(buildingIndex: number, floor: number): number {
        // Check if building index and floor are within valid ranges
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length && floor <= this.numOfFloors) {
            return this.buildings[buildingIndex].callElevator(floor); // Call elevator in the specified building
        } else {
            console.log("Building index or floor out of range.");
            return 0; // Return 0 indicating invalid building index or floor
        }
    }

    // Method to release an elevator in a specific building
    releaseElevator(buildingIndex: number, elevatorId: number): Promise<void> {
        // Check if building index is within valid range
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length) {
            return this.buildings[buildingIndex].releaseElevator(elevatorId); // Release elevator in the specified building
        } else {
            console.log("Building index out of range.");
            return Promise.reject("Building index out of range."); // Reject if building index is out of range
        }
    }
}

// Factory class to create instances of BuildingMaster
class BuildingMasterFactory {
    static createBuildingMaster(numBuildings: number, numElevatorsPerBuilding: number, numOfFloors: number): BuildingMaster {
        return new BuildingMaster(numBuildings, numElevatorsPerBuilding, numOfFloors);
    }
}

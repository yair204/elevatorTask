class Elevator {
    id: number;
    currentFloor: number;
    direction: string;
    destinationQueue: number[];
    lastFloor: number | undefined;

    constructor(elevatorId: number) {
        this.id = elevatorId;
        this.currentFloor = 1; // Initial position at ground floor
        this.direction = "stationary"; // Initial direction is stationary
        this.destinationQueue = []; // Queue to store destination floors
        this.lastFloor = 1;
    }

    // Getter method to retrieve the current floor
    get getCurrentFloor() {
        return this.currentFloor;
    }

    get getLastFloor() {
        return this.lastFloor;
    }

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
        // Add a floor to the destination queue
        this.destinationQueue.push(floor);
    }

    handleRequest(floor: number): void {
        // Add requested floor to the destination queue
        this.addToQueue(floor);

        // If elevator is currently stationary, start moving towards the first destination
        if (this.direction === "stationary") {
            this.move(this.destinationQueue[0]);
        }
    }
}

class Building {
    elevators: Elevator[];
    idsList:number[];

    constructor(numElevators: number) {
        this.idsList = Array.from({ length: numElevators }, () => Math.floor(Math.random() * (100 - 1 + 1)) + 1);
        this.elevators = this.idsList.map(id => new Elevator(id));
    }

    get numberOfElevators(): number {
        return this.elevators.length;
    }

    get elevatorsIdsList(): Array<number>{
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

class BuildingMaster {
    buildings: Building[];

    constructor(numBuildings: number, numElevatorsPerBuilding: number) {
        this.buildings = Array.from({ length: numBuildings }, () => new Building(numElevatorsPerBuilding));
    }

    get numberOfBuildings(): number {
        return this.buildings.length;
    }

    callElevator(buildingIndex: number, floor: number): number {
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length) {
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


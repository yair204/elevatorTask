class Elevator {
    id: number;
    currentFloor: number;
    direction: string;
    destinationQueue: number[];

    constructor(elevatorId: number) {
        this.id = elevatorId;
        this.currentFloor = 0; // Initial position at ground floor
        this.direction = "stationary"; // Initial direction is stationary
        this.destinationQueue = []; // Queue to store destination floors
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
        
        // Move the elevator to the destination floor
        // (Implementation not provided, depends on simulation environment)

        // Update current floor
        this.currentFloor = destinationFloor;
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

    constructor(numElevators: number) {
        this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i));
    }

    callElevator(floor: number): void {
        console.log(floor)
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

        // Add floor request to the selected elevator's queue
        if (bestElevator) {
            bestElevator.handleRequest(floor);
        } else {
            console.log("No available elevators.");
        }
    }

    pressButton(floor: number, direction: string): void {
        // Add floor request to the closest elevator going in the specified direction
        // (Implementation not provided, depends on building layout and elevator positions)
    }
}



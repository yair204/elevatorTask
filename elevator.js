var Elevator = /** @class */ (function () {
    function Elevator(elevatorId) {
        this.id = elevatorId;
        this.currentFloor = 0; // Initial position at ground floor
        this.direction = "stationary"; // Initial direction is stationary
        this.destinationQueue = []; // Queue to store destination floors
    }
    Elevator.prototype.move = function (destinationFloor) {
        // Update direction based on the destination floor
        if (destinationFloor > this.currentFloor) {
            this.direction = "up";
        }
        else if (destinationFloor < this.currentFloor) {
            this.direction = "down";
        }
        else {
            this.direction = "stationary";
        }
        // Move the elevator to the destination floor
        // (Implementation not provided, depends on simulation environment)
        // Update current floor
        this.currentFloor = destinationFloor;
    };
    Elevator.prototype.addToQueue = function (floor) {
        // Add a floor to the destination queue
        this.destinationQueue.push(floor);
    };
    Elevator.prototype.handleRequest = function (floor) {
        // Add requested floor to the destination queue
        this.addToQueue(floor);
        // If elevator is currently stationary, start moving towards the first destination
        if (this.direction === "stationary") {
            this.move(this.destinationQueue[0]);
        }
    };
    return Elevator;
}());
var Building = /** @class */ (function () {
    function Building(numElevators) {
        this.elevators = Array.from({ length: numElevators }, function (_, i) { return new Elevator(i); });
    }
    Building.prototype.callElevator = function (floor) {
        console.log(floor);
        // Determine the best elevator to handle the request
        var bestElevator = null;
        var minDistance = Infinity;
        for (var _i = 0, _a = this.elevators; _i < _a.length; _i++) {
            var elevator = _a[_i];
            if (elevator.direction === "stationary") {
                var distance = Math.abs(elevator.currentFloor - floor);
                if (distance < minDistance) {
                    bestElevator = elevator;
                    minDistance = distance;
                }
            }
        }
        // Add floor request to the selected elevator's queue
        if (bestElevator) {
            bestElevator.handleRequest(floor);
        }
        else {
            console.log("No available elevators.");
        }
    };
    Building.prototype.pressButton = function (floor, direction) {
        // Add floor request to the closest elevator going in the specified direction
        // (Implementation not provided, depends on building layout and elevator positions)
    };
    return Building;
}());

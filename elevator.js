var Elevator = /** @class */ (function () {
    function Elevator(elevatorId) {
        this.id = elevatorId;
        this.currentFloor = 1; // Initial position at ground floor
        this.direction = "stationary"; // Initial direction is stationary
        this.destinationQueue = []; // Queue to store destination floors
        this.lastFloor = 1;
    }
    Object.defineProperty(Elevator.prototype, "getCurrentFloor", {
        // Getter method to retrieve the current floor
        get: function () {
            return this.currentFloor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Elevator.prototype, "getLastFloor", {
        get: function () {
            return this.lastFloor;
        },
        enumerable: false,
        configurable: true
    });
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
        // Update current floor
        this.lastFloor = this.currentFloor;
        this.currentFloor = destinationFloor;
        this.destinationQueue.shift();
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
        this.idsList = Array.from({ length: numElevators }, function () { return Math.floor(Math.random() * (100 - 1 + 1)) + 1; });
        this.elevators = this.idsList.map(function (id) { return new Elevator(id); });
    }
    Object.defineProperty(Building.prototype, "numberOfElevators", {
        get: function () {
            return this.elevators.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Building.prototype, "elevatorsIdsList", {
        get: function () {
            return this.idsList;
        },
        enumerable: false,
        configurable: true
    });
    Building.prototype.getElevatorById = function (elevatorId) {
        var elevator = this.elevators.find(function (elevator) { return elevator.id === elevatorId; });
        return elevator ? elevator : null;
    };
    Building.prototype.callElevator = function (floor) {
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
        if (bestElevator) {
            bestElevator.handleRequest(floor);
            return bestElevator.id;
        }
        else {
            console.log("No available elevators.");
            return 0;
        }
    };
    Building.prototype.releaseElevator = function (elevatorId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var elevator = _this.getElevatorById(elevatorId);
                if (elevator) {
                    elevator.direction = "stationary";
                    resolve(); // Resolve the promise after releasing elevator
                }
                else {
                    reject("Elevator not found");
                }
            }, 4000);
        });
    };
    return Building;
}());
var BuildingMaster = /** @class */ (function () {
    function BuildingMaster(numBuildings, numElevatorsPerBuilding) {
        this.buildings = Array.from({ length: numBuildings }, function () { return new Building(numElevatorsPerBuilding); });
    }
    Object.defineProperty(BuildingMaster.prototype, "numberOfBuildings", {
        get: function () {
            return this.buildings.length;
        },
        enumerable: false,
        configurable: true
    });
    BuildingMaster.prototype.callElevator = function (buildingIndex, floor) {
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length) {
            return this.buildings[buildingIndex].callElevator(floor);
        }
        else {
            console.log("Building index out of range.");
            return 0;
        }
    };
    BuildingMaster.prototype.releaseElevator = function (buildingIndex, elevatorId) {
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length) {
            return this.buildings[buildingIndex].releaseElevator(elevatorId);
        }
        else {
            console.log("Building index out of range.");
            return Promise.reject("Building index out of range.");
        }
    };
    return BuildingMaster;
}());

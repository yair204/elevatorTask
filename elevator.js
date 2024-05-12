"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define the Elevator class implementing the ElevatorInterface
var Elevator = /** @class */ (function () {
    // Constructor to initialize elevator properties
    function Elevator(elevatorId) {
        this.id = elevatorId;
        this.currentFloor = 1; // Set initial floor to 1
        this.direction = "stationary"; // Set initial direction to stationary
        this.destinationQueue = []; // Initialize destination queue
    }
    // Method to get the current floor of the elevator
    Elevator.prototype.getCurrentFloor = function () {
        return this.currentFloor;
    };
    // Method to get the last floor visited by the elevator
    Elevator.prototype.getLastFloor = function () {
        return this.lastFloor || 1; // If last floor is undefined, default to 1
    };
    // Method to move the elevator to a destination floor
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
        // Update current floor and remove the destination floor from queue
        this.lastFloor = this.currentFloor;
        this.currentFloor = destinationFloor;
        this.destinationQueue.shift();
    };
    // Method to add a floor to the destination queue
    Elevator.prototype.addToQueue = function (floor) {
        this.destinationQueue.push(floor);
    };
    // Method to handle a floor request
    Elevator.prototype.handleRequest = function (floor) {
        this.addToQueue(floor); // Add floor to destination queue
        // If elevator is stationary, move to the first floor in the queue
        if (this.direction === "stationary") {
            this.move(this.destinationQueue[0]);
        }
    };
    return Elevator;
}());
// Factory class to create instances of Elevator
var ElevatorFactory = /** @class */ (function () {
    function ElevatorFactory() {
    }
    ElevatorFactory.createElevator = function (elevatorId) {
        return new Elevator(elevatorId);
    };
    return ElevatorFactory;
}());
// Define the Building class implementing the BuildingInterface
var Building = /** @class */ (function () {
    // Constructor to initialize building properties and create elevators
    function Building(numElevators, BIndex) {
        var _this = this;
        this.buildingIndex = BIndex; // Set building index
        // Generate unique elevator IDs based on building index and elevator index
        this.idsList = Array.from({ length: numElevators }, function (_, index) { return (_this.buildingIndex * 100) + index + 1; });
        // Create elevators using the generated IDs
        this.elevators = this.idsList.map(function (id) { return ElevatorFactory.createElevator(id); });
    }
    // Method to get the number of elevators in the building
    Building.prototype.numberOfElevators = function () {
        return this.elevators.length;
    };
    // Method to get the list of elevator IDs in the building
    Building.prototype.elevatorsIdsList = function () {
        return this.idsList;
    };
    // Method to get an elevator by its ID
    Building.prototype.getElevatorById = function (elevatorId) {
        var elevator = this.elevators.find(function (elevator) { return elevator.id === elevatorId; });
        return elevator ? elevator : null;
    };
    // Method to call an elevator to a specific floor
    Building.prototype.callElevator = function (floor) {
        // Determine the best elevator to handle the request
        var bestElevator = null;
        var minDistance = Infinity;
        // Iterate through elevators to find the closest available one
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
        // If an available elevator is found, handle the request
        if (bestElevator) {
            bestElevator.handleRequest(floor);
            return bestElevator.id; // Return the ID of the assigned elevator
        }
        else {
            console.log("No available elevators.");
            return 0; // Return 0 indicating no available elevators
        }
    };
    // Method to release an elevator after a certain time
    Building.prototype.releaseElevator = function (elevatorId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var elevator = _this.getElevatorById(elevatorId);
                if (elevator) {
                    elevator.direction = "stationary"; // Set elevator direction to stationary
                    resolve(); // Resolve the promise after releasing elevator
                }
                else {
                    reject("Elevator not found"); // Reject if elevator is not found
                }
            }, 4000); // Release after 4 seconds (4000 milliseconds)
        });
    };
    return Building;
}());
// Define the BuildingMaster class implementing the BuildingMasterInterface
var BuildingMaster = /** @class */ (function () {
    // Constructor to initialize building master properties and create buildings
    function BuildingMaster(numBuildings, numElevatorsPerBuilding, numOfFloors) {
        // Create buildings with the specified number of elevators and floors
        this.buildings = Array.from({ length: numBuildings }, function (_, BIndex) { return new Building(numElevatorsPerBuilding, BIndex); });
        this.numOfFloors = numOfFloors; // Set the total number of floors
    }
    // Method to get the number of buildings managed by the building master
    BuildingMaster.prototype.numberOfBuildings = function () {
        return this.buildings.length;
    };
    // Method to call an elevator in a specific building to a certain floor
    BuildingMaster.prototype.callElevator = function (buildingIndex, floor) {
        // Check if building index and floor are within valid ranges
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length && floor <= this.numOfFloors) {
            return this.buildings[buildingIndex].callElevator(floor); // Call elevator in the specified building
        }
        else {
            console.log("Building index or floor out of range.");
            return 0; // Return 0 indicating invalid building index or floor
        }
    };
    // Method to release an elevator in a specific building
    BuildingMaster.prototype.releaseElevator = function (buildingIndex, elevatorId) {
        // Check if building index is within valid range
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length) {
            return this.buildings[buildingIndex].releaseElevator(elevatorId); // Release elevator in the specified building
        }
        else {
            console.log("Building index out of range.");
            return Promise.reject("Building index out of range."); // Reject if building index is out of range
        }
    };
    return BuildingMaster;
}());
// Factory class to create instances of BuildingMaster
var BuildingMasterFactory = /** @class */ (function () {
    function BuildingMasterFactory() {
    }
    BuildingMasterFactory.createBuildingMaster = function (numBuildings, numElevatorsPerBuilding, numOfFloors) {
        return new BuildingMaster(numBuildings, numElevatorsPerBuilding, numOfFloors);
    };
    return BuildingMasterFactory;
}());

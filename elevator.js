"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Elevator = /** @class */ (function () {
    function Elevator(elevatorId) {
        this.id = elevatorId;
        this.currentFloor = 1;
        this.direction = "stationary";
        this.destinationQueue = [];
    }
    Elevator.prototype.getCurrentFloor = function () {
        return this.currentFloor;
    };
    Elevator.prototype.getLastFloor = function () {
        return this.lastFloor || 1;
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
        // Update current floor
        this.lastFloor = this.currentFloor;
        this.currentFloor = destinationFloor;
        this.destinationQueue.shift();
    };
    Elevator.prototype.addToQueue = function (floor) {
        this.destinationQueue.push(floor);
    };
    Elevator.prototype.handleRequest = function (floor) {
        this.addToQueue(floor);
        if (this.direction === "stationary") {
            this.move(this.destinationQueue[0]);
        }
    };
    return Elevator;
}());
var ElevatorFactory = /** @class */ (function () {
    function ElevatorFactory() {
    }
    ElevatorFactory.createElevator = function (elevatorId) {
        return new Elevator(elevatorId);
    };
    return ElevatorFactory;
}());
var Building = /** @class */ (function () {
    function Building(numElevators) {
        this.idsList = Array.from({ length: numElevators }, function () { return Math.floor(Math.random() * (100 - 1 + 1)) + 1; });
        this.elevators = this.idsList.map(function (id) { return ElevatorFactory.createElevator(id); });
    }
    Building.prototype.numberOfElevators = function () {
        return this.elevators.length;
    };
    Building.prototype.elevatorsIdsList = function () {
        return this.idsList;
    };
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
    function BuildingMaster(numBuildings, numElevatorsPerBuilding, numOfFloors) {
        this.buildings = Array.from({ length: numBuildings }, function () { return new Building(numElevatorsPerBuilding); });
        this.numOfFloors = numOfFloors;
    }
    BuildingMaster.prototype.numberOfBuildings = function () {
        return this.buildings.length;
    };
    BuildingMaster.prototype.callElevator = function (buildingIndex, floor) {
        if (buildingIndex >= 0 && buildingIndex < this.buildings.length && floor <= this.numOfFloors) {
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
var BuildingMasterFactory = /** @class */ (function () {
    function BuildingMasterFactory() {
    }
    BuildingMasterFactory.createBuildingMaster = function (numBuildings, numElevatorsPerBuilding, numOfFloors) {
        return new BuildingMaster(numBuildings, numElevatorsPerBuilding, numOfFloors);
    };
    return BuildingMasterFactory;
}());

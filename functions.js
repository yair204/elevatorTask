"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createElevators(building, b, elevatorsContainer, setting) {
    elevatorsContainer.id = "elevators".concat(b + 1);
    elevatorsContainer.classList.add("elevators");
    // Loop to create elevator images for the building
    for (var i = 0; i < setting.NUM_OF_ELEVATORS; i++) {
        var elevatorId = building.elevatorsIdsList()[i];
        var elevatorsImg = document.createElement("img");
        elevatorsImg.classList.add("elevatorsStyle");
        elevatorsImg.src = "resources/elv.png";
        elevatorsImg.alt = "Elevator";
        elevatorsImg.id = elevatorId === null || elevatorId === void 0 ? void 0 : elevatorId.toString();
        elevatorsContainer.appendChild(elevatorsImg);
    }
}
function createFloors(master, building, buildingIndex, floors, setting) {
    floors.id = "floors".concat(buildingIndex + 1);
    floors.classList.add("floors");
    floors.innerHTML = ""; // Clear previous content
    var floorsIndex = {};
    var _loop_1 = function (i) {
        // Create elements for floor and counter
        var counterAndFloors = document.createElement("div");
        counterAndFloors.classList.add("counterAndFloors");
        var counterContainer = document.createElement('div');
        counterContainer.classList.add("counterContainer");
        var counter = document.createElement('p');
        counter.classList.add('counterStyle');
        // Create elements for metal div and assign click handler
        var floorContainer = document.createElement("div");
        floorContainer.classList.add("floor");
        floorContainer.style.height = setting.HEIGHT + "px";
        var metalDiv = document.createElement("button");
        metalDiv.classList.add("metal", "linear");
        metalDiv.textContent = i.toString();
        metalDiv.id = "building".concat(buildingIndex).concat(i);
        floorsIndex[i] = i;
        metalDiv.onclick = function () {
            // Handle elevator call and timer start
            var currentElevatorId = master.callElevator(buildingIndex, floorsIndex[i]);
            var elevatorInst = building.getElevatorById(currentElevatorId);
            if (currentElevatorId && (elevatorInst === null || elevatorInst === void 0 ? void 0 : elevatorInst.getLastFloor())) {
                startTimer(elevatorInst.getCurrentFloor() - elevatorInst.getLastFloor(), counter);
                document.getElementById("noElevators").innerText = "";
                moveElevator(master, building, buildingIndex, currentElevatorId, setting);
                handleBackgroundClick(building, metalDiv.id, currentElevatorId);
            }
            else {
                document.getElementById("noElevators").innerText =
                    "No elevator available";
            }
        };
        // Append elements to their respective containers
        floorContainer.appendChild(metalDiv);
        counterContainer.appendChild(counter);
        counterAndFloors.appendChild(floorContainer);
        counterAndFloors.appendChild(counterContainer);
        floors.appendChild(counterAndFloors);
    };
    for (var i = setting.NUM_OF_FLOORS; i >= 1; i--) {
        _loop_1(i);
    }
}
function moveElevator(master, building, buildingIndex, elevatorId, setting) {
    var elevatorImg = document.getElementById(elevatorId.toString());
    var elevatorInst = building.getElevatorById(elevatorId);
    if (elevatorInst && elevatorImg) {
        var newPosition = (elevatorInst.getCurrentFloor() - 1) * setting.HEIGHT +
            elevatorInst.getCurrentFloor() * 7 +
            "px";
        elevatorImg.style.marginBottom = newPosition;
        if (elevatorInst.getLastFloor()) {
            elevatorImg.style.setProperty("--transition-duration", Math.abs(elevatorInst.getCurrentFloor() - elevatorInst.getLastFloor()) *
                0.5 +
                "s");
        }
        // Call releaseElevator asynchronously without waiting for it to finish
        master
            .releaseElevator(buildingIndex, elevatorId)
            .then(function () {
            console.log("Elevator released after 2 seconds");
        })
            .catch(function (error) {
            console.error("Error in releasing elevator:", error);
        });
    }
}
function handleBackgroundClick(building, metalId, elevatorId) {
    var metal = document.getElementById(metalId);
    if (metal) {
        metal.classList.remove("linear");
        metal.classList.add("linearGreenBackground");
        var elevatorInst = building.getElevatorById(elevatorId);
        var numberOfFloorsMoved = void 0;
        if (elevatorInst.getLastFloor()) {
            numberOfFloorsMoved = Math.abs(elevatorInst.getCurrentFloor() - elevatorInst.getLastFloor());
        }
        setTimeout(function () {
            var audio = new Audio("resources/ding.mp3");
            audio.play();
            metal.classList.remove("linearGreenBackground");
            metal.classList.add("linear");
        }, numberOfFloorsMoved * 500);
    }
}
function startTimer(durationInSeconds, counterObj) {
    var secondsLeft = (Math.ceil(Math.abs(durationInSeconds) * 0.5) * 6);
    var timerInterval = setInterval(function () {
        secondsLeft--;
        if (counterObj) {
            counterObj.textContent = secondsLeft.toString();
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                counterObj.innerText = " ";
            }
        }
    }, 100);
}

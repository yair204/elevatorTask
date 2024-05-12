
import { BuildingMasterInterface, BuildingInterface, ElevatorInterface, Setting } from './interfaces'

function createElevators( building: BuildingInterface, b: number, elevatorsContainer: HTMLElement, setting: Setting): void {
    elevatorsContainer.id = `elevators${b + 1}`;
    elevatorsContainer.classList.add("elevators");

    // Loop to create elevator images for the building
    for (let i = 0; i < setting.NUM_OF_ELEVATORS; i++) {
        const elevatorId = building.elevatorsIdsList()[i];
        const elevatorsImg = document.createElement("img");
        elevatorsImg.classList.add("elevatorsStyle");
        elevatorsImg.src = "resources/elv.png";
        elevatorsImg.alt = "Elevator";
        elevatorsImg.id = elevatorId?.toString();
        elevatorsContainer.appendChild(elevatorsImg);
    }
}

function createFloors(master: BuildingMasterInterface, building: BuildingInterface, buildingIndex: number, floors: HTMLElement, setting: Setting): void {
    floors.id = `floors${buildingIndex + 1}`;
    floors.classList.add("floors");
    floors.innerHTML = ""; // Clear previous content
    let floorsIndex: { [key: number]: number } = {};
    for (let i = setting.NUM_OF_FLOORS; i >= 1; i--) {
        // Create elements for floor and counter
        const counterAndFloors = document.createElement("div");
        counterAndFloors.classList.add("counterAndFloors");

        const counterContainer = document.createElement('div');
        counterContainer.classList.add("counterContainer");

        const counter = document.createElement('p');
        counter.classList.add('counterStyle');

        // Create elements for metal div and assign click handler
        const floorContainer = document.createElement("div");
        floorContainer.classList.add("floor");
        floorContainer.style.height = setting.HEIGHT + "px";

        const metalDiv = document.createElement("button");
        metalDiv.classList.add("metal", "linear");

        metalDiv.textContent = i.toString();
        metalDiv.id = `building${buildingIndex}${i}`;
        floorsIndex[i] = i;

        metalDiv.onclick = function () {
            // Handle elevator call and timer start
            const currentElevatorId = master.callElevator(buildingIndex, floorsIndex[i]) as number;
            const elevatorInst = building.getElevatorById(currentElevatorId) as ElevatorInterface | null;
            if (currentElevatorId && elevatorInst?.getLastFloor()) {
                startTimer(elevatorInst.getCurrentFloor() - elevatorInst.getLastFloor(), counter);
                document.getElementById("noElevators")!.innerText = "";
                moveElevator(master, building, buildingIndex, currentElevatorId, setting);
                handleBackgroundClick(building, metalDiv.id, currentElevatorId);
            } else {
                document.getElementById("noElevators")!.innerText =
                    "No elevator available";
            }
        };

        // Append elements to their respective containers
        floorContainer.appendChild(metalDiv);
        counterContainer.appendChild(counter);
        counterAndFloors.appendChild(floorContainer);
        counterAndFloors.appendChild(counterContainer);
        floors.appendChild(counterAndFloors);
    }
}

function moveElevator(master: BuildingMasterInterface, building: BuildingInterface, buildingIndex: number, elevatorId: number, setting: Setting): void {
    const elevatorImg = document.getElementById(elevatorId.toString());
    const elevatorInst = building.getElevatorById(elevatorId) as ElevatorInterface;
    if (elevatorInst && elevatorImg) {
        const newPosition = (elevatorInst.getCurrentFloor() - 1) * setting.HEIGHT +
            elevatorInst.getCurrentFloor() * 7 +
            "px";
        elevatorImg.style.marginBottom = newPosition;

        if (elevatorInst.getLastFloor()) {
            elevatorImg.style.setProperty(
                "--transition-duration",
                Math.abs(elevatorInst.getCurrentFloor() - elevatorInst.getLastFloor()) *
                0.5 +
                "s"
            );
        }   
        // Call releaseElevator asynchronously without waiting for it to finish
        master
            .releaseElevator(buildingIndex, elevatorId)
            .then(() => {
                console.log("Elevator released after 2 seconds");
            })
            .catch((error) => {
                console.error("Error in releasing elevator:", error);
            });
    }
}

function handleBackgroundClick(building: BuildingInterface, metalId: string, elevatorId: number): void {
    const metal = document.getElementById(metalId);
    if (metal) {
        metal.classList.remove("linear");
        metal.classList.add("linearGreenBackground");
        const elevatorInst = building.getElevatorById(elevatorId) as ElevatorInterface;
        let numberOfFloorsMoved;
        if (elevatorInst.getLastFloor()) {
            numberOfFloorsMoved = Math.abs(
                elevatorInst.getCurrentFloor() - elevatorInst.getLastFloor()
            );
        }
        setTimeout(function () {
            const audio = new Audio("resources/ding.mp3");
            audio.play();
            metal.classList.remove("linearGreenBackground");
            metal.classList.add("linear");
        }, numberOfFloorsMoved * 500);
    }
}

function startTimer(durationInSeconds: number, counterObj: HTMLElement): void {
    let secondsLeft = (Math.ceil(Math.abs(durationInSeconds) * 0.5) * 6);
    let timerInterval = setInterval(() => {
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

function createElevators(building,b,elevatorsContainer){
    elevatorsContainer.id = `elevators${b + 1}`; 
    elevatorsContainer.classList.add("elevators");

    // Loop to create elevator images for the building
    for (let i = 0; i < building.numberOfElevators; i++) {
        const elevatorId = building.elevatorsIdsList[i]; 
        const elevatorsImg = document.createElement("img"); 
        elevatorsImg.classList.add("elevatorsStyle"); 
        elevatorsImg.src = "elv.png";
        elevatorsImg.alt = "Elevator";
        elevatorsImg.id = elevatorId;
        elevatorsContainer.appendChild(elevatorsImg);
    }
}

function createFloors(building,buildingIndex,floors) {
    floors.id = `floors${buildingIndex + 1}`;
    floors.classList.add("floors");
    floors.innerHTML = ""; // Clear previous content
    let floorsIndex = {};
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

        metalDiv.textContent = i;
        metalDiv.id = `building${buildingIndex}${i}`;
        floorsIndex[i] = i;
        console.log("🚀 ~ createFloors ~ metalDiv.id:", metalDiv.id)


        metalDiv.onclick = function () {
            // Handle elevator call and timer start
            const currentElevatorId = master.callElevator(buildingIndex,floorsIndex[i]);
            console.log("🚀 ~ createFloors ~ buildingIndex:", buildingIndex)
            const elevatorInst = building.getElevatorById(currentElevatorId);
            startTimer(elevatorInst.getCurrentFloor - elevatorInst.getLastFloor, counter);
            if (currentElevatorId) {
                document.getElementById("noElevators").innerText = "";
                moveElevator(building,buildingIndex,currentElevatorId);
                handleBackgroundClick(building,metalDiv.id, currentElevatorId);
            } else {
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
    }
}

function moveElevator(building,buildingIndex,elevatorId) {
  const elevatorImg = document.getElementById(elevatorId);
  const elevatorInst = building.getElevatorById(elevatorId); 
  const newPosition =  (elevatorInst.getCurrentFloor - 1) * setting.HEIGHT +
    elevatorInst.getCurrentFloor * 7 +
    "px";   
  elevatorImg.style.marginBottom = newPosition;
   
  // startTimer(elevatorInst.getCurrentFloor - elevatorInst.getLastFloor,newPosition); 
  elevatorImg.style.setProperty(
    "--transition-duration",
    Math.abs(elevatorInst.getCurrentFloor - elevatorInst.getLastFloor) *
      0.5 +
      "s"
  );

  // Call releaseElevator asynchronously without waiting for it to finish
  master
    .releaseElevator(buildingIndex,elevatorId)
    .then(() => {
      console.log("Elevator released after 2 seconds");
    })
    .catch((error) => {
      console.error("Error in releasing elevator:", error);
    });
}

function handleBackgroundClick(building,metalId, elevatorId) {
  console.log("🚀 ~ handleBackgroundClick ~ metalId:", metalId)
  const metal = document.getElementById(metalId);
  metal.classList.remove("linear");
  metal.classList.add("linearGreenBackground");
  const elevatorInst = building.getElevatorById(elevatorId);
  const numberOfFloorsMoved = Math.abs(
    elevatorInst.getCurrentFloor - elevatorInst.getLastFloor
  );

  setTimeout(function () {
    const audio = new Audio("ding.mp3");
    audio.play();
    metal.classList.remove("linearGreenBackground");
    metal.classList.add("linear");
  }, numberOfFloorsMoved * 500);
}

function isElevatorArrived(elevatorId, destinationFloor) {
  const elevatorInst = building.getElevatorById(elevatorId);
  const elevatorCurrentPosition =
    (elevatorInst.getCurrentFloor - 1) * setting.HEIGHT +
    elevatorInst.getCurrentFloor * 7; // Current position of the elevator

  const destinationFloorPosition =
    (destinationFloor - 1) * setting.HEIGHT; // Position of the destination floor

  // Check if the absolute difference between the current position and destination position is less than a threshold (e.g., 5 pixels)
  const threshold = 8;
  console.log(
    elevatorCurrentPosition,
    destinationFloorPosition,
    elevatorId,
    destinationFloor
  );
  const isArrived =
    Math.abs(elevatorCurrentPosition - destinationFloorPosition) <
    threshold;

  return isArrived;
}

function startTimer(durationInSeconds, counterObj) {

      let secondsLeft = (Math.ceil(Math.abs(durationInSeconds) * 0.5) * 6);

      let timerInterval = setInterval(() => {
          secondsLeft--;
          counterObj.textContent = secondsLeft; 
          if (secondsLeft <= 0) {
              clearInterval(timerInterval);
              counterObj.innerText = " ";
          }
      }, 100); 

      
  }

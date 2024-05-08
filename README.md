# Elevator Task
This project implements an elevator simulation in TypeScript. It consists of multiple classes to model elevators, buildings, and a master controller for managing the elevators across multiple buildings.

## Usage
***Installation***: Clone the repository to your local machine.\
***Compile TypeScript***: Run the TypeScript compiler to convert elevator.ts to JavaScript.

```bash
tsc elevator.ts
tsc functions.ts
tsc interfaces.ts
```

***Run the Simulation:*** Open the ***index.html*** file in your browser to run the elevator simulation.

## Files
***elevator.ts:*** Contains the TypeScript code for the elevator simulation.\
***index.html:*** HTML file to display the elevator simulation in the browser.\
***style.css:*** CSS file for styling the elevator simulation.\
***functions.ts:*** Contains the JavaScript code for additional functionality in the 
elevator simulation.\
***interfaces.ts:*** Contains the interface for the classes.\

## Classes
***Elevator:*** Represents an elevator with properties and methods for movement and handling requests.\
***Building:*** Models a building with multiple elevators and provides methods for elevator management.\
***BuildingMaster:*** Controls multiple buildings and provides methods for orchestrating elevator calls and releases.\
## Configuration
***config.ts:*** Contains configuration settings such as the number of elevators, buildings, and floors.
Dependencies\.

No external dependencies required.

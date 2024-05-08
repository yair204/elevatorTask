interface ElevatorInterface {
    id: number;
    currentFloor: number;
    direction: string;
    destinationQueue: number[];
    lastFloor: number | undefined;
    
    move(destinationFloor: number): void;
    addToQueue(floor: number): void;
    handleRequest(floor: number): void;
    getCurrentFloor: () => number; 
    getLastFloor: () => number; 
}

interface BuildingInterface {
    elevators: ElevatorInterface[];
    idsList: number[];

    numberOfElevators(): number;
    elevatorsIdsList(): number[];
    getElevatorById(elevatorId: number): ElevatorInterface | null;
    callElevator(floor: number): number;
    releaseElevator(elevatorId: number): Promise<void>;
}

interface BuildingMasterInterface {
    buildings: BuildingInterface[];
    numOfFloors: number;

    numberOfBuildings(): number;
    callElevator(buildingIndex: number, floor: number): number;
    releaseElevator(buildingIndex: number, elevatorId: number): Promise<void>;
}

interface Setting{
    HEIGHT: number,
    NUM_OF_BUILDINGS:number,
    NUM_OF_FLOORS: number,
    NUM_OF_ELEVATORS :number,
}

export {ElevatorInterface ,BuildingInterface,BuildingMasterInterface ,Setting}
var readLineSync = require("readline-sync");

let headers = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9 };

function shipFactory(lives) {
  //FACTORY FUNCTION SHIPS
  let shipLives = lives;
  let sunk = false;
  function getLives() {
    return shipLives;
  }
  function isSunk() {
    return sunk;
  }
  const hit = () => {
    if (shipLives - 1 === 0) {
      sunk = true;
      console.log("Hit. You have sunk a battleship.");
    } else {
      console.log("Hit.");
    }
    shipLives--;
  };

  return {
    //RETURN SHIP OBJECT
    getLives,
    isSunk,
    hit,
  };
}

function cellFactory() {
  //FACTORY FUNCTION FOR GRID CELLS
  let occupied = false;
  let shot = false;
  let cellShip = null;
  let cellSymbol = "-";

  function setShip(ship) {
    cellShip = ship;
    occupied = true;
  }

  function getShip() {
    return cellShip;
  }

  function isOccupied() {
    return occupied;
  }

  function shootCell() {
    shot = true;
    if (cellShip != null) {
      setSymbol("X");
    } else {
      setSymbol("O");
    }
  }

  function isShot() {
    return shot;
  }

  function getSymbol() {
    return cellSymbol;
  }

  function setSymbol(symbol) {
    cellSymbol = symbol;
  }

  return {
    //RETURN CELL OBJECT
    setShip,
    getShip,
    isOccupied,
    shootCell,
    isShot,
    getSymbol,
    setSymbol,
  };
}

function createGrid(size) {
  // CREATE A GRID WITH CELL OBJECT
  let grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = cellFactory();
    }
  }
  return grid;
}

function shoot(x, y, grid) {
  //SHOOT CELL
  let position = grid[y][x]; // X:HORIZONTAL AXIS, Y VERTICAL AXIS
  /* [
      Y: 0 [1,2,3,4],
      Y: 1 [1,2,3,4],
      Y: 2 [1,2,3,4]
     ]
    */
  if (position.isShot()) {
    console.log("You have already picked this location. Miss!");
  }
  if (position.isOccupied() && !position.isShot()) {
    // CELL IS OCCUPIED AND NOT SHOT
    position.getShip().hit();
    position.shootCell();
    position.setSymbol("X");
    return true;
  }
  position.shootCell();
  position.setSymbol("O");
  console.log("You have missed.");
  return false;
}

function randomPosition(size) {
  //AUX FUNCTION
  return Math.floor(Math.random() * size);
}

function canPlaceShip(x, y) {
  //TODO: check if coordiantes are within range;
}

function placeShips(shipCount, grid) {
  // ! DO NOT USE
  while (shipCount > 0) {
    let x = randomPosition(3);
    let y = randomPosition(3);
    if (!grid[y][x].isOccupied()) {
      grid[y][x].setShip(shipFactory(1));
      shipCount--;
    }
  }
}

function placeShip(ship, grid) {
  //TODO must test this function to check if is providing correct data
  let shipSize = ship.getLives();
  let canPlace = false;
  let availablePositions;
  while (!canPlace) {
    availablePositions = [];
    let startingYPosition = randomPosition(9);
    let startingXPosition = randomPosition(9);
    let position = grid[startingYPosition][startingXPosition];
    if (!position.isOccupied() && startingXPosition + shipSize - 1 <= 9) {
      availablePositions.push([startingYPosition, startingXPosition]);
      for (let i = 1; i <= shipSize - 1; i++) {
        let checkXPosition = startingXPosition + i;
        if (!grid[startingYPosition][checkXPosition].isOccupied()) {
          availablePositions.push([startingYPosition, checkXPosition]);
        } else {
          break;
        }
      }
    }
    if (availablePositions.length === shipSize) {
      // TODO might need to check
      for (i = 0; i < availablePositions.length; i++) {
        grid[availablePositions[i][1]][availablePositions[i][0]].setShip(ship);
      }
      canPlace = true;
    }
  }
  return canPlace;
}

function getUserInput() {
  let input = readLineSync.question("Enter a location to strike: ");
  let y = headers[input.slice(0, 1).toUpperCase()];
  let x = input.slice(1) - 1;
  return [x, y];
}

//MAIN LOGIC
function init() {
  let shipArray = [shipFactory(2), shipFactory(3), shipFactory(3), shipFactory(4), shipFactory(5)];
  let enemyShips = shipArray.length;
  const enemyGrid = createGrid(10);
  for (let ship of shipArray) {
    placeShip(ship, enemyGrid);
  }
  readLineSync.keyInPause("Press any key to continue.");
  while (enemyShips > 0) {
    let [x, y] = getUserInput();
    if (shoot(x, y, enemyGrid) && enemyGrid[y][x].getShip().isSunk()) {
      enemyShips--;
      console.log(`${enemyShips} ships remaining.`);
    }
  }
  if (readLineSync.keyInYN("You have destroyed all battleships. Would you like to play again?")) {
    init();
  }
}
init();

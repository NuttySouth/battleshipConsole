var readLineSync = require("readline-sync");

let headers = { A: 0, B: 1, C: 2 };

function shipFactory(lives) {
  //FACTORY FUNCTION SHIPS
  let shipLives = lives;
  let sunk = false;
  const getLives = () => shipLives;
  const isSunk = () => {
    return sunk;
  };
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
  let shipSymbol = "-";

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
      symbol = "X";
    } else {
      symbol = "O";
    }
  }

  function isShot() {
    return shot;
  }

  function getSymbol() {
    return shipSymbol;
  }

  function setSymbol(symbol) {
    shipSymbol = symbol;
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
  if (position.isShot()) {
    console.log("You have already picked this location. Miss!");
    return false;
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

function placeShips(shipCount, grid) {
  // ONLY TO BE USED IN PART ONE
  while (shipCount > 0) {
    let x = randomPosition(3);
    let y = randomPosition(3);
    if (!grid[y][x].isOccupied()) {
      grid[y][x].setShip(shipFactory(1));
      shipCount--;
    }
  }
}

//MAIN LOGIC
function init() {
  const enemyGrid = createGrid(3);
  let enemyShips = 2;
  placeShips(enemyShips, enemyGrid);
  readLineSync.keyInPause("Press any key to continue.");
  while (enemyShips > 0) {
    let input = readLineSync.question("Enter a location to strike: ");
    let y = headers[input.slice(0, 1).toUpperCase()];
    let x = input.slice(1) - 1;
    if (shoot(x, y, enemyGrid)) {
      enemyShips--;
      console.log(`${enemyShips} ships remaining.`);
    }
  }
  if (readLineSync.keyInYN("You have destroyed all battleships. Would you like to play again?")) {
    init();
  }
}

init();

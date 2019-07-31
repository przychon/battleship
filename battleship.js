var view = {
  displayMessageEnd: function(msg){
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    document.getElementById("modalTxt").innerHTML = msg;
    modal.style.display = "block";
    span.onclick = function() {
      modal.style.display = "none";
      window.location.reload();
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        window.location.reload();
      }
    }
  },
  displayMessage: function(msg){
    document.getElementById("messageArea").innerHTML = msg;
    setTimeout(function(){ document.getElementById("messageArea").innerHTML = ''}, 1000);
  },
  displayHit: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
    cell.onclick=function() {
      return false;
    }
  },
  displayMiss: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [{ locations: ["0", "0", "0"], hits: [0, 0, 0]},
          { locations: ["0", "0", "0"], hits: [0, 0, 0]},
          { locations: ["0", "0", "0"], hits: [0, 0 , 0] }],
  fire: function(guess){
    for(var i = 0; i < this.numShips; i++){
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if(index >= 0){
        ship.hits[index] = 1;
        view.displayHit(guess);
        //view.displayMessage("Trafiony!");
        if(this.isSunk(ship)){
          view.displayMessage("Zatopiony!!!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    //view.displayMessage("Pudło...")
    return false;
  },
  isSunk: function(ship){
    for(var i = 0; i < this.shipLength; i++){
      if(ship.hits[i] !== 1){
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function(){
    var locations;
    for(var i = 0; i < this.numShips; i++){
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function(){
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if(direction === 1){
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    }else{
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for(var i = 0; i < this.shipLength; i++){
      if(direction === 1){
        newShipLocations.push(row + "" + (col + i));
      }else{
        newShipLocations.push((row + i)+ "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function(locations){
    for(var i = 0; i < this.numShips; i++){
      var ship = model.ships[i];
      for(var j = 0; j < locations.length; j++){
        if(ship.locations.indexOf(locations[j]) >= 0){
          return true;
        }
      }
    }
    return false;
  }
};

var controller = {
  guesses: 0,

  processGuess: function(guess){
    var location = parseGuess(guess);

    if(location){
      this.guesses++;
      var hit = model.fire(location);
      if(hit && model.shipsSunk === model.numShips){
      view.displayMessageEnd("Zatopiłeś wszystkie moje okręty w " + this.guesses + " próbach");
      }
    }
  }
}

function parseGuess(guess){

  if(guess === null || guess.length !== 2){
    alert("Podaj poprawne współrzędne");
  }else{
    var row = guess.charAt(0);
    var column = guess.charAt(1);

    if(isNaN(row) || isNaN(column)){
      alert("To nie są współrzędne");
    }else{
      return row + column;
    }
  }
  return null;
};

function init(){

  model.generateShipLocations();

  var trs = document.getElementsByTagName("tr");
  var tds = null;
  for (var i=0; i<trs.length; i++){
    tds = trs[i].getElementsByTagName("td");
    for (var n=0; n<trs.length;n++){
      tds[n].onclick=function() {
        controller.processGuess(this.id);
      }
    }
  }
}

window.onload = init;

$().ready(() => {
  let stars = [];
  let playerAtStar = true;

  createStars(100);

  let player = new Player();
  player.create();
  player.render(stars[0]);

  updateInfoPanel();
  updateActionPanel();

  function createStars(numOfStars) {
    let randomizedStarNames = _.shuffle(starnames);

    for (var i = 0; i < numOfStars; i++) {
      let star = new Star(randomizedStarNames.pop(), i);
      star.create();
      star.render(randomStarPosition());

      stars.push(star);
    }
  }

  function randomStarPosition() {
    return {
      left: randomInt(30, $('.star-map').width() - 30),
      top: randomInt(10, $('.star-map').height() - 25)
    };
  }

  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateInfoPanel() {
    $('#currentFuel').text(player.currentFuel);
    $('#maxFuel').text(player.maxFuel);

    $('#currentShields').text(player.currentShields);
    $('#maxShields').text(player.maxShields);

    $('#currentMissiles').text(player.currentMissiles);
    $('#maxMissiles').text(player.maxMissiles);

    $('#currentHull').text(player.currentHull);
    $('#maxHull').text(player.maxHull);
  }

  function updateActionPanel() {
    $('#action').text(player.star.name);

    if(playerAtStar) {
      $('.action .atStar').show();

      $('#fuelCost').text(player.star.fuelCost);
      $('#repairCost').text(player.star.repairCost);
      $('#missilesCost').text(player.star.missilesCost);
    }
  }
});

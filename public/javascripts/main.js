$().ready(() => {
  let stars = [];
  let playerAtStar = true;

  createStars(50);

  let player = new Player();
  player.create();
  player.render(stars[0]);

  updateInfoPanel();
  updateActionPanel();

  $('#purchaseFuel').on('click', function() {
    if(player.money >= player.star.fuelCost && player.currentFuel < player.maxFuel) {
      player.money -= player.star.fuelCost;
      player.currentFuel++;
      updateInfoPanel();
    }
  });

  $('#purchaseMissiles').on('click', function() {
    if(player.money >= player.star.missilesCost && player.currentMissiles < player.maxMissiles) {
      player.money -= player.star.missilesCost;
      player.currentMissiles++;
      updateInfoPanel();
    }
  });

  $('#repairShip').on('click', function() {
    if(player.money >= player.star.repairCost && player.currentHull < player.maxHull) {
      player.money -= player.star.repairCost;
      player.currentHull++;
      updateInfoPanel();
    }
  });

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

  function updateInfoPanel() {
    $('#currentFuel').text(player.currentFuel);
    $('#maxFuel').text(player.maxFuel);

    $('#currentShields').text(player.currentShields);
    $('#maxShields').text(player.maxShields);

    $('#currentMissiles').text(player.currentMissiles);
    $('#maxMissiles').text(player.maxMissiles);

    $('#currentHull').text(player.currentHull);
    $('#maxHull').text(player.maxHull);

    $('#money').text(player.money)
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

$().ready(() => {
  let stars = [];
  let currentEnemy;
  let currentDestination;

  createStars(10);
  addUniqueItemsToStars();
  addEnemiesToStars();

  let player = new Player();
  player.create();

  updateInfoPanel();

  travelTo(stars[0]);

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

    if(!currentEnemy) {
      $('.fight').hide();
      $('.at-star').show();

      $('#fuelCost').text(player.star.fuelCost);
      $('#repairCost').text(player.star.repairCost);
      $('#missilesCost').text(player.star.missilesCost);
    }
    else {
      $('.at-star').hide();
      $('.fight').show();

      $('#action').text(currentEnemy.name);

      $('#enemy-ship').addClass('normalEnemy');

      $('#enemy-shields').text(currentEnemy.shields);
      $('#enemy-hull').text(currentEnemy.hull);
    }
  }

  function addUniqueItemsToStars() {
    let uniqueIndexes = [];

    while(uniqueIndexes.length < 4) {
      let potentialIndex = randomInt(0, stars.length - 1);

      if(uniqueIndexes.indexOf(potentialIndex) === -1) uniqueIndexes.push(potentialIndex);
    }

    uniqueIndexes.forEach((starIndex, treasureIndex) => {
      stars[starIndex].uniqueItem = uniqueItems[treasureIndex];
    });
  }

  function addEnemiesToStars() {
    stars.forEach((star) => {
      star.normalEnemy = new Enemy('normal');
    });
  }

  function travelTo(star) {
    currentDestination = star;

    player.render(star);

    rechargePlayerShields(1);

    if(player.star.normalEnemy) {
      currentEnemy = player.star.normalEnemy;
      updateActionPanel();
      enableAttackButtons();
    }
    else {
      currentEnemy = null;
      updateActionPanel();
    }
  }

  function disableAttackButtons() {
    $('.attack-btn').off();
  }

  function enableAttackButtons() {
    $('#fire-lasers').on('click', function() {
      disableAttackButtons();

      if(currentEnemy.shields > 0) {
        currentEnemy.shields -= player.laserDamage;
      }
      else {
        currentEnemy.hull -= player.laserDamage;
      }

      if(currentEnemy.hull <= 0) {
        player.star.normalEnemy = null;
        travelTo(currentDestination);
      }
      else {
        enemyTurn();
      }

      updateActionPanel();
    });

    if(player.currentMissiles > 0){
      $('#fire-missile').on('click', function() {
        disableAttackButtons();

        player.currentMissiles--;

        if(currentEnemy.shields > 0) {
          currentEnemy.shields -= player.missileDamage;
        }
        else {
          currentEnemy.hull -= player.missileDamage;
        }

        if(currentEnemy.hull <= 0) {
          player.star.normalEnemy = null;
          travelTo(currentDestination);
        }
        else {
          enemyTurn();
        }

        updateActionPanel();
      });
    }
  }

  function enemyTurn() {
    if(currentEnemy.missiles > 0 && randomInt(0, 100) > 20) {
      if(player.currentShields > 0) {
        player.currentShields -= currentEnemy.missileDamage;
        if(player.currentShields < 0) player.currentShields = 0;
      }
      else {
        player.currentHull -= currentEnemy.missileDamage;
      }
    }
    else {
      if(player.currentShields > 0) {
        player.currentShields -= currentEnemy.laserDamage;
        if(player.currentShields < 0) player.currentShields = 0;
      }
      else {
        player.currentHull -= currentEnemy.laserDamage;
      }
    }

    if(player.currentHull <= 0) {
      window.location.href = '/gameover';
    }

    updateInfoPanel();
    enableAttackButtons();
  }

  function rechargePlayerShields(amount) {
    player.currentShields += amount;

    if(player.currentShields > player.maxShields) player.currentShields = player.maxShields;

    updateInfoPanel();
  }
});

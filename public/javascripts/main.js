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

  enableTravelToStars();

  $('#purchaseFuel').on('click', function() {
    if(player.money >= player.star.fuelCost && player.currentFuel < player.maxFuel) {
      player.money -= player.star.fuelCost;
      player.currentFuel++;

      actionMessage(`1 fuel purchased for ${player.star.fuelCost}`, player);
      updateInfoPanel();
    }
  });

  $('#purchaseMissiles').on('click', function() {
    if(player.money >= player.star.missilesCost && player.currentMissiles < player.maxMissiles) {
      player.money -= player.star.missilesCost;
      player.currentMissiles++;

      actionMessage(`1 missile purchased for ${player.star.missilesCost}`, player);
      updateInfoPanel();
    }
  });

  $('#repairShip').on('click', function() {
    if(player.money >= player.star.repairCost && player.currentHull < player.maxHull) {
      player.money -= player.star.repairCost;
      player.currentHull++;

      actionMessage(`Ships hull repaired for ${player.star.missilesCost}`, player);
      updateInfoPanel();
    }
  });

  $('#searchPlanet').on('click', function() {
    if(player.star.treasure) {
      rechargePlayerShields(1);

      player.treasures.push(player.star.treasure);

      if(player.star.treasure === 'fuel tank') {
        player.maxFuel += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Fuel tanks increased by ${player.star.treasureAmount}`, 'player');
      }
      if(player.star.treasure === 'shield booster') {
        player.maxShields += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Shield capacity increased by ${player.star.treasureAmount}`, 'player');
      }
      if(player.star.treasure === 'missile rack') {
        player.maxMissiles += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Maximum number of missiles increased by ${player.star.treasureAmount}`, 'player');
      }
      if(player.star.treasure === 'hull reinforcer') {
        player.maxHull += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Hull strength increased by ${player.star.treasureAmount}`, 'player');
      }
      if(player.star.treasure === 'money') {
        player.money += player.star.treasureAmount;
        actionMessage(`You found some ${player.star.treasure} in the ruins of the planet! Bank account increased by ${player.star.treasureAmount}`, 'player');
      }

      player.star.markExplored('treasure');

      updateInfoPanel();
    }
    else {
      popupMessage('Searching planet', 'Nothing to find here');
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

    player.currentFuel--;

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
    updateInfoPanel();
  }

  function disableAttackButtons() {
    $('.attack-btn').off();
  }

  function enableAttackButtons() {
    disableAttackButtons();
    
    $('#fire-lasers').on('click', function() {
      disableAttackButtons();

      if(currentEnemy.shields > 0) {
        currentEnemy.shields -= player.laserDamage;

        actionMessage(`You attacked the ${currentEnemy.name} with your laser for ${player.laserDamage} shield damage`, 'player');
      }
      else {
        currentEnemy.hull -= player.laserDamage;
        actionMessage(`You attacked the ${currentEnemy.name} with your laser for ${player.laserDamage} hull damage`, 'player');
      }

      if(currentEnemy.hull <= 0) {
        player.star.normalEnemy = null;
        popupMessage(`${currentEnemy.name} fight`, `You destroyed the ${currentEnemy.name} with your laser!`);
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
          actionMessage(`You attacked the ${currentEnemy.name} with your missile for ${player.missileDamage} shield damage`, 'player');
        }
        else {
          currentEnemy.hull -= player.missileDamage;
          actionMessage(`You attacked the ${currentEnemy.name} with your missile for ${player.missileDamage} hull damage`, 'player');
        }

        if(currentEnemy.hull <= 0) {
          player.star.normalEnemy = null;
          popupMessage(`${currentEnemy.name} fight`, `You destroyed the ${currentEnemy.name} with your missile!`);
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
        actionMessage(`The ${currentEnemy.name} attacked you with their missile for ${currentEnemy.missileDamage} shield damage`, 'enemy-color');
        if(player.currentShields < 0) player.currentShields = 0;
      }
      else {
        player.currentHull -= currentEnemy.missileDamage;
        actionMessage(`The ${currentEnemy.name} attacked you with their missile for ${currentEnemy.missileDamage} hull damage`, 'enemy-color');
      }
    }
    else {
      if(player.currentShields > 0) {
        player.currentShields -= currentEnemy.laserDamage;
        actionMessage(`The ${currentEnemy.name} attacked you with their laser for ${currentEnemy.missileDamage} shield damage`, 'enemy-color');
        if(player.currentShields < 0) player.currentShields = 0;
      }
      else {
        player.currentHull -= currentEnemy.laserDamage;
        actionMessage(`The ${currentEnemy.name} attacked you with their laser for ${currentEnemy.missileDamage} hull damage`, 'enemy-color');
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

  function popupMessage(title, message) {
    let $popup = $('<div>');
    let $title = $('<h3>');
    let $message = $('<p>');
    $title.text(title);
    $message.text(message);

    $popup.append($title);
    $popup.append($message);

    $popup.avgrund({
      width: 200,
      height: 125,
      template: $popup,
      showClose: true,
      showCloseText: 'close'
    });

    $popup.click();
  }

  function actionMessage(message, who) {
    let $el = $('<h4>');
    $el.addClass(who);
    $el.hide();

    $el.text(message);

    $('.action-messages').append($el);
    $el.fadeIn(50, () => $el.fadeOut(5000, () => $el.remove()));
  }

  function enableTravelToStars() {
    stars.forEach((star) => {
      star.$system.on('click', function() {
        travelTo(stars[$(this).data('id')]);
      });
    });
  }
});

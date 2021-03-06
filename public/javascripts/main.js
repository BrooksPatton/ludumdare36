$().ready(() => {
  let stars = [];
  let currentEnemy;
  let currentDestination;

  createStars(50);
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
        animateShipUpgrade('fuel');
      }
      if(player.star.treasure === 'shield booster') {
        player.maxShields += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Shield capacity increased by ${player.star.treasureAmount}`, 'player');
        animateShipUpgrade('shields');
      }
      if(player.star.treasure === 'missile rack') {
        player.maxMissiles += player.star.treasureAmount;
        player.missileMaxDamage += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Maximum number of missiles and damage increased by ${player.star.treasureAmount}`, 'player');
        animateShipUpgrade('missiles');
      }
      if(player.star.treasure === 'hull reinforcer') {
        player.maxHull += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Hull strength increased by ${player.star.treasureAmount}`, 'player');
        animateShipUpgrade('hull');
      }
      if(player.star.treasure === 'money') {
        player.money += player.star.treasureAmount;
        actionMessage(`You found some ${player.star.treasure} in the ruins of the planet! Bank account increased by ${player.star.treasureAmount}`, 'player');
        animateShipUpgrade('money');
      }
      if(player.star.treasure === 'laser battery pack') {
        player.laserMaxDamage += player.star.treasureAmount;
        actionMessage(`You found a ${player.star.treasure} in the ruins of the planet! Laser max damages increased by ${player.star.treasureAmount}`, 'player');
      }

      player.star.markExplored('treasure');

      updateInfoPanel();
    }
    else if(player.star.uniqueItem) {
      if(player.star.uniqueItem === 'Ancient Artifact') {
        player.treasures.push(player.star.uniqueItem);

        return popupMessage('Ancient artifact', 'You found the ancient artifact! You win the game!!!');
      }

      player.treasureMaps.push(player.star.uniqueItem)
      popupMessage('Unique item found', 'You found a fragment of a treasure map! Gather them all to find the ancient artifact');

      player.star.markExplored('uniqueItem');

      if(player.treasureMaps.length === 4) {
        revealStarWithArtifact();
      }

      updateInfoPanel();
    }
    else {
      popupMessage('Searching planet', 'Nothing to find here');
    }
  });

  function createStars(numOfStars) {
    let randomizedStarNames = _.shuffle(starnames);

    for (var i = 0; i < numOfStars; i++) {
      let star = new Star(randomizedStarNames.pop());
      star.create(stars);
      star.render(randomStarPosition(), stars);
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
    if(player.currentFuel / player.maxFuel > .5) {
      setColorToGood('#currentFuel');
    }
    else if(player.currentFuel / player.maxFuel <= .5 && player.currentFuel / player.maxFuel > .2) {
      setColorToOkay('#currentFuel');
    }
    else {
      setColorToBad('#currentFuel');
    }

    $('#currentShields').text(player.currentShields);
    $('#maxShields').text(player.maxShields);
    if(player.currentShields / player.maxShields > .5) {
      setColorToGood('#currentShields');
    }
    else if(player.currentShields / player.maxShields <= .5 && player.currentShields / player.maxShields > .2) {
      setColorToOkay('#currentShields');
    }
    else {
      setColorToBad('#currentShields');
    }

    $('#currentMissiles').text(player.currentMissiles);
    $('#maxMissiles').text(player.maxMissiles);
    if(player.currentMissiles / player.maxMissiles > .5) {
      setColorToGood('#currentMissiles');
    }
    else if(player.currentMissiles / player.maxMissiles <= .5 && player.currentMissiles / player.maxMissiles > .2) {
      setColorToOkay('#currentMissiles');
    }
    else {
      setColorToBad('#currentMissiles');
    }

    $('#currentHull').text(player.currentHull);
    $('#maxHull').text(player.maxHull);
    if(player.currentHull / player.maxHull > .5) {
      setColorToGood('#currentHull');
    }
    else if(player.currentHull / player.maxHull <= .5 && player.currentHull / player.maxHull >= .2) {
      setColorToOkay('#currentHull');
    }
    else {
      setColorToBad('#currentHull');
    }

    $('#money').text(player.money)

    let mapFragments = $('#map-fragments');

    if(player.treasureMaps.length === 1 && mapFragments.length === 0) {
      let $row = $('<tr><td class="label">Map fragments</td><td><span id="map-fragments">1</span>/<span id="total-map-fragments">??</span></td></tr>');

      $('.info table').append($row);
    }
    else if(mapFragments.length < player.treasureMaps.length) {
      $('#map-fragments').text(player.treasureMaps.length);

      if(player.treasureMaps.length === 4) $('#total-map-fragments').text(4);
    }

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

      if(currentEnemy.type === 'normal') $('#enemy-ship').addClass('normalEnemy');
      if(currentEnemy.type === 'boss') $('#enemy-ship').addClass('bossEnemy');

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

      if(star.uniqueItem) star.bossEnemy = new Enemy('boss');
    });
  }

  function travelTo(star) {
    if(player.currentFuel === 0) {
      popupMessage('Game over', `Unfortunately you have run out of fuel.`);
    }
    currentDestination = star;

    player.currentFuel--;

    player.render(star);

    rechargePlayerShields(1);

    if(player.star.normalEnemy) {
      currentEnemy = player.star.normalEnemy;
      updateActionPanel();
      enableAttackButtons();
    }
    else if (player.star.bossEnemy) {
      currentEnemy = player.star.bossEnemy;
      updateActionPanel();
      enableAttackButtons();
    }
    else if (player.star.superBoss) {
      currentEnemy = player.star.superBoss;
      updateActionPanel();
      enableAttackButtons();
      popupMessage('Super boss battle', 'This is it, you have found the planet with the artifact but the pirate Admiral is already here! You don\'t have any time left, destroy him now!');
      disableTravel();
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
      let currentDamage = player.laserDamage();

      if(currentEnemy.shields > 0) {
        currentEnemy.shields -= currentDamage;

        actionMessage(`You attacked the ${currentEnemy.name} with your laser for ${currentDamage} shield damage`, 'player');
      }
      else {
        currentEnemy.hull -= currentDamage;
        actionMessage(`You attacked the ${currentEnemy.name} with your laser for ${currentDamage} hull damage`, 'player');
      }

      if(currentEnemy.hull <= 0) {
        if(currentEnemy.type === 'normal') {
          player.star.normalEnemy = null;
        }
        else if(currentEnemy.type === 'boss') {
          player.star.bossEnemy = null;
        }
        else if(currentEnemy.type === 'super boss') {
          player.star.superBoss = null;
        }

        actionMessage(`You destroyed the ${currentEnemy.name} with your laser!`);
        getRewardforDestroying();
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
        let currentDamage = player.missileDamage();

        player.currentMissiles--;

        if(currentEnemy.shields > 0) {
          currentEnemy.shields -= currentDamage;
          actionMessage(`You attacked the ${currentEnemy.name} with your missile for ${currentDamage} shield damage`, 'player');
        }
        else {
          currentEnemy.hull -= currentDamage;
          actionMessage(`You attacked the ${currentEnemy.name} with your missile for ${currentDamage} hull damage`, 'player');
        }

        if(currentEnemy.hull <= 0) {
          if(currentEnemy.type === 'normal') {
            player.star.normalEnemy = null;
          }
          else if(currentEnemy.type === 'boss') {
            player.star.bossEnemy = null;
          }
          else if(currentEnemy.type === 'super boss') {
            player.star.superBoss = null;
          }

          actionMessage(`You destroyed the ${currentEnemy.name} with your missile!`);
          getRewardforDestroying();
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
      let currentDamage = currentEnemy.missileDamage();

      if(player.currentShields > 0) {
        player.currentShields -= currentDamage;
        actionMessage(`The ${currentEnemy.name} attacked you with their missile for ${currentDamage} shield damage`, 'enemy-color');
        if(player.currentShields < 0) player.currentShields = 0;
      }
      else {
        player.currentHull -= currentDamage;
        actionMessage(`The ${currentEnemy.name} attacked you with their missile for ${currentDamage} hull damage`, 'enemy-color');
      }
    }
    else {
      let currentDamage = currentEnemy.laserDamage();

      if(player.currentShields > 0) {
        player.currentShields -= currentDamage;
        actionMessage(`The ${currentEnemy.name} attacked you with their laser for ${currentDamage} shield damage`, 'enemy-color');
        if(player.currentShields < 0) player.currentShields = 0;
      }
      else {
        player.currentHull -= currentDamage;
        actionMessage(`The ${currentEnemy.name} attacked you with their laser for ${currentDamage} hull damage`, 'enemy-color');
      }
    }

    if(player.currentHull <= 0) {
      popupMessage('Game over', 'Your ship has exploded');
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
    $message.html(message);

    $popup.append($title);
    $popup.append($message);

    let options = {
      width: 200,
      height: 175,
      template: $popup,
      showClose: true,
      showCloseText: 'close'
    };

    if(title === 'Game over') {
      let playerData = JSON.stringify(player);
      options.onUnload = () => window.location.href = `/gameover?status=loss&playerData=${playerData}`;
    }

    if(title === 'Ancient artifact') {
      let playerData = JSON.stringify(player);
      options.onUnload = () => window.location.href = `/gameover?status=win&playerData=${playerData}`;
    }

    $popup.avgrund(options);

    $popup.click();
  }

  function actionMessage(message, who) {
    let $el = $('<h4>');
    $el.addClass(who);
    $el.hide();

    $el.text(message);

    $('.action-messages').prepend($el);
    $el.fadeIn(1000, () => $el.fadeOut(20000, () => $el.remove()));
  }

  function enableTravelToStars() {
    stars.forEach((star) => {
      star.$system.on('click', function() {
        travelTo(stars[$(this).data('id')]);
      });
    });
  }

  function getRewardforDestroying() {
    player.currentShields = player.maxShields;

    let rewards = [
      'fuel',
      'missiles',
      'money',
      'item'
    ]

    let rewardType = rewards[randomInt(0, rewards.length - 1)];

    if(rewardType === 'item') {
      popupMessage(`${currentEnemy.name} destroyed`, `Searching through the rubble you discover a working item. You hastily bring the ${currentEnemy.item} to your ship.`);
      actionMessage(`${currentEnemy.item} increased by ${currentEnemy.itemAmount}`);

      if(currentEnemy.item === 'fuel tank') {
        player.maxFuel += currentEnemy.itemAmount;
        animateShipUpgrade('fuel');
      }
      if(currentEnemy.item === 'shield booster') {
        player.maxShields += currentEnemy.itemAmount;
        animateShipUpgrade('shields');
      }
      if(currentEnemy.item === 'missile rack') {
        player.maxMissiles += currentEnemy.itemAmount;
        animateShipUpgrade('missiles');
        player.missileMaxDamage += currentEnemy.itemAmount;
      }
      if(currentEnemy.item === 'hull reinforcer') {
        player.maxHull += currentEnemy.itemAmount;
        animateShipUpgrade('hull');
      }
      if(currentEnemy.item === 'laser battery pack') {
        player.laserMaxDamage += currentEnemy.itemAmount;
      }
      if(currentEnemy.item === 'money') {
        player.money += currentEnemy.itemAmount;
        animateShipUpgrade('money');
      }
    }
    else {
      popupMessage(`${currentEnemy.name} destroyed`, `Searching through the rubble you find ${currentEnemy[rewardType]} ${rewardType}`);

      if(rewardType === 'fuel') {
        player.currentFuel += currentEnemy[rewardType];
        if(player.currentFuel > player.maxFuel) player.currentFuel = player.maxFuel;
      }
      if(rewardType === 'missiles') {
        player.currentMissiles += currentEnemy[rewardType];
        if(player.currentMissiles > player.maxMissiles) player.currentMissiles = player.maxMissiles;
      }
      if(rewardType === 'money') {
        player.money += currentEnemy[rewardType];
      }
    }


    updateInfoPanel();
  }

  function revealStarWithArtifact() {
    let star = stars[randomInt(0, stars.length - 1)];

    star.uniqueItem = 'Ancient Artifact';

    star.markHasArtifact(new Enemy('super boss'));
  }

  function disableTravel() {
    $('.star-system').off();
  }

  function setColorToGood(id) {
    $(id).removeClass('danger').removeClass('warning');
  }

  function setColorToOkay(id) {
    $(id).removeClass('danger').addClass('warning');
  }

  function setColorToBad(id) {
    $(id).addClass('danger').removeClass('warning');
  }

  function animateShipUpgrade(upgrade) {
    if(upgrade === 'fuel') {
      $('#maxFuel').addClass('upgraded').animate({color: '#fff'}, 10000, () => $('#maxFuel').removeClass('upgraded'));
    }
    else if(upgrade === 'shields') {
      $('#maxShields').addClass('upgraded').animate({color: '#fff'}, 10000, () => $('#maxShields').removeClass('upgraded'));
    }
    else if(upgrade === 'missiles') {
      $('#maxMissiles').addClass('upgraded').animate({color: '#fff'}, 10000, () => $('#maxMissiles').removeClass('upgraded'));
    }
    else if(upgrade === 'hull') {
      $('#maxHull').addClass('upgraded').animate({color: '#fff'}, 10000, () => $('#maxHull').removeClass('upgraded'));
    }
    else if(upgrade === 'money') {
      $('#money').addClass('upgraded').animate({color: '#fff'}, 10000, () => $('#money').removeClass('upgraded'));
    }
  }
});

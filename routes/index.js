'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/game', function(req, res, next) {
  res.render('game');
});

router.get('/gameover', function(req, res, next) {
  let gameStatus = req.query.status;
  let playerData = JSON.parse(req.query.playerData);

  console.log(playerData);

  res.render('endgame', {
    gameStatus,
    currentFuel: playerData.currentFuel,
    currentHull: playerData.currentHull,
    maxHull: playerData.maxHull,
    maxFuel: playerData.maxFuel,
    maxShields: playerData.maxShields,
    currentShields: playerData.currentShields,
    currentMissiles: playerData.currentMissiles,
    maxMissiles: playerData.maxMissiles,
    money: playerData.money,
    laserMaxDamage: playerData.laserMaxDamage,
    missileMaxDamage: playerData.missileMaxDamage,
    treasureMaps: playerData.treasureMaps,
    treasures: playerData.treasures,
  });
});

module.exports = router;

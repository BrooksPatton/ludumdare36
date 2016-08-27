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
  res.render('endgame');
});

module.exports = router;

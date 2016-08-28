class Player {
  constructor() {
    this.imageUrl = '/images/player.png';

    this.maxFuel = baseMaxFuel;
    this.currentFuel = this.maxFuel;

    this.currentShields = 10;
    this.maxShields = 10;

    this.maxMissiles = baseMaxMissiles;
    this.currentMissiles = this.maxMissiles;

    this.maxHull = baseMaxHull;
    this.currentHull = this.maxHull;

    this.money = startingMoney;

    this.laserDamage = 1;
    this.missileDamage = 5;

    this.treasures = [];

    this.treasureMaps = [];
  }

  create() {
    this.$ship = $('<div>');
    this.$ship.addClass('player');
  }

  render(star) {
    this.star = star;
    let starMap = $('.star-map');

    this.$ship.css({
      left: star.position.left - 7,
      top: star.position.top - 10
    });

    starMap.append(this.$ship);

  }
}

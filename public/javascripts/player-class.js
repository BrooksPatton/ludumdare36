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

    this.laserMinDamage = 0;
    this.laserMaxDamage = 5;
    this.missileMinDamage = 5;
    this.missileMaxDamage = 10;

    this.laserDamage = () => randomInt(this.laserMinDamage, this.laserMaxDamage);
    this.missileDamage = () => randomInt(this.missileMinDamage, this.missileMaxDamage);;

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

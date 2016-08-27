class Player {
  constructor() {
    this.imageUrl = '/images/player.png';

    this.currentFuel = 10;
    this.maxFuel = 10;

    this.currentShields = 10;
    this.maxShields = 10;

    this.currentMissiles = 1;
    this.maxMissiles = 1;

    this.currentHull = 1;
    this.maxHull = 1;
  }

  create() {
    this.$ship = $('<div>');
    this.$ship.addClass('player');
  }

  render($star) {
    let starMap = $('.star-map');

    this.$ship.css({
      left: $star.position.left - 7,
      top: $star.position.top - 10
    });

    starMap.append(this.$ship);

  }
}

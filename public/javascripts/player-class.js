class Player {
  constructor() {
    this.imageUrl = '/images/player.png';
    this.fuel = 10;
    this.shields = 10;
    this.missiles = 1;
    this.hull = 1;
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

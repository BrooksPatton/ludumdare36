class Player {
  constructor() {
    this.imageUrl = '/images/player.png';
  }

  create() {
    this.$ship = $('<div>');
    this.$ship.addClass('player');
  }

  render($star) {
    let starMap = $('.star-map');
    console.log($star.position);

    this.$ship.css({
      left: $star.position.left - 7,
      top: $star.position.top - 10
    });

    starMap.append(this.$ship);

  }
}

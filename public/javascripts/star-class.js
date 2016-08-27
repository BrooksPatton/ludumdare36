class Star {
  constructor() {

  }

  create() {
    this.$star = $('<div>');
    this.$star.addClass('star');
  }

  render(position) {
    this.position = position;

    this.$star.css({
      left: position.left,
      top: position.top
    });

    if(!this._isColliding()) $('.star-map').append(this.$star);
  }

  _isColliding() {
    let $stars = $('.star');
    let collision = false;

    $stars.each((i, star) => {
      let position = $(star).position();

      if (
        this.position.left < position.left + 20 &&
        this.position.left + 20 > position.left &&
        this.position.top < position.top + 20 &&
        20 + this.position.top > position.top
      ) {
        collision = true;
      }
    });

    return collision;
  }
}

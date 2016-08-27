class Star {
  constructor() {

  }

  create() {
    this.$star = $('<div>');
    this.$star.addClass('star');
  }

  render(position) {
    this.$star.css({
      left: position.left,
      top: position.top
    });

    $('.star-map').append(this.$star);
  }
}

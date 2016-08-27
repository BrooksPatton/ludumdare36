$().ready(() => {
  createStars(300);

  function createStars(numOfStars) {
    for (var i = 0; i < numOfStars; i++) {
      let star = new Star();
      star.create();
      star.render(randomStarPosition());
    }
  }

  function randomStarPosition() {
    return {
      left: randomInt(10, $('.star-map').width() - 10),
      top: randomInt(10, $('.star-map').height() - 10)
    };
  }

  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});

class Star {
  constructor(name, id) {
    this.name = name;
    this.id = id;

    this.fuelCost = baseFuelCost;
    this.repairCost = baseRepairCost;
    this.missilesCost = baseMissilesCost;

    let treasureIndex = randomInt(0, normalItems.length - 1);
    this.treasure = normalItems[treasureIndex].item;
    this.treasureAmount = randomInt(normalItems[treasureIndex].minAmount, normalItems[treasureIndex].maxAmount);
  }

  create() {
    this.$star = $('<div>');
    this.$system = $('<div>');
    this.$name = $('<div>');
    this.$star.addClass('star');
    this.$system.addClass('star-system');
    this.$name.addClass('star-name');
    this.$name.css('marginLeft', -(this.name.length * 4));
    this.$system.attr('data-id', this.id);

    this.$name.text(this.name);

    this.$system.append(this.$star);
    this.$system.append(this.$name);
  }

  render(position) {
    this.position = position;

    this.$system.css({
      left: position.left,
      top: position.top
    });

    if(!this._isColliding()) $('.star-map').append(this.$system);
  }

  _isColliding() {
    let $stars = $('.star-system');
    let collision = false;

    $stars.each((i, star) => {
      let position = $(star).position();

      if (
        this.position.left < position.left + 70 &&
        this.position.left + 70 > position.left &&
        this.position.top < position.top + 70 &&
        70 + this.position.top > position.top
      ) {
        collision = true;
      }
    });

    return collision;
  }
}

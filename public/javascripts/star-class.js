class Star {
  constructor(name) {
    this.name = name;

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
    this.$name.text(this.name);
    this.$system.append(this.$star);
    this.$system.append(this.$name);
  }

  render(position, allStars) {
    this.position = position;

    this.$system.css({
      left: position.left,
      top: position.top
    });

    this.isColliding = this._isColliding();
    if(!this.isColliding) {
      $('.star-map').append(this.$system);
      allStars.push(this);
      this.id = allStars.length - 1;
      this.$system.attr('data-id', this.id);
    }
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

  markExplored(treasureType) {
    this[treasureType] = null;

    if(!this.treasure && !this.uniqueItem) {
      this.$name.addClass('explored');
    }
  }

  markHasArtifact(superBoss) {
    this.$name.addClass('has-artifact-color');
    this.superBoss = superBoss;
  }
}

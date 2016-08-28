class Enemy {
  constructor(type) {
    this.type = type;

    if(type === 'normal') {
      this.fuel = randomInt(0, 3);
      this.shields = randomInt(1, 10);
      this.missiles = randomInt(0, 3);
      this.hull = randomInt(1, 3);
      this.money = randomInt(0, 500);
      this.name = 'Pirate';

      this.laserDamage = () => randomInt(1, 3);
      this.missileDamage = () => randomInt(1, 7);

      this.imageUrl = '/images/normal-pirate.png';

      let itemIndex = randomInt(0, normalItems.length - 1);
      this.item = normalItems[itemIndex].item;
      this.itemAmount = randomInt(normalItems[itemIndex].minAmount, normalItems[itemIndex].maxAmount) + 5;
    }
    else if(this.type === 'super boss'){
      this.fuel = randomInt(0, 20);
      this.shields = randomInt(20, 30);
      this.missiles = randomInt(5, 50);
      this.hull = randomInt(5, 25);
      this.money = randomInt(0, 5000);
      this.name = 'Pirate Admiral';

      this.laserDamage = () => randomInt(1, 15);
      this.missileDamage = () => randomInt(5, 20);

      let itemIndex = randomInt(0, normalItems.length - 1);
      this.item = normalItems[itemIndex].item;
      this.itemAmount = randomInt(normalItems[itemIndex].minAmount, normalItems[itemIndex].maxAmount) + 10;
    }
    else {
      this.fuel = randomInt(0, 20);
      this.shields = randomInt(10, 20);
      this.missiles = randomInt(2, 10);
      this.hull = randomInt(5, 20);
      this.money = randomInt(0, 5000);
      this.name = 'Pirate Boss';

      this.laserDamage = () => randomInt(3, 10)
      this.missileDamage = () => randomInt(5, 15)

      this.imageUrl = '/images/boss-pirate.png';

      let itemIndex = randomInt(0, normalItems.length - 1);
      this.item = normalItems[itemIndex].item;
      this.itemAmount = randomInt(normalItems[itemIndex].minAmount, normalItems[itemIndex].maxAmount) + 10;
    }
  }
}

class Enemy {
  constructor(type) {
    this.type = type;
    
    if(type === 'normal') {
      this.fuel = randomInt(0, 3);
      this.shields = 10;
      this.missiles = 1;
      this.hull = 1;
      this.money = randomInt(0, 500);
      this.name = 'Pirate';

      this.laserDamage = 1;
      this.missileDamage = 5;

      this.imageUrl = '/images/normal-pirate.png';

      let itemIndex = randomInt(0, normalItems.length - 1);
      this.item = normalItems[itemIndex].item;
      this.itemAmount = randomInt(normalItems[itemIndex].minAmount, normalItems[itemIndex].maxAmount) + 5;
    }
    else {
      this.fuel = randomInt(0, 20);
      this.shields = 15;
      this.missiles = 3;
      this.hull = 5;
      this.money = randomInt(0, 5000);
      this.name = 'Pirate Boss';

      this.laserDamage = 2;
      this.missileDamage = 7;

      this.imageUrl = '/images/boss-pirate.png';

      let itemIndex = randomInt(0, normalItems.length - 1);
      this.item = normalItems[itemIndex].item;
      this.itemAmount = randomInt(normalItems[itemIndex].minAmount, normalItems[itemIndex].maxAmount) + 10;
    }
  }
}

class Enemy {
  constructor(type) {
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
      this.itemAmount = randomInt(normalItems[itemIndex].minAmount, normalItems[itemIndex].maxAmount);
    }
  }
}

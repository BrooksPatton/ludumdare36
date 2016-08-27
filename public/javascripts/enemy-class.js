class Enemy {
  constructor(type) {
    if(type === 'normal') {
      this.fuel = randomInt(0, 3);
      this.shields = 10;
      this.missiles = 1;
      this.hull = 1;
      this.money = randomInt(0, 500);
      this.name = 'Pirate';
    }
  }
}

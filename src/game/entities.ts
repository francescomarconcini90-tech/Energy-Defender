import { CONFIG } from './constants';

export class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  emoji: string;
  active = true;

  constructor(x: number, y: number, w: number, h: number, emoji: string) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.emoji = emoji;
  }

  collidesWith(other: Entity) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.height}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
  }
}

export class Player extends Entity {
  hp = 5;
  maxHp = 5;
  speed = 7;
  doubleShotTimer = 0;

  constructor() {
    super(CONFIG.WIDTH / 2 - 25, CONFIG.HEIGHT - 70, 50, 50, "⚖️");
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.doubleShotTimer > 0) {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00aaff";
      this.drawPlayerIcon(ctx);
      ctx.restore();
    } else {
      this.drawPlayerIcon(ctx);
    }
    this.drawHealthBar(ctx);
  }

  drawPlayerIcon(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.height}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2 + 5);
    ctx.font = `${this.height * 0.4}px serif`;
    ctx.fillText("⚡", this.x + this.width / 2 - 18, this.y + this.height / 2 - 5);
    ctx.fillText("⚡", this.x + this.width / 2 + 18, this.y + this.height / 2 - 5);
  }

  drawHealthBar(ctx: CanvasRenderingContext2D) {
    const bw = 200, bh = 10;
    const bx = CONFIG.WIDTH / 2 - bw / 2, by = CONFIG.HEIGHT - 20;
    ctx.fillStyle = "#333";
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(bx, by, bw * (this.hp / this.maxHp), bh);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(bx, by, bw, bh);
  }

  move(dir: number) {
    this.x += dir * this.speed;
    this.x = Math.max(0, Math.min(CONFIG.WIDTH - this.width, this.x));
  }
}

export class Enemy extends Entity {
  points: number;
  constructor(x: number, y: number, emoji: string, pts: number) {
    super(x, y, 40, 40, emoji);
    this.points = pts;
  }
}

export class Drop extends Entity {
  type = "double";
  constructor(x: number, y: number) {
    super(x, y, 35, 35, "🌟");
  }
  update() {
    this.y += 3;
    if (this.y > CONFIG.HEIGHT) this.active = false;
  }
}

export class FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life = 60;
  active = true;

  constructor(x: number, y: number, text: string, color: string) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
  }

  update() {
    this.y -= 1;
    this.life--;
    if (this.life <= 0) this.active = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.life / 60;
    ctx.fillStyle = this.color;
    ctx.font = "bold 20px Arial";
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

export class Boss extends Entity {
  hp: number;
  maxHp: number;
  speedX = 2;
  dirX = 1;
  shakeTime = 0;
  isEnraged = false;
  bombEmoji: string;
  bombSpeed: number;
  lastShotTime = 0;

  constructor(emoji: string, hp: number, bombEmoji: string, bombSpeed: number) {
    super(CONFIG.WIDTH / 2 - 60, -150, 120, 120, emoji);
    this.hp = hp;
    this.maxHp = hp;
    this.bombEmoji = bombEmoji;
    this.bombSpeed = bombSpeed;
  }

  update(game: any) {
    if (this.hp < this.maxHp / 2 && !this.isEnraged) {
      this.speedX *= 1.5;
      this.isEnraged = true;
    }
    this.x += this.speedX * this.dirX;
    if (this.x <= 0 || this.x + this.width >= CONFIG.WIDTH) this.dirX *= -1;
    if (this.y < 100) this.y += 1;
    if (this.shakeTime > 0) this.shakeTime--;

    if (Date.now() - this.lastShotTime > 3000) {
      game.bossBullets.push({
        x: this.x + this.width / 2 - 15,
        y: this.y + this.height,
        vy: this.bombSpeed,
        emoji: this.bombEmoji,
        active: true,
        width: 30,
        height: 30
      });
      this.lastShotTime = Date.now();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    if (this.shakeTime > 0) ctx.translate((Math.random() - 0.5) * 10, 0);
    if (this.isEnraged) ctx.filter = "hue-rotate(300deg) saturate(200%)";
    super.draw(ctx);
    const bw = 120, bh = 15;
    const bx = this.x, by = this.y - 20;
    ctx.fillStyle = "#222";
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = this.shakeTime > 0 ? "#fff" : "#e74c3c";
    ctx.fillRect(bx, by, bw * (this.hp / this.maxHp), bh);
    ctx.restore();
  }
}

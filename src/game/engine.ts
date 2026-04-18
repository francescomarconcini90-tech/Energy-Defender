import { CONFIG } from './constants';
import { audioManager } from './audio';
import { Player, Enemy, Drop, FloatingText, Boss } from './entities';

export interface GameState {
  score: number;
  levelIndex: number;
  isPaused: boolean;
  isTransitioning: boolean;
  isGameOver: boolean;
  phase: "enemies" | "boss";
  hp: number;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player = new Player();
  enemies: Enemy[] = [];
  bullets: any[] = [];
  bossBullets: any[] = [];
  drops: Drop[] = [];
  floatingTexts: FloatingText[] = [];
  boss: Boss | null = null;
  keys: Record<string, boolean> = {};
  score = 0;
  levelIndex = 0;
  isPaused = false;
  isTransitioning = false;
  isGameOver = false;
  combo = 0;
  lastHitTime = 0;
  lastShotTime = 0;
  hitsCount = 0;
  touchDir = 0;
  phase: "enemies" | "boss" = "enemies";
  dirX = 1;
  currentQuiz: any = null;
  consecutiveWrongCount = 0;
  
  onStateChange: (state: GameState) => void;
  onTriggerQuiz: (quiz: any) => void;

  constructor(canvas: HTMLCanvasElement, onStateChange: (state: GameState) => void, onTriggerQuiz: (quiz: any) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.onStateChange = onStateChange;
    this.onTriggerQuiz = onTriggerQuiz;
    this.initListeners();
    this.reset();
  }

  initListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      audioManager.init();
    });
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
    window.addEventListener("touchstart", (e) => {
      const tx = e.touches[0].clientX;
      this.touchDir = tx < window.innerWidth / 2 ? -1 : 1;
      audioManager.init();
    });
    window.addEventListener("touchend", () => (this.touchDir = 0));
  }

  notifyState() {
    this.onStateChange({
      score: this.score,
      levelIndex: this.levelIndex,
      isPaused: this.isPaused,
      isTransitioning: this.isTransitioning,
      isGameOver: this.isGameOver,
      phase: this.phase,
      hp: this.player.hp,
    });
  }

  reset() {
    this.player = new Player();
    this.enemies = [];
    this.bullets = [];
    this.drops = [];
    this.bossBullets = [];
    this.floatingTexts = [];
    this.boss = null;
    this.score = 0;
    this.levelIndex = 0;
    this.hitsCount = 0;
    this.phase = "enemies";
    this.isGameOver = false;
    this.isPaused = false;
    this.consecutiveWrongCount = 0;
    this.notifyState();
    this.startLevelTransition();
  }

  startLevelTransition() {
    this.isTransitioning = true;
    this.notifyState();
    setTimeout(() => {
      this.setupLevel();
      this.isTransitioning = false;
      this.notifyState();
    }, 2000);
  }

  setupLevel() {
    this.phase = "enemies";
    this.boss = null;
    this.enemies = [];
    const lvl = CONFIG.LEVELS[this.levelIndex];
    if (!lvl) return;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 9; c++) {
        this.enemies.push(new Enemy(100 + c * 65, 80 + r * 55, lvl.emojis[r % 5], (5 - r) * 10));
      }
    }
  }

  triggerQuiz() {
    this.isPaused = true;
    this.notifyState();
    const lvl = CONFIG.LEVELS[this.levelIndex];
    if (!lvl) return;
    this.currentQuiz = lvl.notions[Math.floor(Math.random() * lvl.notions.length)];
    this.consecutiveWrongCount = 0;
    this.onTriggerQuiz(this.currentQuiz);
  }

  resumeWithPowerUp() {
    this.isPaused = false;
    this.notifyState();
  }

  applyPowerUp() {
    audioManager.playPowerUp();
    this.player.doubleShotTimer = 300;
    this.floatingTexts.push(new FloatingText(this.player.x, this.player.y, "DOPPIA SAETTA!", "#00aaff"));
  }

  update() {
    if (this.isPaused || this.isTransitioning || this.isGameOver) return;

    if (this.keys["ArrowLeft"] || this.touchDir === -1) this.player.move(-1);
    if (this.keys["ArrowRight"] || this.touchDir === 1) this.player.move(1);

    if (Date.now() - this.lastShotTime > CONFIG.COOLDOWN) {
      const bx = this.player.x + this.player.width / 2 - 12;
      if (this.player.doubleShotTimer > 0) {
        this.bullets.push({ x: bx - 10, y: this.player.y, vx: 0, vy: -8, active: true, width: 25, height: 25 });
        this.bullets.push({ x: bx + 10, y: this.player.y, vx: 0, vy: -8, active: true, width: 25, height: 25 });
      } else {
        this.bullets.push({ x: bx, y: this.player.y, vx: 0, vy: -8, active: true, width: 25, height: 25 });
      }
      this.lastShotTime = Date.now();
    }

    if (this.player.doubleShotTimer > 0) this.player.doubleShotTimer--;

    this.bullets.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.y < 0) b.active = false;
    });
    this.bullets = this.bullets.filter((b) => b.active);

    this.bossBullets.forEach((b) => {
      b.y += b.vy;
      if (b.y > CONFIG.HEIGHT) b.active = false;
      if (b.active && this.collides(b, this.player)) {
        b.active = false;
        this.player.hp--;
        this.notifyState();
        audioManager.playBossHit();
        if (this.player.hp <= 0) this.gameOver("HAI PERSO! ⚖️");
      }
    });
    this.bossBullets = this.bossBullets.filter((b) => b.active);

    this.drops.forEach((d) => {
      d.update();
      if (this.player.collidesWith(d)) {
        this.applyPowerUp();
        d.active = false;
      }
    });
    this.drops = this.drops.filter((d) => d.active);

    this.floatingTexts.forEach((t) => t.update());
    this.floatingTexts = this.floatingTexts.filter((t) => t.active);

    if (this.boss) this.boss.update(this);

    if (this.phase === "enemies") {
      let leftEdge = false;
      let rightEdge = false;
      this.enemies.forEach((e) => {
        e.x += CONFIG.LEVELS[this.levelIndex].speed * this.dirX;
        if (e.x <= 0) leftEdge = true;
        if (e.x + e.width >= CONFIG.WIDTH) rightEdge = true;
      });
      if (leftEdge) {
        this.dirX = 1;
        this.enemies.forEach((e) => (e.y += 10));
        this.triggerQuiz();
      } else if (rightEdge) {
        this.dirX = -1;
        this.enemies.forEach((e) => (e.y += 10));
      }

      this.bullets.forEach((b) => {
        this.enemies.forEach((e) => {
          if (b.active && e.active && this.collides(b, e)) {
            b.active = false;
            e.active = false;
            this.score += e.points;
            this.notifyState();
            this.handleHit(e.x, e.y);
          }
        });
      });
      this.enemies = this.enemies.filter((e) => e.active);

      if (this.enemies.length === 0) {
        this.phase = "boss";
        this.notifyState();
        const lvl = CONFIG.LEVELS[this.levelIndex];
        if (lvl) {
          this.boss = new Boss(lvl.bossEmoji, lvl.bossHp, lvl.bombEmoji, lvl.bombSpeed);
          this.floatingTexts.push(new FloatingText(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, "ATTENZIONE AL BOSS!", "#e74c3c"));
        }
      }
    } else if (this.phase === "boss") {
      this.bullets.forEach((b) => {
        if (this.boss && b.active && this.collides(b, this.boss)) {
          b.active = false;
          this.boss.hp--;
          this.boss.shakeTime = 10;
          audioManager.playBossHit();
          if (this.boss.hp <= 0) {
            if (this.levelIndex < 2) {
              this.levelIndex++;
              this.startLevelTransition();
            } else {
              this.win();
            }
          }
        }
      });
    }
  }

  collides(a: any, b: any) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  handleHit(x: number, y: number) {
    audioManager.playHit();
    this.hitsCount++;
    if (this.hitsCount % 15 === 0) {
      this.drops.push(new Drop(x, y));
    }

    const now = Date.now();
    if (now - this.lastHitTime < 500) {
      this.combo++;
      const texts = ["OTTIMO!", "SUPER!", "DELIZIOSO!", "WOW!", "CHEF STAR!"];
      if (this.combo > 2) {
        this.floatingTexts.push(new FloatingText(x, y, texts[Math.min(this.combo - 3, 4)], "#f1c40f"));
        audioManager.playPopup();
      }
    } else {
      this.combo = 0;
    }
    this.lastHitTime = now;
  }

  draw() {
    const lvl = CONFIG.LEVELS[this.levelIndex];
    if (!lvl) return;
    this.ctx.fillStyle = this.boss ? "#000" : lvl.bgColor;
    this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 20px monospace";
    this.ctx.textAlign = "right";
    this.ctx.fillText(`PUNTI: ${this.score}`, CONFIG.WIDTH - 20, 30);
    this.ctx.font = "16px monospace";
    this.ctx.fillText(`LIVELLO ${this.levelIndex + 1} - ${lvl.name.toUpperCase()}`, CONFIG.WIDTH - 20, 55);
    this.ctx.textAlign = "center";

    this.player.draw(this.ctx);
    this.enemies.forEach((e) => e.draw(this.ctx));

    this.bullets.forEach((b) => {
      this.ctx.save();
      this.ctx.translate(b.x + 12, b.y + 12);
      this.ctx.fillStyle = "#3498db";
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = "#3498db";
      this.ctx.beginPath();
      this.ctx.moveTo(2, -12);
      this.ctx.lineTo(-6, 2);
      this.ctx.lineTo(0, 2);
      this.ctx.lineTo(-4, 12);
      this.ctx.lineTo(8, -1);
      this.ctx.lineTo(2, -1);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    });

    this.bossBullets.forEach((b) => {
      this.ctx.font = "30px serif";
      this.ctx.fillText(b.emoji, b.x + 15, b.y + 15);
    });
    this.drops.forEach((d) => d.draw(this.ctx));
    this.floatingTexts.forEach((t) => t.draw(this.ctx));
    if (this.boss) this.boss.draw(this.ctx);

    if (this.isGameOver && this.boss && this.boss.hp <= 0) {
      this.drawVictoryFX();
    }
  }

  drawVictoryFX() {
    const emojis = ["🎆", "🎉", "✨", "🎈"];
    for (let i = 0; i < 5; i++) {
      this.ctx.font = "30px serif";
      this.ctx.fillText(emojis[Math.floor(Math.random() * emojis.length)], Math.random() * CONFIG.WIDTH, Math.random() * CONFIG.HEIGHT);
    }
  }

  updateLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("energyDefenderScores") || "[]");
    scores.push({ score: this.score, date: new Date().toLocaleDateString() });
    scores.sort((a: any, b: any) => b.score - a.score);
    scores = scores.slice(0, 5);
    localStorage.setItem("energyDefenderScores", JSON.stringify(scores));
  }

  win() {
    this.isGameOver = true;
    this.notifyState();
    audioManager.playGrandVictory();
    this.updateLeaderboard();
  }

  gameOver(msg: string) {
    this.isGameOver = true;
    this.notifyState();
    this.updateLeaderboard();
  }

  loop() {
    this.update();
    this.draw();
    if (!this.isGameOver) requestAnimationFrame(() => this.loop());
  }
}

export default class StatsPopup {
  constructor(scene, stats) {
    this.scene = scene;
    this.stats = stats;
    this.create();
  }

  create() {
    const style = { font: "30px Arial", fill: "#FFFFFF" };
    const popupWidth = 800;
    const popupHeight = 600;

    this.popup = this.scene.add
      .graphics()
      .setScrollFactor(0)
      .fillStyle(0x000000, 0.5)
      .fillRect(
        (this.scene.sys.game.config.width - popupWidth) / 2,
        (this.scene.sys.game.config.height - popupHeight) / 2,
        popupWidth,
        popupHeight
      );

    this.title = this.scene.add
      .text(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY - 200,
        `Game Completed!`,
        { font: "46px Arial", fill: "#FAFAD2" }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    if (this.scene.client) {
      this.place = this.scene.add
        .text(
          this.scene.cameras.main.centerX,
          this.scene.cameras.main.centerY - 125,
          `Your Place: 0`,
          style
        )
        .setOrigin(0.5)
        .setScrollFactor(0);
    }
    this.time = this.scene.add
      .text(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY - 50,
        `Time Total: ${this.stats.time.toFixed(2)}`,
        style
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.timeBestLap = this.scene.add
      .text(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY + 50,
        `Best Lap: ${this.stats.timeBestLap.toFixed(2)}`,
        style
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.text = this.scene.add
      .text(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY + 200,
        `Tap to continue!`,
        style
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.scene.input.once("pointerdown", () => {
      this.scene.scene.start("Game");
    });
  }
}

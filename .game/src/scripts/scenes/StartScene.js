import Client from "../classes/Client";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  create() {
    this.createBackground();
    this.createButtons();
    this.setEvents();
  }

  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
  }

  createButtons() {
    this.buttonSingle = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        "ONE PLAYER",
        { font: "bold 46px Arial", fill: "#FAFAD2" }
      )
      .setOrigin(0.5)
      .setInteractive();

    this.buttonMulti = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 50,
        "TWO PLAYERS",
        { font: "bold 46px Arial", fill: "#FAFAD2" }
      )
      .setOrigin(0.5)
      .setInteractive();
  }

  setEvents() {
    this.buttonSingle.on("pointerdown", this.startGame, this);
    this.buttonMulti.on("pointerdown", this.requestGame, this);
  }

  startGame() {
    this.scene.start("Game", { client: this.client });
  }

  requestGame() {
    this.client = new Client();
    this.client.init();
    this.client.on("game", this.startGame, this);
  }
}

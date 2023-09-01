import Client from "../classes/Client";

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("Map");
    this.gameMode = null;
  }

  create(data) {
    if (data && data.key) {
      this.gameMode = data.key;
    }
    this.createBackground();
    this.createButtons();
    this.setEvents();
  }

  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
  }

  createButtons() {
    this.buttonMap1 = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        "MAP 1",
        { font: "bold 46px Arial", fill: "#FAFAD2" }
      )
      .setOrigin(0.5)
      .setInteractive();

    this.buttonMap2 = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 50,
        "MAP 2",
        { font: "bold 46px Arial", fill: "#FAFAD2" }
      )
      .setOrigin(0.5)
      .setInteractive();
  }

  setEvents() {
    this.buttonMap1.on("pointerdown", () => this.onStart({ map: 1 }), this);
    this.buttonMap2.on("pointerdown", () => this.onStart({ map: 2 }), this);
  }

  onStart(data) {
    if (this.gameMode === "singleMode") {
      this.startGame(data.map);
    } else if (this.gameMode === "multiMode") {
      this.requestGame(data.map);
    }
  }

  startGame(map) {
    this.scene.start("Game", { client: this.client, map: map });
  }

  requestGame(map) {
    this.client = new Client();
    this.client.init();
    this.client.currentMap({
      map: map,
    });
    this.client.on("game", () => this.startGame(map), this);
  }
}

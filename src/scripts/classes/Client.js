const HOST = "http://localhost:3000";

import Phaser from "phaser";
import io from "socket.io-client";

export default class Client extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }

  init() {
    this.sent = {};
    this.master = false;
    this.firstPlayerFinish = 0;
    this.map = null;
    this.socket = io(HOST);

    this.socket.on("done", (data) => {
      if (data && data.first) {
        this.firstPlayerFinish = data.first;
      }
    });

    this.socket.on("connect", () => {
      console.log("client connected");
      this.socket.emit("gameEnd");
    });
    this.socket.on("disconnect", () => {
      console.log("client disconnected");
      this.socket.emit("clientDisconnect");
    });
    this.socket.on("gameStart", (data) => {
      if (data && data.master) {
        this.master = data.master;
      }
      this.emit("game");
    });
    this.socket.on("enemyMove", (data) => {
      this.emit("data", data);
    });
  }

  send(data) {
    if (JSON.stringify(data) !== JSON.stringify(this.sent)) {
      this.sent = data;
      this.socket.emit("playerMove", data);
    }
  }

  finishTime(data) {
    this.socket.emit("finish", data);
  }

  currentMap(data) {
    this.map = data.map;
    this.socket.emit("currentMap", data);
  }
}

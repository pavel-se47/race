const socketIO = require("socket.io");

module.exports = {
  init(server) {
    this.sessions = [];
    this.firstTime = 0;
    this.io = socketIO(server);

    this.io.on("connection", (socket) => {
      socket.on("finish", (data) => {
        this.firstTime = data.first.toFixed(2);
        this.io.emit("done", { first: this.firstTime });
      });

      socket.on("gameEnd", () => {
        if (this.sessions.length >= 2) {
          this.sessions.shift();
        }
      });

      socket.on("clientDisconnect", () => {
        this.sessions = [];
      });

      socket.on("playerMove", (data) => {
        this.onPlayerMove(socket, data);
      });

      socket.on("currentMap", (data) => {
        this.onConnection(socket, data.map);
      });

      socket.on("error", (error) => {
        console.error(`Connection error: ${error.message}`);
      });
    });
  },

  onPlayerMove(socket, data) {
    const session = this.sessions.find(
      (session) =>
        session.playerSocket === socket || session.enemySocket === socket
    );

    if (session) {
      let opponentSocket;
      if (session.playerSocket === socket) {
        opponentSocket = session.enemySocket;
      } else {
        opponentSocket = session.playerSocket;
      }

      opponentSocket.emit("enemyMove", data);
    }
  },

  getPendingSession() {
    return this.sessions.find(
      (session) => session.playerSocket && !session.enemySocket
    );
  },

  getMap(map) {
    return this.sessions.find((session) => session.map === map);
  },

  createPendingSession(socket, map) {
    const session = {
      playerSocket: socket,
      enemySocket: null,
      map: map,
    };
    this.sessions.push(session);
  },

  startGame(session) {
    session.playerSocket.emit("gameStart", { master: true });
    session.enemySocket.emit("gameStart");
  },

  onConnection(socket, map) {
    console.log(`new user connected ${socket.id}`);

    let session = this.getPendingSession();
    let sessionMap = this.getMap(map);

    if (!session || !sessionMap) {
      this.createPendingSession(socket, map);
    } else {
      session.enemySocket = socket;
      this.startGame(session);
    }
  },
};

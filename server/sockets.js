const socketIO = require("socket.io");

module.exports = {
  init(server) {
    this.sessions = [];
    this.firstTime = 0;
    this.io = socketIO(server);

    this.io.on("connection", (socket) => {
      socket.on("playerMove", (data) => {
        this.onPlayerMove(socket, data);
      });

      socket.on("finish", (data) => {
        this.firstTime = data.first.toFixed(2);
        this.io.emit("done", { first: this.firstTime });
      });

      this.onConnection(socket);
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

  createPendingSession(socket) {
    const session = { playerSocket: socket, enemySocket: null };
    this.sessions.push(session);
  },

  startGame(session) {
    session.playerSocket.emit("gameStart", { master: true });
    session.enemySocket.emit("gameStart");
  },

  onConnection(socket) {
    console.log(`new user connected ${socket.id}`);

    let session = this.getPendingSession();
    if (!session) {
      this.createPendingSession(socket);
    } else {
      session.enemySocket = socket;

      this.startGame(session);
    }
  },
};

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let ultimoNumero = "-";

let disponibles = [];
for (let i = 1; i <= 75; i++) {
    disponibles.push(i);
}

let sorteados = [];

io.on("connection", (socket) => {

    console.log("Jugador conectado");

    socket.emit("estadoBingo", {
        ultimoNumero,
        sorteados,
        disponibles
    });

    socket.on("sacarNumero", () => {

        if (disponibles.length === 0) {
            return;
        }

        const indice = Math.floor(
            Math.random() * disponibles.length
        );

        ultimoNumero = disponibles[indice];

        disponibles.splice(indice, 1);

        sorteados.push(ultimoNumero);

        io.emit("estadoBingo", {
            ultimoNumero,
            sorteados,
            disponibles
        });

    });

});

server.listen(3000, "0.0.0.0", () => {
    console.log("Servidor ejecutándose en puerto 3000");
});
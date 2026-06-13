const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let ultimoNumero = "-";
let sorteados = [];
let disponibles = [];

for (let i = 1; i <= 75; i++) {
    disponibles.push(i);
}

let ultimoBingo = "";

io.on("connection", (socket) => {

    console.log("Jugador conectado");

    // Enviar estado inicial
    socket.emit("estadoBingo", {
        ultimoNumero,
        sorteados,
        disponibles
    });

    // Sacar número
    socket.on("sacarNumero", () => {

        if (disponibles.length === 0) return;

        const indice = Math.floor(Math.random() * disponibles.length);

        ultimoNumero = disponibles[indice];

        disponibles.splice(indice, 1);

        sorteados.push(ultimoNumero);

        io.emit("estadoBingo", {
            ultimoNumero,
            sorteados,
            disponibles
        });
    });

    // Nueva partida
    socket.on("nuevaPartida", () => {

        ultimoNumero = "-";
        sorteados = [];
        disponibles = [];

        for (let i = 1; i <= 75; i++) {
            disponibles.push(i);
        }

        ultimoBingo = "";

        io.emit("estadoBingo", {
            ultimoNumero,
            sorteados,
            disponibles
        });

        io.emit("limpiarBingo");
        io.emit("limpiarCartones");
    });

    // Cantar bingo (ESTO TE FALTABA)
    socket.on("cantarBingo", (nombre) => {

        console.log("BINGO cantado por:", nombre);

        ultimoBingo = nombre;

        io.emit("bingoCantado", nombre);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
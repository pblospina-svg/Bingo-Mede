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

    socket.on("cantarBingo", (nombre) => {

    ultimoBingo = nombre;

    io.emit("bingoCantado", nombre);

});
    
    io.emit("bingoCantado", nombre);
});

    socket.on("nuevaPartida", () => {

        ultimoNumero = "-";

        sorteados = [];

        disponibles = [];

        for(let i = 1; i <= 75; i++){
            disponibles.push(i);
        }

        io.emit("estadoBingo", {
            ultimoNumero,
            sorteados,
            disponibles
        });
        io.emit("limpiarBingo");

        ultimoBingo = "";
        io.emit("limpiarBingo");
    });

let ultimoBingo = "";

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
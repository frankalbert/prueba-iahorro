let state = [
    ["x", "o", null],
    ["x", "x", "o"],
    ["o", "x", null]
];

let colorPrimary = true;
let isTurnX = true;
let pathImage = "http://cdn.iahorro.com/internal-resources/it-technical-test/";
let winnerPlayer = false;

const games = document.querySelectorAll(".game");

function populate(board) {
    updateGame(board);
}

function nextPlayer(board) {
    const title = board.querySelector(".game__header .title");
    const titleSpan = board.querySelector(".game__header .title span");
    const titleImage = board.querySelector(".game__header .title img");
    titleSpan.textContent = "Turno de: ";
    let image = document.createElement("img");

    if (!isTurnX) {
        image.src = `${pathImage}o${colorPrimary ? "" : "2"}.png`;
    } else {
        image.src = `${pathImage}x${colorPrimary ? "" : "2"}.png`;
    }

    if (titleImage) {
        title.removeChild(titleImage);
    }
    title.appendChild(image);
    findWinner(board);
}

function findWinner(board) {
    let playerWinner = '';
    // Comprobamos si en una fila están los mismo valores, en caso de ser así, lo
    for (let i = 0; i < state.length; i++) {
        const row = state[i];

        if (row.every((item) => item === "x")) {
            winnerPlayer = true;
            playerWinner = 'x';
            break;
        } else if (row.every((item) => item === "o")) {
            winnerPlayer = true;
            playerWinner = 'o';
            break;
        }
    }

    if (!winnerPlayer) {
        // Nueva comprobación, en este punto comprobaríamos a nivel de columna, las iría guardando en un objeto o en una matriz de objetos y luego comprobaría las coincidencias
    }

    if (winnerPlayer) {
        const titleSpan = board.querySelector(".game__header .title span");
        const titleImage = board.querySelector(".game__header .title img");
        titleSpan.textContent = "Ha ganado: ";

        if (titleImage) {
            if (isTurnX) {
                titleImage.src = `${pathImage}o${colorPrimary ? "" : "2"}.png`;
            } else {
                titleImage.src = `${pathImage}x${colorPrimary ? "" : "2"}.png`;
            }
        }
    }
}

function updateGame(board) {
    board.querySelector(".game__body").innerHTML = "";
    state.forEach((row, index) => {
        let newRow = document.createElement("div");
        newRow.classList.add(
            "row",
            "no-wrap",
            "no-margin",
            "d__flex",
            "justify-center"
        );

        for (let i = 0; i < row.length; i++) {
            const value = state[index][i];
            const newCol = document.createElement("div");
            newCol.classList.add("col", "no-pading");

            let urlImage = "";

            if (value === "x") {
                urlImage = `${pathImage}x${colorPrimary ? "" : "2"}.png`;
            } else if (value === "o") {
                urlImage = `${pathImage}o${colorPrimary ? "" : "2"}.png`;
            }

            newCol.innerHTML = `<div class="box d__flex justify-center align-center" data-position-x="${index}" data-position-y="${i}">
                  ${urlImage ? `<img src="${urlImage}" alt="imagen icono" />` : ""
                }
              </div>`;
            newRow.append(newCol);
        }
        board.querySelector(".game__body").append(newRow);
    });
}

document.querySelector(".cambiar__color").addEventListener("click", (e) => {
    const board = e?.target?.closest(".game");

    // Cambiamos el valor de colorPrimary para que actualice la url de la imagen
    colorPrimary = !colorPrimary;

    // Cambiando la imagen del Header
    const title = board.querySelector(".game__header .title");
    const titleImage = board.querySelector(".game__header .title img");

    if (titleImage) {
        if (!isTurnX) {
            titleImage.src = `${pathImage}o${colorPrimary ? "" : "2"}.png`;
        } else {
            titleImage.src = `${pathImage}x${colorPrimary ? "" : "2"}.png`;
        }
    }

    // Cambiamos los svg de la puntuación
    const svgPuntuacion = document.querySelectorAll(".game__footer--item");
    svgPuntuacion.forEach((item) => {
        item.querySelector("svg")?.classList?.toggle("secundary");
    });

    updateGame(board);
});

games.forEach((game) => {
    populate(game);
    game.addEventListener("click", (e) => {
        const parents = e.path || [];
        const findParentBox = parents.find((parent) => {
            return parent?.className?.includes("box");
        });
        if (findParentBox) {
            isTurnX = !isTurnX;
            nextPlayer(game);
        }
    });
});

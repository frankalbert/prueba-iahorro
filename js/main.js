const pathImage = "http://cdn.iahorro.com/internal-resources/it-technical-test/";
let state = null;

let colorPrimary = null;
let isTurnX = null;
let playerWinner = null;

const boards = document.querySelectorAll(".board");

function resetAllLetDependencies() {
    state = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    colorPrimary = true;
    isTurnX = true;
    playerWinner = null;
}

resetAllLetDependencies();

function populate(board) {
    updateBoard(board);
}

// Función que cambia el svg del Header
function updateTitleBoard(board) {
    const title = board.querySelector(".board__header .title");
    const titleSvg = board.querySelector(".board__header .title svg");
    const svgX = board.querySelector('.board__footer--item .icon.x').cloneNode(true);
    const svgCircle = board.querySelector('.board__footer--item .icon.o').cloneNode(true);

    let svg = "";

    if (!isTurnX) {
        svg = svgCircle;
    } else {
        svg = svgX;
    }

    if (titleSvg) {
        title.removeChild(titleSvg);
    }

    title.append(svg);
}

function nextPlayer(board) {

    const titleSpan = board.querySelector(".board__header .title span");
    titleSpan.textContent = "Turno de: ";

    // Cambiando el svg del Header
    updateTitleBoard(board);
    updateBoard(board);
    findWinner(board);
}

function findMatchByOffset({ positionInitial, offset }) {

    let vectorOnedimensional = [];
    // Rellenamos en una matriz unidimencional el state, para buscar de manera más fácil
    for (let i = 0; i < state.length; i++) {
        const row = state[i];
        for (let j = 0; j < row.length; j++) {
            vectorOnedimensional.push(row[j]);
        }
    }

    let subVector = [];
    let winner = null;

    for (let i = 0; i < state[0].length; i++) {
        subVector.push(vectorOnedimensional[i * offset + positionInitial]);
    }

    if (subVector.every(item => item === 'x')) {
        winner = 'x';
    }
    else if (subVector.every(item => item === 'o')) {
        winner = 'o';
    }

    return winner;
}

function updatePuntuacion(board) {
    const totalWinnerX = board.querySelector('.total__board--x');
    const totalWinnerO = board.querySelector('.total__board--circle');
    const puntuacion = JSON.parse(sessionStorage.getItem('puntuacion'));

    totalWinnerX.textContent = puntuacion.x;
    totalWinnerO.textContent = puntuacion.o;
}

function findWinner(board) {

    const vectorToSearch = [
        {
            positionInitial: 0,
            offset: 1,
        },
        {
            positionInitial: 0,
            offset: 3,
        },
        {
            positionInitial: 0,
            offset: 4,
        },
        {
            positionInitial: 1,
            offset: 3,
        },
        {
            positionInitial: 2,
            offset: 2,
        },
        {
            positionInitial: 2,
            offset: 3,
        },
        {
            positionInitial: 3,
            offset: 1,
        },
        {
            positionInitial: 4,
            offset: 1,
        },
        {
            positionInitial: 5,
            offset: 1,
        },
    ];

    for (let i = 0; i < vectorToSearch.length; i++) {
        const resultFind = findMatchByOffset(vectorToSearch[i]);
        if (resultFind) {
            playerWinner = resultFind;
            break;
        }
    }

    if (playerWinner) {
        const titleSpan = board.querySelector(".board__header .title span");
        const puntuacion = JSON.parse(sessionStorage.getItem('puntuacion') ? sessionStorage.getItem('puntuacion') : JSON.stringify({
            'x': 0,
            'o': 0,
        }));

        playerWinner === 'x' ? puntuacion.x++ : playerWinner === 'o' ? puntuacion.o++ : '';

        titleSpan.textContent = "Ha ganado: ";

        // Devolvemos el ganador a la posición anterior
        isTurnX = !isTurnX;

        // Cambiando el svg del Header
        updateTitleBoard(board);

        board.querySelector('.nuevo__juego').removeAttribute('disabled');
        sessionStorage.setItem('puntuacion', JSON.stringify(puntuacion));
        updatePuntuacion(board);
    }
}

function updateStateByPosition(positionX, positionY, value) {
    const existsValue = state[positionX][positionY];
    const valueToReturn = !existsValue && !playerWinner;
    if (valueToReturn) {
        state[positionX][positionY] = value;
    }

    return valueToReturn;
}

function updateBoard(board) {

    board.querySelector(".board__body").innerHTML = "";
    const svgX = board.querySelector('.board__footer--item .icon.x').cloneNode(true);
    const svgCircle = board.querySelector('.board__footer--item .icon.o').cloneNode(true);

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

            let svg = "";
            let classPlayerClicked = "";

            if (value === "x") {
                svg = svgX.outerHTML;
                classPlayerClicked = `x ${colorPrimary ? '' : 'secundary'}`;
            } else if (value === "o") {
                svg = svgCircle.outerHTML;
                classPlayerClicked = `o ${colorPrimary ? '' : 'secundary'}`;
            }

            newCol.innerHTML = `<div class="box d__flex justify-center align-center ${classPlayerClicked}" data-position-x="${index}" data-position-y="${i}"></div>`;
            newCol.querySelector('.box').innerHTML += svg;
            newRow.append(newCol);
        }
        board.querySelector(".board__body").append(newRow);
    });

    updatePuntuacion(board);
}

function resetAllHeader(board) {
    const title = board.querySelector(".board__header .title");
    const titleSpan = board.querySelector(".board__header .title span");
    titleSpan.textContent = '¡Empezamos!';
    const titleSvg = board.querySelector(".board__header .title svg");

    if (titleSvg) {
        title.removeChild(titleSvg);
    }

}

function newBoard(board) {
    resetAllLetDependencies();
    resetAllHeader(board);
    updateBoard(board);
    board.querySelector('.nuevo__juego').setAttribute('disabled', 'disabled');
    playerWinner = null;
}

boards.forEach((board) => {

    populate(board);

    board.addEventListener("click", (e) => {
        const parents = e.path || [];
        const findParentBox = parents.find((parent) => {
            return parent?.className?.includes("box");
        });
        if (findParentBox) {
            if (updateStateByPosition(findParentBox.getAttribute('data-position-x'), findParentBox.getAttribute('data-position-y'), isTurnX ? 'x' : 'o')) {
                isTurnX = !isTurnX;
                nextPlayer(board);
            }
        }

        const findParentButtonNewBoard = parents.find((parent) => {
            return parent?.className?.includes("nuevo__juego");
        });

        if (findParentButtonNewBoard) {
            newBoard(board);
        }

        const findParentButtonCambiarColor = parents.find((parent) => {
            return parent?.className?.includes("cambiar__color");
        });

        if (findParentButtonCambiarColor) {

            // Cambiamos el valor de colorPrimary para que actualice la url de la imagen
            colorPrimary = !colorPrimary;

            // Cambiamos los svg de la puntuación
            const svgPuntuacion = board.querySelectorAll(".board__footer--item");
            svgPuntuacion.forEach((item) => {
                item.querySelector("svg")?.classList?.toggle("secundary");
            });

            // Cambiando el svg del Header
            updateTitleBoard(board);

            updateBoard(board);

        }

    });
});

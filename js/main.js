let state = null;
let colorPrimary = null;
let isTurnX = null;
let playerWinner = null;
let vectorOneDimensional = null;
const boards = document.querySelectorAll(".board");
const nameItemInStorage = 'puntuacion';

function resetAllVarsDependencies() {
    state = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    colorPrimary = true;
    isTurnX = true;
    playerWinner = null;
    vectorOneDimensional = [];
}

resetAllVarsDependencies();

function populate(board) {
    updateInfoHeader({ board, textTitle: '¡Empezamos!', addSvg: false });
    updateBoard(board);
}

function nextPlayer(board) {

    // Cambiando el svg del Header y el texto del title
    updateInfoHeader({ board, textTitle: 'Turno de: ' });
    updateVectorOneDimensional();
    updateBoard(board);
    findWinner(board);
}

function updateVectorOneDimensional() {

    vectorOneDimensional = [];

    // Rellenamos en una matriz unidimencional el state, para buscar de manera más fácil
    for (let i = 0; i < state.length; i++) {
        const row = state[i];
        for (let j = 0; j < row.length; j++) {
            vectorOneDimensional.push(row[j]);
        }
    }
}

function findMatchByOffset({ positionInitial, offset }) {

    let subVector = [];
    let winner = null;

    for (let i = 0; i < state[0].length; i++) {
        subVector.push(vectorOneDimensional[i * offset + positionInitial]);
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
    const puntuacion = JSON.parse(sessionStorage.getItem(nameItemInStorage));

    totalWinnerX.textContent = puntuacion?.x || 0;
    totalWinnerO.textContent = puntuacion?.o || 0;
}

function findWinner(board) {

    // Esta matriz, contendrá todas las combinaciones para encontrar un ganador, guardará un objeto con la posición inicial y el salto a buscar
    const combinationToSearch = [];

    for (let i = 0; i < state.length; i++) {
        const stateLength = state.length;
        //  La primera posición es la que más combinaciones tendrá, porque tendrá la de su fila correspondiente, la de su columna correspondiente y la diagonal principal
        if (i === 0) {
            combinationToSearch.push({
                positionInitial: i,
                offset: 1,
            })
            combinationToSearch.push({
                positionInitial: i,
                offset: stateLength,
            })
            combinationToSearch.push({
                positionInitial: i,
                offset: stateLength + 1,
            })
        }
        //  Esta casuística es para cuando estamos en la última columna de la primera fila, en este caso se cubrirá la diagonal secundaria y su columna correspondiente
        else if (i === (stateLength - 1)) {
            combinationToSearch.push({
                positionInitial: i,
                offset: stateLength - 1,
            })
            combinationToSearch.push({
                positionInitial: i,
                offset: stateLength,
            });
        }
        // Cubrimos el resto de columnas, excepto la primera y la última
        else {
            combinationToSearch.push({
                positionInitial: i,
                offset: stateLength,
            })
        }

        // Cubrimos las filas, excepto la primera
        if (((i * stateLength % stateLength) === 0) && (i !== 0)) {
            combinationToSearch.push({
                positionInitial: i * stateLength,
                offset: 1,
            });
        }
    }

    for (let i = 0; i < combinationToSearch.length; i++) {
        const resultFind = findMatchByOffset(combinationToSearch[i]);
        if (resultFind) {
            playerWinner = resultFind;
            break;
        }
    }

    if (playerWinner) {

        const puntuacion = JSON.parse(sessionStorage.getItem(nameItemInStorage) ? sessionStorage.getItem(nameItemInStorage) : JSON.stringify({
            'x': 0,
            'o': 0,
        }));

        playerWinner === 'x' ? puntuacion.x++ : playerWinner === 'o' ? puntuacion.o++ : '';

        // Devolvemos el ganador a la posición anterior, o sea, al jugador que acabó su turno
        isTurnX = !isTurnX;

        // Cambiando el svg del Header y el texto del title
        updateInfoHeader({ board, textTitle: 'Ha ganado: ' });

        activeButtonNewBoard(board);
        sessionStorage.setItem(nameItemInStorage, JSON.stringify(puntuacion));
        updatePuntuacion(board);

    }
    else {
        if (!vectorOneDimensional.some(item => item === null)) {
            updateInfoHeader({ board, textTitle: '¡Tablas!', addSvg: false });
            activeButtonNewBoard(board);
        }
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

// Función que actualiza la información del Header en función de los parámetros
function updateInfoHeader({ board, textTitle = null, addSvg = true }) {
    const title = board.querySelector(".board__header .title");
    const titleSpan = board.querySelector(".board__header .title span");
    const titleSvg = board.querySelector(".board__header .title svg");
    const svgX = board.querySelector('.board__footer--item .icon.x').cloneNode(true);
    const svgCircle = board.querySelector('.board__footer--item .icon.o').cloneNode(true);
    const svg = !isTurnX ? svgCircle : svgX;

    if (titleSvg) {
        title.removeChild(titleSvg);
    }
    if (addSvg) {
        title.append(svg);
    }

    if (textTitle) {
        titleSpan.textContent = textTitle;
    }
}

function activeButtonNewBoard(board, disabled = false) {
    if (disabled) {
        board.querySelector('.nuevo__juego').setAttribute('disabled', 'disabled');
    }
    else {
        board.querySelector('.nuevo__juego').removeAttribute('disabled');
    }
}

function newBoard(board) {
    resetAllVarsDependencies();
    updateInfoHeader({ board, textTitle: '¡Empezamos!', addSvg: false });
    updateBoard(board);
    activeButtonNewBoard(board, true);
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

    });

    // Asignamos el click en el botón de nuevo juego
    board.querySelector('.nuevo__juego').addEventListener('click', function () {
        newBoard(board);
    });

    // Asignamos el click en el botón de cambiar color, por cada uno de los boards que existan
    board.querySelector('.cambiar__color').addEventListener('click', function () {

        // Cambiamos el valor de colorPrimary para que actualice la clase del svg cuando se renderice
        colorPrimary = !colorPrimary;

        // Cambiamos los svg de la puntuación
        const svgPuntuacion = board.querySelectorAll(".board__footer--item");
        svgPuntuacion.forEach((item) => {
            item.querySelector("svg")?.classList?.toggle("secundary");
        });

        // Cambiando el svg del Header en función de si existe algún valor en la matriz state, o sea, si hay algún valor que no es null y hay algún valor que es null y no haya ganado ningún jugador, o sea, que sean mixtos, esto significa que hay casillas por rellenar y el juego no ha terminado o que el juego ha terminado y hubo un ganador, en ese caso añadimos (actualizamos el svg)
        updateInfoHeader({ board, addSvg: vectorOneDimensional.some(item => item !== null) && (vectorOneDimensional.some(item => item === null || playerWinner)) })

        updateBoard(board);

    });
});

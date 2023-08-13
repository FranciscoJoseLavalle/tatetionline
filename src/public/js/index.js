const cuadrados = document.querySelectorAll('.cuadrado');
const message = document.querySelector('.endGame');
const turnMessage = document.querySelector('.turn');
const gameEnded = document.querySelector('.gameEnded');
const resetButton = document.querySelector('.reset');
const joinButton = document.querySelector('.joinRoom');
const createButton = document.querySelector('.createRoom');
const actualRoom = document.querySelector('.actualRoom');
const roomInput = document.querySelector('.roomInput');
const youText = document.querySelector('.you');
const chat = document.querySelector('.chat');
const chatInput = document.querySelector('.chatInput');
const form = document.querySelector('form');

const socket = io({
    autoConnect: false
});
socket.connect();

let turn = 'X'
let you;
let room;

const messages = [];

document.addEventListener('DOMContentLoaded', () => {
    turnMessage.textContent = `Es el turno del jugador ${turn}`
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    messages.push({ from: you, message: chatInput.value });
    socket.emit('message', { message: chatInput.value, room })
    console.log('Mensaje', chatInput.value);
    updateChat();
});

socket.on('message', (message) => {
    console.log(message);
    messages.push({ from: you == 'X' ? 'O' : 'X', message });
    updateChat();
})

const updateChat = () => {
    chat.innerHTML = '';
    messages.forEach((el) => {
        chat.innerHTML += `<p style="text-align: ${el.from === you ? 'right' : 'left'};">${el.from}: ${el.message}</p>`
    })
    form.reset();
    chat.scrollTo({ top: 99999999999, left: 0, behavior: "smooth" })
}

joinButton.addEventListener('click', () => {
    room = parseInt(roomInput.value);
    roomInput.value = '';
    you = 'O';
    youText.textContent = `Sos el jugador ${you}`
    actualRoom.textContent = `Sala actual: ${room}`;
    socket.emit("join", { room })
    reset()
    socket.emit('reset', { room })
});
createButton.addEventListener('click', () => {
    room = parseInt(((Math.random() * 2) * Date.now() * 0.000000005).toFixed(0));
    console.log(room);
    you = 'X';
    youText.textContent = `Sos el jugador ${you}`
    actualRoom.textContent = `Sala actual: ${room}`;
    socket.emit("create_room", { room })
    reset()
    socket.emit('reset', { room })
});

const reset = () => {
    gameEnded.classList.remove('flex');
    cuadrados.forEach((cuadrado) => {
        cuadrado.textContent = '';
        cuadrado.classList.remove('red');
        cuadrado.classList.remove('blue');
    })
}
socket.on('reset', reset);
resetButton.addEventListener('click', () => {
    reset()
    socket.emit('reset', { room })
});

cuadrados.forEach((cuadrado) => {
    cuadrado.addEventListener('click', e => {
        console.log(e.target.id);
        if (turn === you) {
            socket.emit('movement', { movement: e.target.id, room })
            console.log("moviendo");
            if (e.target.textContent == '') {
                e.target.textContent = turn;
                if (e.target.textContent == 'X') {
                    e.target.classList.add('red');
                } else {
                    e.target.classList.add('blue');
                }
                checkWin();
                changeTurn();
                turnMessage.textContent = `Es el turno del jugador ${turn}`
            }
        }
    })
})

socket.on('movement', (e) => {
    console.log(e);
    cuadrados.forEach(cuadrado => {
        if (cuadrado.id == e && cuadrado.textContent == '') {
            cuadrado.textContent = turn;
            if (cuadrado.textContent == 'X') {
                cuadrado.classList.add('red');
            } else {
                cuadrado.classList.add('blue');
            }
            checkWin();
            changeTurn();
            turnMessage.textContent = `Es el turno del jugador ${turn}`
        }
    });
})

const checkWin = () => {
    if (validation(0) || validation(3) || validation(6) || validation2(0) || validation2(1) || validation2(2) || validation3(0, 8) || validation3(2, 4)) {
        message.textContent = `El jugador ${turn} ganó.`;
        endGame();
    } else if (draw()) {
        message.textContent = `Empate`;
        endGame();
    }
}

// Validations
const validation = (num) => {
    return checkSquare(num) && checkSquare(num + 1) && checkSquare(num + 2)
}
const validation2 = (num) => {
    return checkSquare(num) && checkSquare(num + 3) && checkSquare(num + 6)
}
const validation3 = (num, num2) => {
    return checkSquare(num) && checkSquare(4) && checkSquare(num + num2)
}
const checkSquare = (num) => {
    return cuadrados[num].textContent == turn
}

const changeTurn = () => {
    turn === 'X' ? turn = 'O' : turn = 'X';
}

const endGame = () => {
    gameEnded.classList.add('flex');
}
const draw = () => {
    let result = true;
    cuadrados.forEach((cuadrado) => {
        if (cuadrado.textContent == '') {
            result = false;
        }
    })
    return result;
}
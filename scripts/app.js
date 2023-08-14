// основные элементы
const c = document.querySelector('canvas').getContext('2d');
const changeLevel = document.querySelector('.change_level');
const restart = document.querySelector('.restart');
const menu = document.querySelector('.menu_start');
const endMenu = document.querySelector('.menu_end');
const timer = document.querySelector('.timer');

// основные переменные
let currentLevel;
let keysDown = {};
let selectedLevel = 1;
let isWin = false;
let timerSec = 0;
let timerMin = 0;

// let pathFile = location.href;
// pathFile = pathFile.replace('index.html', '');

// Параметры игрока
const player = {
    x: 256,
    y: 896,
    width: 32,
    height: 64,
    speed: 6,
    jumpForce: 12,
    mass: 64,
    yke: 0,
    gpe: 0
}

// Обработчик нажатия на кнопки в меню
menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('level')) {
        selectedLevel = event.target.value;
        LevelSelect();
    }
});

// Обработчик кнопки "выбрать уровень"
changeLevel.addEventListener('click', () => {
    location.reload();
});

// Обработчик кнопки "еще раз"
restart.addEventListener('click', () => {
    location.reload();
});

// добовление кода клавиши в массив при нажатии
addEventListener("keydown", (event) => {
    keysDown[event.keyCode] = true;
});

// удаление кода клавиши из массива при отпускании
addEventListener("keyup", (event) => {
    delete keysDown[event.keyCode];
});

// Таймер в игре
setInterval(() => {
    if (timerSec === 60) {
        timerMin++;
        timerSec = 1;
    }
    else {
        timerSec++;
    }
}, 1000);

// Функция чтения файла (но необходимо передавать путь на сервер)
// function readTextFile(file)
// {
//     const rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 const allText = rawFile.responseText;
//                 currentLevel = Parse(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }

// Функция запуска выбранного уровня
function LevelSelect() {
    timerSec = 0;
    timerMin = 0;
    switch(selectedLevel) {
        case '1': {
            // readTextFile(`${pathFile}level/level1.txt`);
            currentLevel = Parse(level1);
            break;
        }
        case '2': {
            // readTextFile(`${pathFile}level/level2.txt`);
            currentLevel = Parse(level2);
            break;
        }
        case '3': {
            // readTextFile(`${pathFile}level/level3.txt`);
            currentLevel = Parse(level3);
            break;
        }
        default: {
            alert('От 1 до 3');
            location.reload();
        }
    }
    menu.style.display = 'none';
    Main();
    changeLevel.style.display = 'block';
}

// Главная функция постоянного обновления
function Main() {
    Draw();
    Input();
    WinGame();
    Gravity(player);

    const offsetX = Math.max(0, player.x - window.innerWidth / 2);
    const offsetY = Math.max(0, player.y - window.innerHeight / 2);
    window.scrollTo(offsetX, offsetY);

    if (isWin) {
        TheEnd();
    }
    else {
        requestAnimationFrame(Main);
    }
}

// Запуск экрана победы
function TheEnd() {
    endMenu.style.display = 'block';
    changeLevel.style.display = 'none';
    if (timerSec > 9) {
        timer.textContent = `Твое время: ${timerMin}:${timerSec}`
    }
    else {
        timer.textContent = `Твое время: ${timerMin}:0${timerSec}`
    }
}

// Функция отрисовки графики
function Draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'purple';
    c.fillRect(player.x, player.y, player.width, player.height);
    for (let row = 0; row < currentLevel.length; row++) {
        for (let col = 0; col < currentLevel[0].length; col++) {
            if (currentLevel[row][col] === '1') {
                c.fillStyle = 'black';
                c.fillRect(col * 32, row * 32, 32, 32);
            }
            else if (currentLevel[row][col] === '2') {
                c.fillStyle = 'green';
                c.fillRect(col * 32, row * 32, 32, 32);
            }
        }
    }
}

// Функция управления персонажем
function Input() {
    if (65 in keysDown) {
        if (GetTitle((player.x - player.speed) + 1, player.y + 32) !== '1') {
            player.x -= player.speed;
        }
    }

    if (68 in keysDown) {
        if (GetTitle(((player.x + player.width) + player.speed) - 1, player.y + 32) !== '1') {
            player.x += player.speed;
        }
    }

    if (87 in keysDown && player.yke === 0) {
        if (GetTitle(player.x, player.y - 1) !== '1' && GetTitle(player.x + 32, player.y - 1) !== '1') {
            player.yke += player.jumpForce;
        }
    }
}

// Определение соприкосновения с коллизией победы
function WinGame() {
    if ((GetTitle(player.x, player.y + 64) === '2' || GetTitle(player.x, player.y + 32) === '2') ||
    (GetTitle(player.x + 32, player.y + 64) === '2' || GetTitle(player.x + 32, player.y + 32) === '2')
    ) {
        isWin = true;
    }
}

// Разбиение подготовленного уровня на детали
function Parse(lvl) {
    const lines = lvl.split('\n');
    const characters = lines.map(l => l.split(''));
    return characters;
}

// Определение коллизии объекта
function GetTitle(x, y) {
    return (currentLevel[Math.floor(y / 32)][Math.floor(x / 32)]);
}

// Определение потенциальной энергии относительно игры
function CalcGPE(obj) {
    return obj.mass * (9.8 / 1000000) * ((canvas.height - obj.height) - (obj.y / 32));
}

// Определение гравитации
function Gravity(obj) {
    obj.y -= obj.yke;
    obj.yke -= obj.gpe;
    obj.gpe = CalcGPE(obj);

    if (GetTitle(obj.x, obj.y) !== '0' || GetTitle(obj.x + 32, obj.y) !== '0') {
        if (obj.yke >= 0) {
            obj.yke = -0.5;
            obj.y += 1;
        }
    }
    else {
        if (GetTitle(obj.x + 32, (obj.y + 64)) !== '0' || GetTitle(obj.x, (obj.y + 64)) !== '0') {
            obj.yke = 0;
            obj.y -= (obj.y % 32);
        }
    }
}

// Карта уровня 1
const level1 = `11111111111111111111111111111111
11000000000000000000000000000011
10000000000000000000000000000001
10002000000000000000000000000001
11111111111000000000000000000001
10000000000000000000000000000001
10000000000000100000000000000001
10000000000000000000000000000001
10000000000000000001000000000001
10000000000000000000000100000001
10000000000000000000000011000001
10000000011000000000000000000001
10000000000000000000000000001111
10000100000000010000000000000001
10000000000000000000000011100001
10000000000000000001000000000001
10000000000000000000000000000001
11110000000000000000000000000001
10000000000011000000000000000001
10000001100000000000000000000001
10000000000000000000000000000001
10000000000000011100000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000100000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000111001
10000000000000000000000000000001
11000000000000000000000000000011
11111111111111111111111111111111`

// Карта уровня 2
const level2 = `11111111111111111111111111111111
11000000000000000000000000000011
10000000000000000000000000000001
10000000000000000000000000020001
10000000000000000000000111111111
10000000000000010001000000000001
10000000110000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
11000000000000000000000000000001
10000000000000000000000000000001
10000000011000000000000000000001
10000000000000000000000000000001
10000100000000010000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000001000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000001100000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000001111000001000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000011100000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000011100000000000001
10000000000000000000000000000001
11000000000000000000000000000011
11111111111111111111111111111111`

// Карта уровня 3
const level3 = `11111111111111111111111111111111
11000000000000000000000000000011
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000100001000000100000001
10000000000000000000000000000001
10000010000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10010000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000010000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10010000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10000000000000000000000000000001
10010000000000000000000000000001
10000000000000000000000000000201
10000000000000000000000000011111
10000000000000000000000000000001
10010000000000000000000000000001
10000000000000000000000000000001
10000110000000000000000000000001
10000000000000000000000000000001
11000000000000000000000000000011
11111111111111111111111111111111`
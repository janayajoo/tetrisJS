document.addEventListener("DOMContentLoaded", () => {
    createGridElements();

    /*
    REFERENCE:
    https://www.youtube.com/watch?v=rAUn1Lom6dw
    https://www.youtube.com/watch?v=A6fGMwRKy7k&t=167s
    https://parzibyte.me/blog/2020/11/02/tetris-javascript-open-source/
    https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1
     */

    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div"))
    const Score = document.querySelector("#score")
    const startBtn = document.querySelector("#start-btn")
    const leftBtn = document.querySelector("#move-left")
    const rightBtn = document.querySelector("#move-right")
    const rotCBtn = document.querySelector("#rotate-c")
    const rotCCBtn = document.querySelector("#rotate-cc")
    const downBtn = document.querySelector("#move-down")
    const resetBtn = document.querySelector("#reset-btn")

    const width = 10
    let currentPos = 4
    let currentRot = 0
    let nextRandom = 0
    let score = 0
    let timerId

    const colors = [
        'darkorange',
        'darkblue',
        'cadetblue',
        'magenta',
        'darkseagreen'
    ]

    const lShape = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2],
    ]

    const zShape = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tShape = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oShape = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iShape = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const shapes = [iShape, lShape, tShape, oShape, zShape]

    let random = Math.floor(Math.random()*shapes.length)
    // let randomColor = Math.floor(Math.random()*colors.length)
    let current = shapes[random][currentRot]

    // console.log(colors.length)
    function drawShape() {
        current.forEach(index => {
            squares[currentPos + index].classList.add("shapes")
            squares[currentPos + index].style.backgroundColor = colors[random]
        })
    }

    function undrawShape() {
        current.forEach(index => {
            squares[currentPos + index].classList.remove("shapes")
            squares[currentPos + index].style.backgroundColor = ''
        })
    }

    function control(e) {
        if(e.keyCode === 37) {
            moveL()
        } else if (e.keyCode === 38) {
            rotateC()
        } else if (e.keyCode === 39) {
            moveR()
        } else if (e.keyCode === 40) {
            rotateCC()
        } else if (e.keyCode === 83) {
            moveD()
        }
    }

    function moveD() {
        undrawShape()
        currentPos+=width
        drawShape()
        freeze()
    }

    function freeze() {
        if(current.some(index => squares[currentPos + index + width].classList.contains('end'))) {
            current.forEach(index => squares[currentPos + index].classList.add('end'))
            random = Math.floor(Math.random() * shapes.length)
            current = shapes[random][currentRot]
            currentPos = random
            drawShape()
            ScoreNumber()
            gameOver()
        }
    }

    function moveL() {
        undrawShape()
        const leftEdge = current.some(index => (currentPos + index) % width === 0)
        if(!leftEdge) {
            currentPos -= 1
        }
        if(current.some(index => squares[currentPos + index].classList.contains("end"))){
            currentPos += 1
        }
        drawShape()
    }

    function moveR() {
        undrawShape()
        const rightEdge = current.some(index => (currentPos + index) % width === width -1)
        if(!rightEdge) {
            currentPos += 1
        }
        if(current.some(index => squares[currentPos + index].classList.contains('end'))) {
            currentPos -=1
        }
        drawShape()
    }

    function rotateC() {
        undrawShape()
        currentRot ++
        if(currentRot === current.length) {
            currentRot = 0
        }
        current = shapes[random][currentRot]
        drawShape()
    }

    function rotateCC() {
        undrawShape();
        currentRot--;
        if (currentRot < 0) {
            currentRot = current.length - 1;
        }
        current = shapes[random][currentRot];
        drawShape();
    }

    function ScoreNumber() {
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('end'))) {
                score +=100
                Score.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('end')
                    squares[index].classList.remove('shapes')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPos + index].classList.contains('end'))) {
            ScoreNumber.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

    function resetGame() {
        clearInterval(timerId);
        timerId = null;
        score = 0;
        ScoreNumber.innerHTML = score;
        squares.forEach(square => {
            square.style.backgroundColor = '';
        });
        currentPos = 4;
        currentRot = 0;
        random = Math.floor(Math.random() * shapes.length);
        current = shapes[random][currentRot];
    }

    startBtn.addEventListener("click", () =>{
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } else {
            drawShape()
            timerId = setInterval(moveD, 1000)
            nextRandom = Math.floor(Math.random()*shapes.length)
        }
    })

    resetBtn.addEventListener("click", resetGame);
    document.addEventListener("keyup", control)
    leftBtn.addEventListener("click", moveL)
    rightBtn.addEventListener("click", moveR)
    downBtn.addEventListener("click", moveD)
    rotCBtn.addEventListener("click", rotateC)
    rotCCBtn.addEventListener("click", rotateCC)
})

function createGridElements() {
    const grid = document.querySelector('.grid');
    for (let i = 0; i < 200; i++) {
        const div = document.createElement('div');
        grid.appendChild(div);
    }
    for (let i = 0; i < 10; i++) {
        const div = document.createElement('div');
        div.classList.add('end');
        grid.appendChild(div);
    }
}



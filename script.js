const orientations = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];//八个方向


class Game {
    constructor(rowSize, colSize, ratio) {
        this.rowSize = rowSize;//表格的长
        this.colSize = colSize;//宽
        this.ratio = ratio;
        let cells = [];
        this.seconds=0;

        for (let i = 0; i < this.rowSize; i++) {//循环16
            let row = [];
            for (let j = 0; j < this.colSize; j++) {
                row.push({
                    el: null,//存放对象
                    value: null//用来装累
                });
            }
            cells.push(row);
        }
        this.cells = cells;
    }
    //shuffl用来布雷
    shuffle() {
        let mines = [];//雷的坐标
        for (let i = 0; i < this.rowSize; i++) {

            for (let j = 0; j < this.colSize; j++) {
                let cell = this.cells[i][j];
                if (Math.random() <= this.ratio) {
                    cell.value = -1;
                    mines.push([i, j]);
                } else {
                    cell.value = 0;
                }
            }
        }
        //计算是否又累
        for (let [i0, j0] of mines) {
            for (let [rowoffset, coloffset] of orientations) {
                let i1 = i0 + rowoffset, j1 = j0 + coloffset;
                if (i1 < 0 || i1 >= this.rowSize || j1 < 0 || j1 >= this.colSize) {
                    continue;
                }
                let cell = this.cells[i1][j1];
                if (cell.value === -1) {
                    continue;
                }
                
                cell.value += 1;
            }

        }
    }//相当于出现与所有的数字
    getCellValue(row, col) {
        return this.cells[row][col].value;
    }
    getCellElement(row,col){
        return this.cells[row][col].el;
    }
    setCellElement(row,col,element){
        this.cells[row][col].el=element;

    }

}



function renderTable(game) {

    let gameEl=document.querySelector('#game');
    gameEl.innerHTML='';

    let bannerEl=document.createElement('div');
    bannerEl.className='banner';
    gameEl.append(bannerEl);
    
    let secondsEl=document.createElement('div');
    secondsEl.className='seconds';
   
    bannerEl.append(secondsEl);

    game.timer=setInterval(()=>{
    game.seconds+=1;
    secondsEl.innerText=game.seconds;},1000);

    let boradEl=document.createElement('div');
    boradEl.className='game-borad';
    //let headerEl=document.createElement('div');没啥用了！！三句
     //headerEl.className='header';
    let tableEl=document.createElement('table');
     //boradEl.append(headerEl);
    boradEl.append(tableEl);
    gameEl.append(boradEl);

    // let tableEl = document.querySelector('.game-borad table');

    for (let i = 0; i < game.rowSize; i++) {
        let rowEl = document.createElement('tr');
        for (let j = 0; j < game.colSize; j++) {
            let tdEl = document.createElement('td');
            let cellEl = document.createElement('div');
            cellEl.className = 'cell';


            let value = game.getCellValue(i, j);

            if (value === -1) {                                                                                                                                                 
                cellEl.innerText = '*';
            } else if (value >= 1) {
                cellEl.innerText = value;
            }
            game.setCellElement(i, j, cellEl);

            cellEl.onclick = (e) => {
                handleClearAction(i,j,game,cellEl,tableEl);
            };
            tdEl.append(cellEl);
            rowEl.append(tdEl);
        }
        tableEl.append(rowEl);
    }
}




function handleExplodeAction(row,col,game,cellEl,tableEl){
    let value = game.getCellValue(row, col);
    cellEl.classList.add('exploded');
    tableEl.classList.add('exploded');
    let gameEl=document.querySelector('#game');
    let panelEl=document.createElement('div');
    panelEl.className='loser';
    gameEl.append(panelEl);
    panelEl.innerHTML=` <h3>你真的不行，${game.seconds}秒</h3>`;
    

    clearInterval(game.timer)

}
function handleClearAction(row,col,game,cellEl,tableEl){
    let value = game.getCellValue(row, col);
    if (value === -1) {
    handleExplodeAction(row,col,game,cellEl,tableEl)
    return;
    }
    if (value === 0) {
    clearcells(row, col, game, {});

    } else {
        cellEl.classList.add('clear');
    }
}


function clearcells(row, col,game, cleared) {
    cleared[`${row},${col}`] = true;
    game.getCellElement(row,col).classList.add('clear');

    for (let [rowoffset, coloffset] of orientations) {
        let i1 = row + rowoffset, j1 = col + coloffset;
        if (i1 < 0 || i1 >= game.rowSize|| j1 < 0 || j1 >= game.colSize) {
            continue;
        }

        let value = game.getCellValue(i1, j1);
        if (value===-1) {
            continue;
        }
        if (value >= 1) {
            game.getCellElement(i1,j1).classList.add('clear');
            continue;
        }
        if (cleared[`${i1},${j1}`]) {
            continue;
        }

        clearcells(i1, j1, game, cleared);


    }

}
function renderWelcome(){
    let gameEl=document.querySelector('#game');
    gameEl.innerHTML=`
    <div class='welcome'>
    <button id='level0'>初级</button>
    <button id='advance'>高級</button>
    </div>
    `;
    let buttonEl=gameEl.querySelector('button#level0');
    buttonEl.onclick=()=>{    
        let game = new Game(8, 6, 0.15);
    game.shuffle();
    renderTable(game);
 
    }
    buttonEl=gameEl.querySelector('button#advance');
    buttonEl.onclick=()=>{
    let game = new Game(16, 30, 0.15);
    game.shuffle();
    renderTable(game);}
}

renderWelcome();
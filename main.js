const width = 5;
const height = 5;
let groupNum;
const blockWidth = 14; //vh
const iconDiameter = 2.5; //vh
const iconMargin = 0.2; //vh
const rankHeight = 5;
const groupList = [];
let currentGroup = 1;
let groupsSet = false;
let destiny;
const puzzleList = ["高權1.jpg", "高權2.jpg", "林敬庭1題目.png","張鎧全1.png", "鄭東庭1.png", "鄭東庭2.png", "張子泓1.png",
"涂宇杰1.png", "涂宇杰2.png", "郭祐維1題目.png", "陳泯樺.jpg", "游子彥1.jpg", "游子彥2.jpg" ,"游子彥3.jpg" ,"楊秉哲1.jpg"
, "潘柏廷1.jpg", "鄭東庭1.jpg" ,"鄭東庭2.jpg"];
for (let i = 1; i<=12; i++) puzzleList.push(`puzzle${i}.jpg`);
const puzzleNum = puzzleList.length;

const generateGroups = () => {
    groupsSet = true;
    document.getElementById("set-groups-num").style.display = "none";
    document.getElementById("rank-board").style.display = "block";
  
    for (let i = 1; i <= groupNum; i++) {
        let group, r, g, b, x, y;
        if (localStorage.getItem("groupSet") === "true"){
            group = {
                number: i,
                color: localStorage.getItem("color"+i),
                darkenColor: localStorage.getItem("darkenColor"+i),
                at: Number(localStorage.getItem("at"+i)),
                pos: [Number(localStorage.getItem("x"+i)), Number(localStorage.getItem("y"+i))],
                score: Number(localStorage.getItem("score"+i))
            }
        }
        else{
            r = (Math.random()+1)*128;
            g = (Math.random()+1)*128;
            b = (Math.random()+1)*128;
            x = iconMargin + ((i-1)/5 | 0) * (iconDiameter + iconMargin);
            y = iconMargin + ((i-1) % 5) * (iconDiameter + iconMargin);
           
            group = {
                number: i,
                color: `rgb(${r},${g},${b})`,
                darkenColor: `rgb(${r*0.9},${g*0.9},${b*0.9})`,
                at: 1,
                pos: [x, y],
                score: 0
            };
            localStorage.setItem("color"+i, group.color);
            localStorage.setItem("darkenColor"+i, group.darkenColor);
            localStorage.setItem("at"+i, group.at);
            localStorage.setItem("x"+i, group.pos[0]);
            localStorage.setItem("y"+i, group.pos[1]);
            localStorage.setItem("score"+i, group.score);
        }
        groupList.push(group);
        //generate group icon
        let groupIcon = document.createElement("div");
        groupIcon.id = "icon" + i;
        groupIcon.className = "group-icon";
        groupIcon.style.backgroundColor = group.color;
        groupIcon.style.left = group.pos[0] + "vh";
        groupIcon.style.top = group.pos[1] + "vh";
        groupIcon.innerText = i;
        document.getElementById("board-container").append(groupIcon);
        //generate rank board
        let groupRank = document.createElement("div");
        groupRank.className = "group-rank";
        groupRank.id = "group" + i;
        groupRank.style.top = rankHeight*(i-1) + "vh";
        let numIcon = document.createElement("div");
        numIcon.className = "num";
        numIcon.style.backgroundColor = group.darkenColor;
        numIcon.innerText = i;
        let score = document.createElement("div");
        score.className = "score";
        score.style.backgroundColor = group.color;
        score.innerText = group.score;
        groupRank.append(numIcon, score);
        document.getElementById("group-rank-container").append(groupRank);
    }
    if (localStorage.getItem("groupSet") === "true"){
        changeRank();
        currentGroup = localStorage.getItem("currentGroup");
        document.getElementById("colored-num").innerText = currentGroup;
    }
    else{
        localStorage.setItem("groupSet", "true");
        localStorage.setItem("currentGroup", 1);
    }
}

const setGroupsNum = () => {
    let num = document.getElementById("groups-number-input").value
    if (/^\d+$/.test(num) && 1 <= num && num <= 25) {
        groupNum = num;
        localStorage.setItem("groupNum", num);
        generateGroups()
    }else {
        document.getElementById("error-message").innerText = "invalid input";
    }
}

const createBlock = (parent, num) => {
    let block = document.getElementById("template-block").cloneNode(true);
    block.id = "block" + num;
    let type = localStorage.getItem(block.id);
    if (type !== null){
        if (type[0] == "D"){
            block.classList.add("D");
            block.children[0].innerText = "!";
        }
        else if (type[0] == "Q"){
            block.classList.add("Q");
            block.children[0].innerText = `Q\nx${type.split(",")[1]}`;
        }
        else {
            block.classList.add("special");
            if (type.split(",")[1] === "roll again") block.classList.add("again");
            else if (type.split(",")[1] === "start") block.classList.add("start");
            else block.classList.add("pass");
            block.children[0].innerText = `${type.split(",")[1]}`;
        }
    }
    parent.append(block);
    document.querySelector(`#block${num} .Q-input`).id = "Q" + num;
    document.querySelector(`#block${num} .special-input`).id = "s" + num;
}

const generateBoard = () => {

    for (let i = 1; i <= width; i++) {
        createBlock(document.getElementById("top"), i);
        createBlock(document.getElementById("bottom"), width + height + i - 2);
    }

    for (let i = 1; i <= height-2; i++) {
        createBlock(document.getElementById("right"), width+i);
        createBlock(document.getElementById("left"), width*2 + height + i - 2);
    }

    if (localStorage.getItem("groupSet") === "true"){
        groupNum = Number(localStorage.getItem("groupNum"));
        generateGroups();
    }
}

const showOptions = (e) => {
    let selectionBox = e.parentNode.children[2];
    if (selectionBox.style.display !== "flex") selectionBox.style.display = "flex";
    else selectionBox.style.display = "none";
}

const setType = (e) => {
    if (e.id.length === 2 || e.id.length === 3) e = e.parentNode;
    let block = e.parentNode.parentNode
    if (e.className === "options select-Q"){
        block.className = "block Q";
        block.children[0].innerText = "Q";
        localStorage.setItem(block.id, "Q,1");
    }else if (e.className === "options select-D"){
        block.className = "block D";
        block.children[0].innerText = "!";
        block.children[2].style.display = "none";
        localStorage.setItem(block.id, "D");
    }else {
        block.className = "block special";
        localStorage.setItem(block.id, "s");
    }
}

const setText = (e, type) => {
    let num = e.id.substr(1);
    let block = document.getElementById("block" + num);
    if (type === "s") {
        block.children[0].innerText = e.value;
        if (e.value === "start") block.classList.add("start");
        else if (e.value=== "roll again") block.classList.add("again");
        else block.classList.add("pass");
        localStorage.setItem(`block${num}`, `special,${e.value}`)
    }else {
        document.getElementById("block" + num).children[0].innerText = `Q\nx${e.value}`;
        localStorage.setItem(`block${num}`, `Q,${e.value}`)
    }
    document.getElementById("block" + num).children[2].style.display = "none";
}


const changeRank = () => {
    groupList.sort((a,b) => b.score - a.score);
    for (let i = 0; i < groupList.length; i++) {
        document.getElementById("group" + groupList[i].number).style.top = i*rankHeight + "vh";
        document.querySelector(`#group${groupList[i].number} .score`).innerText = groupList[i].score;
        localStorage.setItem("score" + groupList[i].number, groupList[i].score);
    }
}

//dice

const diceNum = 3;

const generateDice = () => {
    for (let i = 2; i <= diceNum; i++){
        let dice = document.getElementById("dice1").cloneNode(true);
        dice.id = "dice" + i;
        document.getElementById("dice-container").append(dice);
    }
}

generateDice();

const findGroup = (n) => {
    for (let i = 0; i < groupNum; i++){
        if (groupList[i].number == n) return groupList[i];
    }
}


const openPuzzle = () => {
    document.getElementById("puzzle-container").style.display = "flex";
    let num = Math.random()*puzzleNum | 0;
    let runs = 0 // prevent infinite loop
    while (localStorage.getItem("puzzle" + num) === "used" || runs++ < 200){
        num = Math.random()*puzzleNum | 0;
    }
    localStorage.setItem("puzzle" + num, "used");
    document.querySelector(".image-container img").setAttribute("src", puzzleList[num]);
}


const openblock = (group) => {
    let block = document.getElementById(`block${group.at}`);
    if (block.classList.contains("D")){
        document.getElementById("destiny-container").style.display = "flex";
        destiny = Math.random()*6|0;
        document.getElementById("destiny" + destiny).style.display = "block";
        switch(destiny) {
            case 0:
                group.score += 30;
                break;
            case 1:
                group.score += 10;
                break;
            case 2:
                group.score -=10;
                break;
            case 3:
                group.score -= 30;
                break;
            case 4:
                groupList[0].score -= 20;
                groupList[groupNum-1].score += 20;
                break;
            case 5:
                groupList[groupNum-1].score += 30;
                break;
        }
        changeRank();
        currentGroup = (++currentGroup > groupNum)? 1: currentGroup;
        document.getElementById("colored-num").innerText = currentGroup;
        localStorage.setItem("currentGroup", currentGroup);
    }else if (block.classList.contains("pass") || block.classList.contains("start")){
        currentGroup = (++currentGroup > groupNum)? 1: currentGroup;
        document.getElementById("colored-num").innerText = currentGroup;
        localStorage.setItem("currentGroup", currentGroup);
    }else if (block.classList.contains("Q")) {
        openPuzzle();
    }
}

const closeDestiny = (e) => {
    e.children[destiny].style.display = "none";
    e.style.display = "none";
}

const move = (steps) => {
    group = findGroup(currentGroup);
    if (group.at < width){
        if (group.at + steps <= width) {
            group.pos[0] += steps * blockWidth;
            group.at += steps;
            document.getElementById("icon" + currentGroup).style.left = group.pos[0] + "vh";
            setTimeout(openblock, 1100, group);
        }else {
            let dif = width - group.at;
            group.pos[0] += dif * blockWidth;
            document.getElementById("icon" + currentGroup).style.left = group.pos[0] + "vh";
            group.at += dif;
            setTimeout(move, 1100, steps - dif);
        }
    }else if (group.at < width + height - 1) {
        if (group.at + steps <= width + height - 1) {
            group.pos[1] += steps * blockWidth;
            group.at += steps;
            document.getElementById("icon" + currentGroup).style.top = group.pos[1] + "vh";
            setTimeout(openblock, 1100, group);
        }else {
            let dif = width + height - 1 - group.at;
            group.pos[1] += dif * blockWidth;
            document.getElementById("icon" + currentGroup).style.top = group.pos[1] + "vh";
            group.at += dif;
            setTimeout(move, 1100, steps - dif);
        }
    }else if (group.at < width*2 + height - 2) {
        if (group.at + steps <= width*2 + height - 2) {
            group.pos[0] -= steps * blockWidth;
            group.at += steps;
            document.getElementById("icon" + currentGroup).style.left = group.pos[0] + "vh";
            setTimeout(openblock, 1100, group);
        }else {
            let dif = width*2 + height - 2 - group.at;
            group.pos[0] -= dif * blockWidth;
            document.getElementById("icon" + currentGroup).style.left = group.pos[0] + "vh";
            group.at += dif;
            setTimeout(move, 1100, steps - dif);
        }
    }else {
        if (group.at + steps <= width*2 + height*2 - 3) {
            group.pos[1] -= steps * blockWidth;
            group.at += steps;
            if (group.at === width*2 + height*2 - 3){
                group.at = 1;
                group.score += 20;
                changeRank();
            }
            document.getElementById("icon" + currentGroup).style.top = group.pos[1] + "vh";

            setTimeout(openblock, 1100, group);
        }else {
            let dif = width*2 + height*2 - 3 - group.at;
            group.pos[1] -= dif * blockWidth;
            document.getElementById("icon" + currentGroup).style.top = group.pos[1] + "vh";
            group.at = 1;
            changeRank();
            setTimeout(move, 1100, steps - dif);
        }
    }
    localStorage.setItem("x"+currentGroup, group.pos[0]);
    localStorage.setItem("y"+currentGroup, group.pos[1]);
    localStorage.setItem("at"+currentGroup, group.at);
}

const rollDice = () => {
    if (!groupsSet) return;
    let totalStep = 0;
    for (let i = 1; i <= diceNum; i++){
        let dice = document.getElementById("dice" + i)
        let step = Math.floor((Math.random() * 6) + 1);
        while (step == dice.className[dice.className.length-1]) step = Math.floor((Math.random() * 6) + 1);
        totalStep += step;
        for (let j = 1; j <= 6; j++) {
            dice.classList.remove('show-' + j);
            if (step === j) {
              dice.classList.add('show-' + step);
            }
          }
    }   
    move(totalStep);
}

const setPuzzleScore = () => {
    let mult = localStorage.getItem(`block${findGroup(currentGroup).at}`).split(",")[1];
    let correctGroups = [...document.getElementById("correct-groups").value.matchAll(/\d+/g)].map(e => findGroup(e[0]))
    let total = correctGroups.length;
    for (let group of correctGroups){
        group.score += Math.round((20*parseInt(mult))*100)/100;
    }
    if (document.getElementById("contributor").value.match(/\d+/)){
        let contributorGroup = findGroup(document.getElementById("contributor").value);
        contributorGroup.score += (total === groupNum-1 || total === 0)? -10 : Math.round((30*total/(groupNum-1))*100)/100;
    }
   
    changeRank();
    document.getElementById("puzzle-container").style.display = "none";
    currentGroup = (++currentGroup > groupNum)? 1: currentGroup;
    document.getElementById("colored-num").innerText = currentGroup;
    localStorage.setItem("currentGroup", currentGroup);
    console.log(currentGroup);
}

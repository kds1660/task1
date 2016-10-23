"use strict";
var circle = document.getElementById("firstYellowCircle");
var cross = document.getElementById("firstYellowCross");
var winArray = [];
var tabNumber = 6;
var winNumber = 4;
//start initialisation
createTable(tabNumber);
initBox();
initArray(tabNumber);

function createTable(rowcolsNum) {
    var myTable = document.createElement('table');
    var wrapper = document.getElementById('myWrapper');
    myTable.setAttribute('id', 'myTab');

    for (var i = 0; i < rowcolsNum; i++) {
        var newRow = myTable.insertRow(i);
        for (var j = 0; j < rowcolsNum; j++) {
            var newCell = newRow.insertCell(j);
            newCell.innerHTML = '<div class="box"></div>';
        }
    }
    wrapper.appendChild(myTable);
}

function initBox() {
    var elements = document.getElementsByClassName('box');

    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('ondrop', "dropImg(event)");
        elements[i].setAttribute('ondragover', "makeDroppable(event)");
    }
}

function initArray(tabNumber) {

    for (var i = 0; i < tabNumber; i++) {
        winArray[i] = [];

        for (var j = 0; j < tabNumber; j++) {
            winArray[i][j] = 0;
        }
    }
}

function clearButton() {
    var elements = document.getElementsByClassName('clone');

    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    //clear array
    initArray(tabNumber);
    var dragStartText = "event.dataTransfer.setData('text/plain',event.target.id)";
    circle.classList.remove('active');
    cross.classList.remove('active');
    circle.setAttribute('ondragstart', dragStartText);
    cross.setAttribute('ondragstart', dragStartText);
    circle.setAttribute('dragable', 'true');
    cross.setAttribute('dragable', 'true');
}

function makeDroppable(e) {
    e.preventDefault();
}

function dropImg(event) {
    event.preventDefault();
    //prevent adding element in box, if it already have element
    var data = event.dataTransfer.getData('text/plain');
    var moveElement = document.getElementById(data);
    var boxArea = event.target;
    var curCell = boxArea.parentNode.cellIndex;
    var curRow = boxArea.parentNode.parentNode.rowIndex;
    var curElement;

    cloneSelected(event.target);
    detectElementToArray(boxArea);
    winArray[curRow][curCell] = curElement;
    checkWin(winArray);

    if (data === 'firstYellowCircle') {
        selectNextElement('firstYellowCross', 'firstYellowCircle');
    }

    if (data === 'firstYellowCross') {
        selectNextElement('firstYellowCircle', 'firstYellowCross');
    }

    function cloneSelected(target) {
        if (target.className === 'box' && moveElement) {
            var cloneElement = moveElement.cloneNode();

            for (var i = 1; i < 25; i++) {

                if (!document.getElementById(data + i)) {
                    cloneElement.id = cloneElement.id + i;
                    break;
                }
            }

            cloneElement.removeAttribute('ondragstart');
            cloneElement.removeAttribute('dragable');
            cloneElement.classList.remove('active');
            boxArea.appendChild(cloneElement);
            cloneElement.classList.add('clone');
        }
    }

    function detectElementToArray(el) {

        if (el.firstChild && el.firstChild.classList.contains('circle')) {
            curElement = 'circle';
        }

        if (el.firstChild && el.firstChild.classList.contains('cross')) {
            curElement = 'cross';
        }
    }

    function selectNextElement(activate, deactivate) {
        activate = document.getElementById(activate);
        deactivate = document.getElementById(deactivate);
        var newDrag = "event.dataTransfer.setData('text/plain',event.target.id)";
        deactivate.parentNode.classList.remove('active');
        activate.parentNode.classList.add('active');
        deactivate.removeAttribute('ondragstart');
        deactivate.removeAttribute('dragable');
        activate.setAttribute('ondragstart', newDrag);
        activate.setAttribute('dragable', 'true');
    }
}

function checkWin(arrayElement) {

    function gorizontWin() {
        for (var i = 0; i < tabNumber; i++) {
            var tempGorizontal = 1;

            for (var j = 0; j < tabNumber; j++) {

                if (arrayElement[i][j] === arrayElement[i][j + 1] && typeof arrayElement[i][j] == 'string') {
                    tempGorizontal++;

                    if (tempGorizontal === winNumber) {
                        alert(arrayElement[i][j] + ' WIN');
                        clearButton();
                    }
                } else {
                    tempGorizontal = 1;
                }
            }
        }
    }

    function verticalWin() {

        for (var i = 0; i < tabNumber; i++) {
            var tempVertical = 1;

            for (var j = 0; j < tabNumber; j++) {

                if (j + 1 < tabNumber && arrayElement[j][i] === arrayElement[j + 1][i] && typeof arrayElement[j][i] == 'string') {
                    tempVertical++;

                    if (tempVertical === winNumber) {
                        alert(arrayElement[j][i] + ' WIN');
                        clearButton();
                    }
                } else {
                    tempVertical = 1;
                }
            }
        }
    }

    function diagonalWin(direction) {
        for (var i = 0; i < tabNumber; i++) {
            var tempDiagonal = 1;

            for (var j = 0; j < tabNumber; j++) {

                for (var k = 1; k < tabNumber - 1; k++) {
                    var z = k * direction;

                    if (j + z >= 0 && i + Math.abs(z) < tabNumber && (z < 0 || (j + z) < tabNumber ) &&
                    arrayElement[i][j] === arrayElement[i + Math.abs(z)][j + z] &&
                    typeof arrayElement[i + Math.abs(z)][j + z] == 'string') {
                        tempDiagonal++;

                        if (tempDiagonal === winNumber) {
                            alert(arrayElement[i][j] + ' WIN');
                            clearButton();
                        }
                    } else {
                        tempDiagonal = 1;
                    }
                }
            }
        }
    }

    diagonalWin(1);
    diagonalWin(-1);
    gorizontWin();
    verticalWin();
}

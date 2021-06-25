'use strict'
let startBtn = document.getElementById('start-btn'),
    pauseBtn = document.getElementById('pause-btn'),
    splitBtn = document.getElementById('split-btn'),
    resetBtn = document.getElementById('reset-btn'),
    logTableDiv = document.getElementById('log-table-cont'),
    tableBody= document.getElementsByTagName('tbody')[0],
    timeDiv     = document.getElementsByClassName('time')[0],
    splitTimeDiv = document.getElementsByClassName('split-time')[0],
    srNo    = 1,
    interval      = null,
    splitInterval = null;
    
const time = {
        hh: 0,
        mm: 0,
        ss: 0
    },
    splitTime = {
        hh: 0,
        mm: 0,
        ss: 0,
        ms: 0,
    },
    splitGen = splitGenerator(),
    incrementMilliSec = (() => {
        let ms = 0;
        return (increment) => {ms = increment ? ms+4 : 0; return ms;}
    })(),
    makeTwoDigits   = timeUnits => timeUnits.map(timeUnit => timeUnit > 9 ? timeUnit : `0${timeUnit}`),
    makeThreeDigits = timeUnits => timeUnits.map(timeUnit => timeUnit > 99 ? timeUnit : timeUnit > 9 ? `0${timeUnit}` : `00${timeUnit}`);
    
startBtn.addEventListener('click', startBtnClicked);
pauseBtn.addEventListener('click', pauseBtnClicked);
resetBtn.addEventListener('click', resetBtnClicked);
splitBtn.addEventListener('click', splitBtnClicked);

pauseBtn.style.display = 'none';

function startBtnClicked(){
    hideShowBtn(startBtn);
    hideShowBtn(pauseBtn);
    
    startTimer();
    startSplitTimer();

    resetBtn.classList.remove('reset');
    splitBtn.classList.add('split');
    
    splitBtn.disabled = false;
    resetBtn.disabled = true;
}

function pauseBtnClicked(){
    hideShowBtn(startBtn);
    hideShowBtn(pauseBtn);
    
    logTime('Pause');
    stopTimers();

    resetBtn.classList.add('reset');
    splitBtn.classList.remove('split');

    splitBtn.disabled = true;
    resetBtn.disabled = false;
}

function splitBtnClicked(){
    logTime('Split');
    resetTime(splitTime);
}

function resetBtnClicked(){
    incrementMilliSec(false);
    resetTime(time);
    resetTime(splitTime);
    clearLogTable();

    timeDiv.innerHTML = '00:00:00:000';
    splitTimeDiv.innerHTML = 'SPLIT TIME';
    resetBtn.classList.remove('reset');

    resetBtn.disabled = true;
}

function resetTime(time) { 
    for(let timeUnit of Object.keys(time))
        time[timeUnit] = 0
}

function hideShowBtn(btn) {
    btn.style.display = btn.style.display === "none" ? "unset" : "none";
}

function startTimer() {
    interval = setInterval(()=>{
        let ms = incrementMilliSec(true);
        if(ms > 999) incrementMilliSec(false);
        updateTimeElement(ms, time, timeDiv);
    }, 4);
}

function startSplitTimer() {
    splitInterval = setInterval(()=>{
        let ms = splitGen.next().value; 
        if(ms > 999) splitTime.ms = 0;
        updateTimeElement(ms, splitTime, splitTimeDiv);
    }, 4);
}

function stopTimers(){
    clearInterval(interval);
    clearInterval(splitInterval);
}

function updateTimeElement(ms, time, timeElement){
    if(ms > 999){
        ms = 0;
        time.ss++;
    }
    if(time.ss > 59) {
        time.mm++;
        time.ss = 0;
    }
    if(time.mm > 59) {
        time.hh++;
        time.mm = 0;
    } 
    let [hours, minutes, seconds] = makeTwoDigits(Object.values(time)),
        [mseconds] = makeThreeDigits([ms]);
    timeElement.innerHTML = `${hours}:${minutes}:${seconds}.${mseconds}`; 
}

function* splitGenerator(){
    while(true){
        splitTime.ms = splitTime.ms+4;
        yield splitTime.ms;
    }
}

function logTime(pauseOrSplit){
    const row   = tableBody.insertRow(),
          cell1 = row.insertCell(0),
          cell2 = row.insertCell(1),
          cell3 = row.insertCell(2),
          srNoNode = document.createTextNode(`#${srNo}`),
          timeNode = document.createTextNode(timeDiv.innerHTML),
          pauseOrSplitNode = document.createTextNode(pauseOrSplit);
        
    cell1.appendChild(srNoNode);
    cell2.appendChild(timeNode);
    cell3.appendChild(pauseOrSplitNode);
    cell2.style.color = pauseOrSplit === 'Pause' ? '#fb657f' : '#f29e26';
    srNo++;

    logTableDiv.scrollTop = logTableDiv.scrollHeight;
}

function clearLogTable() {
    const new_tbody = document.createElement('tbody');
    tableBody.parentNode.replaceChild(new_tbody, tableBody);
    tableBody= document.getElementsByTagName('tbody')[0];
    srNo = 1;
}
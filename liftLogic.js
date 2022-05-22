let currLiftPositionArr = []
let noOfFloors
let noOfLifts
let liftCallsQueue = []
let intervalId
let allLiftInfo

document.getElementById('submit').addEventListener('click',(e)=>{
    e.preventDefault()
    startVirtualSimulation ()
})

function startVirtualSimulation () {
    clearInterval(intervalId)
    if (validateLiftAndFloorEntries()) {
        generateFloors(noOfFloors)
        generateLifts(noOfLifts)
        addButtonFunctionalities()
        intervalId = setInterval(fullfillLiftCallsQueue,1000)
    }
}

const validateLiftAndFloorEntries = ()=>{
    
    noOfFloors = document.getElementById('noOfFloors').value
    noOfLifts = document.getElementById('noOfLifts').value
    // console.log(`noOfFloors is ${noOfFloors.value} and noOfLifts is ${noOfLifts}`)
    
    if (isNaN(noOfFloors)) {
        alert('enter a valid no of Floor')
        return 0
    }
    noOfFloors = parseInt(noOfFloors)
    if (noOfFloors > 10) {
        alert('Only 10 Floor are supported in the app currently !!')
        return 0
    }
    
    if (isNaN(noOfLifts)) {
        alert('enter a valid no of Lifts')
        return 0
    }
    noOfLifts = parseInt(noOfLifts)
    if (noOfLifts > 10) {
        alert('Only 10 Lifts are supported in the app currently !!')
        return 0
    }
    return 1
}


const generateFloors = (n)=> {
    // console.log(document.getElementById('simulationArea').innerHTML)
    document.getElementById('simulationArea').innerHTML = ''
    for (let i=0;i<n;i++) {
        let currLevel = `L${n-i-1}`
        let floorNo = `Level-${n - i - 1}`
        let currFloor = document.createElement('div')
        currFloor.setAttribute('id',floorNo)

        // console.log(document.getElementById(floorNo))
        currFloor.classList.add('floor')
        currFloor.innerHTML = `
        <p>${floorNo}</p>
        <div>
        <button id=up${currLevel} class="button-floor upBttn">🔼</button>
        <button id=down${currLevel} class="button-floor downBttn">🔽</button>
        </div>
        `;
        // console.log(currFloor)
        document.getElementById('simulationArea').appendChild(currFloor);
    }
}

function addButtonFunctionalities () {
    const allButtons = document.querySelectorAll('.button-floor')
    allButtons.forEach(btn => {
        btn.addEventListener('click', ()=>{
            const targetFlr = parseInt(btn.id.slice(-1))
            liftCallsQueue.push(targetFlr)
        })
    })
}

function translateLiftOld(liftNo,targetLiftPosn) {
    const reqLift = document.getElementById(`Lift-${liftNo}`)
    let currLiftPosn = parseInt(currLiftPositionArr[liftNo])
    // const targetLiftPosn = currLiftPositionArr[liftNo]
    var anim = setInterval(animate,100)
    
    function animate () {
        // console.log(`liftNo is ${liftNo}, currLiftPosn is ${currLiftPosn},targetLiftPosn is ${targetLiftPosn}`)
        
        if (currLiftPosn != targetLiftPosn) {  
            stepVector = parseInt(Math.sign(targetLiftPosn - currLiftPosn))
            currLiftPosn += stepVector
            let intermediateFloor = `${(currLiftPosn)* -100}px`;
            // reqLift.style.top = intermediateFloor
            reqLift.style.transform = `translateY(-100px)`;
            reqLift.style.transitionDuration = `2s`;
        } else {
            currLiftPositionArr[liftNo] = targetLiftPosn
            clearInterval(anim)
        }
    }
}

function translateLift(liftNo,targetLiftPosn) {
    const reqLift = document.getElementById(`Lift-${liftNo}`)
    let currLiftPosn = parseInt(currLiftPositionArr[liftNo])

    if (currLiftPosn != targetLiftPosn) {
        allLiftInfo[liftNo].inMotion = true
        let unitsToMove = parseInt(Math.abs(targetLiftPosn - currLiftPosn)+1)
        let motionDis = -100 * parseInt(targetLiftPosn)
        // console.log(`dis is ${motionDis}`)
        reqLift.style.transitionTimingFunction = 'linear'
        reqLift.style.transform = `translateY(${motionDis}px)`;
        reqLift.style.transitionDuration = `${unitsToMove*2}s`;
        
        let timeInMs = unitsToMove*2000
        setTimeout(()=>{
            currLiftPositionArr[liftNo] = targetLiftPosn
            animateLiftsDoors(liftNo)
        },timeInMs)
    } else {
        allLiftInfo[liftNo].inMotion = true
        animateLiftsDoors(liftNo)
    }
}

function animateLiftsDoors (liftNo) {
    const leftGate = document.getElementById(`L${liftNo}left_gate`)
    const rightGate = document.getElementById(`L${liftNo}right_gate`)
    leftGate.classList.toggle('animateLiftsDoorsOnFloorStop');
    rightGate.classList.toggle('animateLiftsDoorsOnFloorStop');
    
    setTimeout(()=>{
        allLiftInfo[liftNo].inMotion = false
        leftGate.classList.toggle('animateLiftsDoorsOnFloorStop');
        rightGate.classList.toggle('animateLiftsDoorsOnFloorStop');
    },5000)
}

function findNearestFreeLift(flrNo) {
    
    // console.log(flrNo,currLiftPositionArr)
    let prevDiff = Number.MAX_SAFE_INTEGER;
    let nearestAvailableLift = -1
    // console.log(currLiftPositionArr,flrNo)
    for (let i=0;i<currLiftPositionArr.length;i++) {
        if (allLiftInfo[i].inMotion === false)  {
            const currDiff = Math.abs(currLiftPositionArr[i] - flrNo)
            if (currDiff < prevDiff ) {
                prevDiff = currDiff
                nearestAvailableLift = i
            }
        }
    }
    // console.log(`nearestAvailableLift is ${nearestAvailableLift}`)
    return nearestAvailableLift
}

const generateLifts = (n)=> {
    allLiftInfo = []
    for (let i=0;i<n;i++) {
        let liftNo = `Lift-${i}`
        const currLift = document.createElement('div');
        currLift.setAttribute('id',liftNo)
        currLift.classList.add('lifts');
        currLift.innerHTML = `
            <p>Lift${i+1}</p>
            <div class="gate gateLeft" id="L${i}left_gate"></div>
            <div class="gate gateRight" id="L${i}right_gate"></div>
        `;
        currLift.style.left = `${(i+1)*90}px`;
        currLift.style.top = '0px'
        document.getElementById('Level-0').appendChild(currLift);
        currLiftPositionArr[i] = 0
        
        const currliftDetail = {}
        currliftDetail.id = liftNo
        currliftDetail.inMotion = false
        allLiftInfo.push(currliftDetail)
    }
}

function fullfillLiftCallsQueue () {
    if (!(liftCallsQueue.length)) return;
    let targetFlr = liftCallsQueue[0]

    const liftToMove = findNearestFreeLift(targetFlr)   
    if (liftToMove != -1) {
        translateLift(liftToMove,targetFlr)
        liftCallsQueue.shift()
    }

}
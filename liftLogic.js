let currLiftPositionArr = []

const validateLiftAndFloorEntries = (e)=>{
    
    let noOfFloor = document.getElementById('noOfFloor').value
    let noOfLifts = document.getElementById('noOfLifts').value
    // console.log(`noOfFloor is ${noOfFloor.value} and noOfLifts is ${noOfLifts}`)
    
    if (isNaN(noOfFloor)) {
        alert('enter a valid no of Floor')
        return
    }
    noOfFloor = parseInt(noOfFloor)
    if (noOfFloor > 10) {
        alert('Only 10 Floor are supported in the app currently !!')
        return
    }
    genrateFloors(noOfFloor)
    
    if (isNaN(noOfLifts)) {
        alert('enter a valid no of Lifts')
        return
    }
    noOfLifts = parseInt(noOfLifts)
    if (noOfLifts > 10) {
        alert('Only 10 Lifts are supported in the app currently !!')
        return
    }
    generateLifts(noOfLifts)
}

document.getElementById('submit').addEventListener('click',(e)=>{
    e.preventDefault()
    validateLiftAndFloorEntries()})

const genrateFloors = (n)=> {
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
        <button id=up${currLevel} class="button upBttn">🔼</button>
        <button id=down${currLevel} class="button downBttn">🔽</button>
        </div>
        `;
        // console.log(currFloor)
        document.getElementById('simulationArea').appendChild(currFloor);
    }
    allButtons = document.querySelectorAll('.button')
    allButtons.forEach(btn => {
        btn.addEventListener('click', ()=>{
            const targetFlr = parseInt(btn.id.slice(-1))
            const liftToMove = findNearestFreeLift(targetFlr)
            // console.log(`liftToMove is ${liftToMove}`)
            if (liftToMove != -1) {
                translateLift(liftToMove,targetFlr)
            }
        })
    })
}

function translateLift(liftNo,targetLiftPosn) {
    const reqLift = document.getElementById(`Lift-${liftNo}`)
    let currLiftPosn = parseInt(currLiftPositionArr[liftNo])
    // const targetLiftPosn = currLiftPositionArr[liftNo]
    var anim = setInterval(animate,5)
    
    function animate () {
        // console.log(`liftNo is ${liftNo}, currLiftPosn is ${currLiftPosn},targetLiftPosn is ${targetLiftPosn}`)

        if (currLiftPosn != targetLiftPosn) {  
            stepVector = parseInt(Math.sign(targetLiftPosn - currLiftPosn))
            currLiftPosn += stepVector
            let intermediateFloor = `${(currLiftPosn)*-100}px`;
            reqLift.style.top = intermediateFloor
        } else {
            currLiftPositionArr[liftNo] = targetLiftPosn
            clearInterval(anim)
        }
    }
    
}

function findNearestFreeLift(flrNo) {
    
    // console.log(flrNo,currLiftPositionArr)
    let prevDiff = Number.MAX_SAFE_INTEGER;
    let nearestAvailableLift = -1
    // console.log(currLiftPositionArr,flrNo)
    for (let i=0;i<currLiftPositionArr.length;i++) {
        const currDiff = Math.abs(currLiftPositionArr[i] - flrNo)
        if (currDiff < prevDiff && currDiff != 0) {
            prevDiff = currDiff
            nearestAvailableLift = i
        }
    }
    // console.log(`nearestAvailableLift is ${nearestAvailableLift}`)
    return nearestAvailableLift
}

const generateLifts = (n)=> {
    for (let i=0;i<n;i++) {
        let liftNo = `Lift-${i}`
        const currLift = document.createElement('div');
        currLift.setAttribute('id',liftNo)
        currLift.classList.add('lifts');
        currLift.innerHTML = `
            <p>Lift${i+1}</p>
            <div class="lift" id="lift"></div>
        `;
        currLift.style.left = `${(i+1)*90}px`;
        currLift.style.top = '0px'
        document.getElementById('Level-0').appendChild(currLift);
        currLiftPositionArr[i] = 0
    }
}

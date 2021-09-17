const headerControl = document.querySelector(".header-control");
const img = document.querySelector(".img-frame > img");
const maxZoom = 2;
const minZoom = 1;
const scaleRate = .25;

// Variables
var transforms = [];
var currScale = 1;
var isMoving = false;
var movementEventExecution = 0;
var mouseMovement = {"initialX": 0, "initialY": 0, "x": 0, "y": 0};
var rotationTime = 0;

// Functions
function checkScale() {
    if(currScale > maxZoom)
        currScale = maxZoom
    if(currScale < minZoom)
        currScale = minZoom
}

function resetImageMovement(fullReset = false) {
    mouseMovement.initialX = 0;
    mouseMovement.initialY = 0;
    movementEventExecution = 0;
    if (fullReset) {
        mouseMovement.x = 0;
        mouseMovement.y = 0;
        resetTranslate();
    }
}

function toggleHeader(e) {
    if(e.offsetY <= headerControl.clientHeight + 10)
        headerControl.classList.add("active");
    else 
        headerControl.classList.remove("active");
}

function zoomImage() {
    let existingTransform = transforms.find(el => el.includes("scale"));
    let transform = `scale(${currScale},${currScale})`
    if(existingTransform){
        let index = transforms.indexOf(existingTransform);
        transforms[index] = transform
    }
    else {
        transforms.push(transform)
    }
    img.style.transform = transforms.join(" ");
}

function translateImage(e) {
    if(img.offsetWidth * currScale > window.innerWidth)
        mouseMovement.x = e.offsetX - mouseMovement.initialX;
    if(img.offsetHeight * currScale > window.innerHeight)
        mouseMovement.y = e.offsetY - mouseMovement.initialY;
    movementEventExecution++;

    if (movementEventExecution > 40 && (mouseMovement.x != 0 || mouseMovement.y != 0)) {
        let existingTransform = transforms.find(el => el.includes("translate"));
        let newTransform = `translate(${mouseMovement.x}px,${mouseMovement.y}px)`;
        movementEventExecution = 0;
        if(existingTransform) {
            let index = transforms.indexOf(existingTransform);
            transforms[index] = newTransform;
        }
        else {
            transforms.push(newTransform);
        }

        img.style.transform = transforms.join(" ");
    }
}

function resetTranslate() {
    let existingTransform = transforms.find(el => el.includes("translate"));
    let newTransform = `translate(${0}px,${0}px)`;
    if(existingTransform) {
        let index = transforms.indexOf(existingTransform);
        transforms[index] = newTransform;
    }
    else {
        transforms.push(newTransform);
    }
    img.style.transform = transforms.join(" ");
}

// Events
document.querySelector(".control-frame").addEventListener('mousemove', e => {
    e.stopPropagation();
    toggleHeader(e);
    if(isMoving)
        translateImage(e);
})

document.querySelector(".control-frame").addEventListener("mousedown", e => {
    mouseMovement.initialX = e.offsetX - mouseMovement.x
    mouseMovement.initialY = e.offsetY - mouseMovement.y
    isMoving = true;
})

document.querySelector(".control-frame").addEventListener("mouseup", e => {
    resetImageMovement();
    isMoving = false;
})


document.querySelector("#zoom-in").addEventListener("click", e => {
    currScale += scaleRate;
    checkScale();
    resetImageMovement(true);
    zoomImage();
})

document.querySelector("#zoom-out").addEventListener("click", e => {
    currScale -= scaleRate;
    checkScale();
    resetImageMovement(true);
    zoomImage();
})

document.querySelector("#rotate").addEventListener("click", e => {
    rotationTime++;
    let rotation = 90 * rotationTime
    if(rotation >= 360){
        rotationTime = 0;
    }

    let existingTransform = transforms.find(el => el.includes("rotate"));
    let newTransform = `rotate(${rotation}deg)`;

    if(existingTransform) {
        let index = transforms.indexOf(existingTransform);
        transforms[index] = newTransform;
    }
    else {
        transforms.push(newTransform);
    }

    img.style.transform = transforms.join(" ");
})
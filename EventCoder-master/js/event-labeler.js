// Loading YouTube API
let tag = document.createElement("script");
tag.src = "https://www.youtube.com/player_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player("analysis-video", {
        videoId: "4LvwsQ22yAY",
        events: {
            "onReady": onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.stopVideo();
}

// Displaying YouTube Upload Options
let uploadFromYouTubeButton = document.getElementById("upload-from-youtube-button");
uploadFromYouTubeButton.addEventListener("click", displayUploadForm);
function displayUploadForm() {
    document.getElementById("paste-from-youtube-section").style.display = "block";
}

// Displaying Additional Desktop Controls
let desktopUploadButton = document.getElementById("upload-from-desktop-button");
desktopUploadButton.addEventListener("click", hideYouTubeUploadForm);
function hideYouTubeUploadForm() {
    document.getElementById("paste-from-youtube-section").style.display = "none";
}

// Handling Requested YouTube Video
let urlForm = document.getElementById("paste-from-youtube-form");
let submitButton = document.getElementById("paste-from-youtube-submit");
submitButton.addEventListener("click", processRequestedVideo);
function processRequestedVideo() {
    event.preventDefault();
    document.getElementById("save-drawing-button").style.display = "none";
    document.getElementById("replay-with-drawings-button").style.display = "none";
    if (urlForm.value == "") {
        alert("URL field cannot be empty!");
    } else {
        formatUrl();
    }
}

// Validating Requested YouTube Video
function formatUrl() {
    let url = urlForm.value;

    let checkUrlValidity = url.indexOf("youtube.com/watch?v=");
    if (checkUrlValidity == -1) {
        alert("Video cannot be found.");
    } else {

        let preEmbedLocation = url.indexOf("v=");
        let videoId = url.substr(preEmbedLocation + 2, preEmbedLocation + 13);
        
        let previousIframes = document.querySelectorAll("iframe");
        for (let i = 0; i < previousIframes.length; i++) {
            previousIframes[i].parentNode.removeChild(previousIframes[i]);
        }

        document.getElementById("paste-from-youtube-section").style.display = "none";
        document.getElementById("user-video").style.display = "none";

        insertNewYouTubeVideo(videoId);

    }
    urlForm.value = "";
}

// Inserting Valid YouTube Video
function insertNewYouTubeVideo(videoId) {
    let newYouTubeVideo = document.createElement("div");
    newYouTubeVideo.setAttribute("id", "analysis-video");
    newYouTubeVideo.style.display = "inline";
    document.getElementById("videos").append(newYouTubeVideo);

    player = new YT.Player("analysis-video", {
        videoId: videoId,
        events: {
            "onReady": onPlayerReady
        }
    });
}

// Uploading Video from Desktop
function uploadDesktopVideoAndDisplayAdditionalOptions(self) {

    document.getElementById("user-video").style.display = "inline";
    document.getElementById("analysis-video").style.display = "none";

    let file = self.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
        let src = event.target.result;
        let video = document.getElementById("user-video");
        let source = document.getElementById("supported-source");
        source.setAttribute("src", src);
        video.load();

        let desktopButtons = document.getElementsByClassName("desktop-button");
        for (let i = 0; i < desktopButtons.length - 2; i++) {
            desktopButtons[i].style.display = "block";
        }
    };
    reader.readAsDataURL(file);
}

// Canvas Functionality
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let coordinates = { x: 0, y: 0 };

canvas.addEventListener("mousedown", beginDraw);
canvas.addEventListener("mouseup", endDraw);

function beginDraw(event) {
    document.addEventListener("mousemove", executeDraw);
    repositionCursor(event);
}

function repositionCursor(event) {

    let rectangle = document.getElementById("canvas").getBoundingClientRect();
    let x = ((event.clientX - rectangle.left) / document.getElementById("canvas").offsetWidth);
    let y = ((event.clientY - rectangle.top) / document.getElementById("canvas").offsetHeight);

    // Adjusting Dimensions
    coordinates.x = 300 * x;
    coordinates.y = 150 * y;
}

function endDraw() {
    document.removeEventListener("mousemove", executeDraw);
}

function executeDraw(event) {
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.lineCap = "round";
    context.lineWidth = 1.25;

    context.moveTo(coordinates.x, coordinates.y);
    repositionCursor(event);
    context.lineTo(coordinates.x, coordinates.y);
    context.stroke();
}

document.getElementById("activate-canvas-button").addEventListener("click", makeCanvasEditable);
function makeCanvasEditable() {
    document.getElementById("user-video").pause();
    player.pauseVideo();
    document.getElementById("canvas").style.zIndex = 10;
}

document.getElementById("deactivate-canvas-button").addEventListener("click", hideCanvas);
function hideCanvas() {
    document.getElementById("canvas").style.zIndex = -1;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

// Functionality for Multiple Canvases
let canvases = [];
let timestamps = [];
let displayCount = [];

document.getElementById("save-drawing-button").addEventListener("click", saveDrawing);
function saveDrawing() {
    let newCanvas = document.createElement("canvas");
    let newContext = newCanvas.getContext("2d");
    newContext.drawImage(canvas, 0, 0);
    newCanvas.style.border = "1px solid rgb(222, 222, 222, 0.5)";
    newCanvas.style.borderRadius = "10px";
    newCanvas.style.position = "absolute";
    newCanvas.style.left = "0";
    newCanvas.style.right = "0";
    newCanvas.style.marginLeft = "auto";
    newCanvas.style.marginRight = "auto";
    newCanvas.style.display = "none";
    alert("Drawing saved!");
    document.getElementById("videos").append(newCanvas);

    let currentTime = document.getElementById("user-video").currentTime;

    canvases.push(newCanvas);
    timestamps.push(currentTime);
    displayCount.push(0);
}

let replayButton = document.getElementById("replay-with-drawings-button");
replayButton.addEventListener("click", replayWithDrawings);
function replayWithDrawings() {
    hideCanvas();

    document.getElementById("activate-canvas-button").style.display = "none";
    document.getElementById("deactivate-canvas-button").style.display = "none";
    document.getElementById("save-drawing-button").style.display = "none";
    document.getElementById("replay-with-drawings-button").style.display = "none";
    document.getElementById("step-button").style.display = "block";
    document.getElementById("exit-replay-mode-button").style.display = "block";

    let userVideo = document.getElementById("user-video");
    userVideo.currentTime = 0;
    userVideo.play();

    userVideo.addEventListener("timeupdate", displayCanvas);
    function displayCanvas() {
        for (let i = 0; i < canvases.length; i++) {
            
            let timeToDisplay = userVideo.currentTime > timestamps[i];
            let timeWithinRange = Math.abs(userVideo.currentTime - timestamps[i]) < 0.1;

            if ((timeToDisplay || timeWithinRange) && displayCount[i] == 0) {
                userVideo.pause();
                canvases[i].style.display = "inline";
                displayCount[i] = 1;
            }
        }
    }

    document.getElementById("step-button").addEventListener("click", step);
    function step() {
        for (let i = 0; i < canvases.length; i++) {
            canvases[i].style.display = "none";
        }
        userVideo.play();
    }
}

let exitReplayModeButton = document.getElementById("exit-replay-mode-button");
exitReplayModeButton.addEventListener("click", resetVideo);
function resetVideo() {
    let userVideo = document.getElementById("user-video");
    userVideo.currentTime = 0;
    userVideo.pause();

    document.getElementById("activate-canvas-button").style.display = "block";
    document.getElementById("deactivate-canvas-button").style.display = "block";
    document.getElementById("save-drawing-button").style.display = "block";
    document.getElementById("replay-with-drawings-button").style.display = "block";
    document.getElementById("step-button").style.display = "none";
    document.getElementById("exit-replay-mode-button").style.display = "none";
}

let displayYouTubeInstructionsButton = document.getElementById("display-youtube-instructions-button");
displayYouTubeInstructionsButton.addEventListener("click", displayYouTubeInstructions);
function displayYouTubeInstructions() {
    document.getElementById("youtube-instructions-list").style.display = "block";
}

let hideYouTubeInstructionsButton = document.getElementById("hide-youtube-instructions-button");
hideYouTubeInstructionsButton.addEventListener("click", hideYouTubeInstructions);
function hideYouTubeInstructions() {
    document.getElementById("youtube-instructions-list").style.display = "none";
}

let displayDesktopInstructionsButton = document.getElementById("display-desktop-instructions-button");
displayDesktopInstructionsButton.addEventListener("click", displayDesktopInstructions);
function displayDesktopInstructions() {
    document.getElementById("desktop-instructions-list").style.display = "block";
}

let hideDesktopInstructionsButton = document.getElementById("hide-desktop-instructions-button");
hideDesktopInstructionsButton.addEventListener("click", hideDesktopInstructions);
function hideDesktopInstructions() {
    document.getElementById("desktop-instructions-list").style.display = "none";
}

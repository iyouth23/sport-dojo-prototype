function addEvent(event) {

    if (document.getElementsByClassName("event")[0].getAttribute("contenteditable") == "false") {

        // Dimensions and coordinates
        let rectangle = event.target.getBoundingClientRect();
        let x = ((event.clientX - rectangle.left) / document.getElementById("editable-pitch").offsetWidth);
        let y = ((event.clientY - rectangle.top) / document.getElementById("editable-pitch").offsetHeight);

        let action = document.getElementById("selected-event").innerHTML;
        let table = document.getElementById("results-data");
        let row = table.insertRow(-1);

        // Player
        let cell1 = row.insertCell(0);
        cell1.style.color = "#00D44E";
        cell1.innerHTML = "Enter...";
        cell1.setAttribute("contenteditable", "true");

        // Action
        let cell2 = row.insertCell(1);
        cell2.innerHTML = action;

        // x-coord
        let cell3 = row.insertCell(2);
        cell3.innerHTML = Math.round(x * 100);

        // y-coord
        let cell4 = row.insertCell(3);
        cell4.innerHTML = Math.round(y * 100);

        // Time
        let cell5 = row.insertCell(4);
        cell5.style.color = "#00D44E";
        cell5.innerHTML = "Enter..."
        cell5.setAttribute("contenteditable", "true");

    } else {
        console.log("locked");
        document.getElementById("edit-header").style.backgroundColor = "#B40505";
        document.getElementById("edit-header").style.color = "#F4F4F4";
    }
}

function changeEventFocus(event) {
    document.getElementById("selected-event").removeAttribute("id");
    event.setAttribute("id", "selected-event");
}

function makeEventsEditable() {

    events = document.getElementsByClassName("event");

    if (events[0].getAttribute("contenteditable") == "false") {
        for (var i = 0; i < events.length; i++) {
            events[i].setAttribute("contenteditable", true);
            events[i].setAttribute("zIndex", 1);
            document.getElementById("edit-status").innerHTML = "Stop Editing";
        }
    } else {
        for (var i = 0; i < events.length; i++) {
            events[i].setAttribute("contenteditable", false);
            document.getElementById("edit-status").innerHTML = "Edit Events";

            // In case this was changed during an attempted action with a locked pitch
            document.getElementById("edit-header").style.backgroundColor = "#F4F4F4";
            document.getElementById("edit-header").style.color = "#B40505";

        }
    }
}

function deleteLastEvent() {
    var table = document.getElementById("results-table");
    if (table.rows.length > 1) {
        table.deleteRow((table.rows.length) - 1);
    }
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

let videoUploadButton = document.getElementById("upload-from-youtube-button");
videoUploadButton.addEventListener("click", displayUploadForm);
function displayUploadForm() {
    document.getElementById("paste-from-youtube-section").style.display = "block";
}

let urlForm = document.getElementById("paste-from-youtube-form");
let enterButton = document.getElementById("paste-from-youtube-submit");
enterButton.addEventListener("click", hideUploadForm);
function hideUploadForm() {
    event.preventDefault();
    if (urlForm.value == "") {
        alert("URL field cannot be empty!");
    } else {
        formatURL();
    }
}

function formatURL() {
    let url = urlForm.value;
    modifiedUrl = "";

    let validateUrl = url.indexOf("youtube.com/watch?v=");
    if (validateUrl == -1) {
        alert("Video cannot be found.");
        urlForm.value = "";
    } else {
        let preEmbed = url.indexOf("v=");
        modifiedUrl = "https://youtube.com/embed/" + url.substr(preEmbed + 2, preEmbed + 13);
        document.getElementById("analysis-video").setAttribute("src", modifiedUrl);
        document.getElementById("paste-from-youtube-section").style.display = "none";

        document.getElementById("analysis-video").style.display = "block";
        document.getElementById("user-video").style.display = "none";
    }
    urlForm.value = "";
}

let canvas = document.getElementById("editable-pitch");
let ctx = canvas.getContext("2d");
let coordinates = { x: 0, y: 0 };

canvas.addEventListener("mousedown", beginDraw);
canvas.addEventListener("mouseup", endDraw);

function beginDraw(event) {
    document.addEventListener("mousemove", executeDraw);
    repositionCursor(event);
  }

function repositionCursor(event) {

    let rectangle = document.getElementById("editable-pitch").getBoundingClientRect();
    let x = ((event.clientX - rectangle.left) / document.getElementById("editable-pitch").offsetWidth);
    let y = ((event.clientY - rectangle.top) / document.getElementById("editable-pitch").offsetHeight);

    coordinates.x = 300*x;
    coordinates.y = 150*y;
}

function endDraw() {
    document.removeEventListener("mousemove", executeDraw);
}

function executeDraw(event) {
    ctx.beginPath();
    ctx.lineWidth = 1.3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1D1D21";
    ctx.moveTo(coordinates.x, coordinates.y);
    repositionCursor(event);
    ctx.lineTo(coordinates.x, coordinates.y);
    ctx.stroke();
}

function uploadVideo(self) {
    document.getElementById("user-video").style.display = "block";
    document.getElementById("analysis-video").style.display = "none";
    var file = self.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var src = e.target.result;
        var video = document.getElementById("user-video");
        var source = document.getElementById("supported-source");
        source.setAttribute("src", src);
        video.load();
        video.play();
    };
    reader.readAsDataURL(file);
}
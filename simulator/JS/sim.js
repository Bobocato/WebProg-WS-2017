var simTime, running, zoom;

document.addEventListener("DOMContentLoaded", function () {

    //Helper
    function ajaxCallsMethod(method, path, data) {
        console.log("Send: " + data + " to " + path + " via " + method);
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function () {
                resolve(xhr);
            });
            xhr.open(method, path, true);
            xhr.setRequestHeader("Content-type", "application/json");
            if (method == "GET") {
                xhr.send();
            } else {
                xhr.send(data);
            }
        });
    }

    let startStopBtn = document.getElementById("startStopBtn");
    startStopBtn.addEventListener("click", function (e) {
        let startStopObj = {};
        if (startStopBtn.value == "Stoppen") {
            startStopBtn.value = "Starten";
            startStopObj.kind = "stop";
        } else {
            startStopBtn.value = "Stoppen";
            startStopObj.kind = "start";
        }

        ajaxCallsMethod("POST", "/startstop", JSON.stringify(startStopObj)).then(
            function (res) {
                console.log(res);
            },
            function (err) {
                console.log(err);
            }
        );
    });

    let sendTimeBtn = document.getElementById("sendTime");
    sendTimeBtn.addEventListener("click", function (e) {
        let datetime = {};
        datetime.timeStamp = new Date(document.getElementById("timeTravelDate").value).valueOf();
        console.log(datetime);
        ajaxCallsMethod("POST", "/timeJump", JSON.stringify(datetime)).then(
            function (res) {
                console.log(res);
            },
            function (err) {
                console.log(err);
            }
        );
    });

    let zoomRange = document.getElementById("timeZoom");
    zoomRange.addEventListener("change", function (e) {
        let zoom = {};
        zoom.zoom = zoomRange.value;
        ajaxCallsMethod("POST", "/zoom", JSON.stringify(zoom)).then(
            function (res) {
                console.log(res);
            },
            function (err) {
                console.log(err);
            }
        );
    });
    zoomRange.addEventListener("input", function (e) {
        document.getElementById("currentZoomFaktor").textContent = zoomRange.value;
    });

    setInterval(function () {
        let time = new Date();
        let out = formatTime(time);
        document.getElementById("realTime").textContent = out;
    }, 1000);

    /* setInterval(function () {
        ajaxCallsMethod("GET", "/simTime", "").then(
            function (res) {
                let time = JSON.parse(res.responseText);
                let out = formatTime(time);
                document.getElementById("simulatorTime").textContent = out;
            },
            function (err) {

            }
        );
    }, 1000); */

    function formatTime(time) {
        let out = "Realzeit: ";
        if (time.getHours() < 10) {
            out += "0" + time.getHours() + ":";
        } else {
            out += time.getHours() + ":";
        }
        if (time.getMinutes() < 10) {
            out += "0" + time.getMinutes() + " Uhr am ";
        } else {
            out += time.getMinutes() + " Uhr am ";
        }
        if (time.getDate() < 10) {
            out += "0" + time.getDate() + ".";
        } else {
            out += time.getDate() + ".";
        }
        if (time.getMonth() < 10) {
            out += "0" + time.getMonth() + 1 + ".";
        } else {
            out += time.getMonth() + 1 + ".";
        }
        out += time.getFullYear() + "";
        return out;
    }

}, true);
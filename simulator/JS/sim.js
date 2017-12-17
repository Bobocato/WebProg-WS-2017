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
    let getXml = document.getElementById("getXMLDB");
    let postXml = document.getElementById("postXMLDB");

    let startStopBtn = document.getElementById("startStopBtn");
    startStopBtn.addEventListener("click", function (e) {
        let startStopObj = {};
        if (startStopBtn.value == "Stoppen") {
            startStopBtn.value = "Starten";
            startStopBtn.disabled = true;
            getXml.disabled = false;
            postXml.disabled = false;
            startStopObj.kind = "stop";
        } else {
            startStopBtn.value = "Stoppen";
            startStopBtn.disabled = true;
            startStopObj.kind = "start";
            getXml.disabled = true;
            postXml.disabled = true;
        }

        ajaxCallsMethod("POST", "/startstop", JSON.stringify(startStopObj)).then(
            function (res) {
                console.log(res);
                startStopBtn.disabled = false;

            },
            function (err) {
                console.log(err);
            }
        );
    });

    getXml.addEventListener("click", function (e) {
        ajaxCallsMethod("GET", "/xmldb", "").then(
            function (res) {
                let url = JSON.parse(res.responseText).Address;
                window.open(url);
            },
            function (err) {
                console.log(err);
            }
        );
    });

    postXml.addEventListener("change", function (e) {
        let file = postXml.files[0];
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (event) {
            ajaxCallsMethod("POST", "/xmldb", event.target.result);
            postXml.value = "";
        };
    });

    let sendTimeBtn = document.getElementById("sendTime");
    sendTimeBtn.addEventListener("click", function (e) {
        let datetime = {};
        datetime.FutureSimDayTime = new Date(document.getElementById("timeTravelDate").value).valueOf() / 1000;
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
        zoom.zoom = parseInt(zoomRange.value);
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
        let out = formatTime("Realzeit: ", time);
        document.getElementById("realTime").textContent = out;
    }, 1000);

    setInterval(function () {
        ajaxCallsMethod("GET", "/simcon", "").then(
            function (res) {
                let data = JSON.parse(res.responseText);
                let time = new Date(data.CurrentSimDayTime * 1000);
                let out = formatTime("Simulatorzeit: ", time);
                document.getElementById("simulatorTime").textContent = out;
            },
            function (err) {

            }
        );
    }, 1000);

    function formatTime(kind, time) {
        let out = kind;
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
            out += "0";
            out += time.getMonth() + 1;
            out += ".";
        } else {
            out += time.getMonth() + 1 + ".";
        }
        out += time.getFullYear() + "";
        return out;
    }

}, true);
//Global Scope
//These variables can be used globally and will be used to save Ajax requests
var rooms, lamps, shutters, radiators, scenes, user;

//Start page when DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function () {
    getRoom(roomDOM);
    getScene(sceneDOM);
    user = JSON.parse(document.getElementById("userData").value);
    console.log(user);
    //---------------------------------
    //---------Helper Functions--------
    //---------------------------------
    function getDevice(kind, id) {
      let device;
      //Get all Device Data
      if (kind == "lamp") {
        lamps.forEach(lamp => {
          if (lamp.LampID == id) {
            device = lamp;
          }
        });
      } else if (kind == "shutter") {
        shutters.forEach(shutter => {
          if (id == shutter.ShutterID) {
            device = shutter;
          }
        });
      } else if (kind == "radiator") {
        radiators.forEach(radiator => {
          if (id == radiator.RadiatorID) {
            device = radiator;
          }
        });
      }
      return device;
    }

    function getSingleScene(id) {
      let currentScene;
      scenes.forEach(scene => {
        if (id == scene.SceneID) {
          currentScene = scene;
        }
      });
      return currentScene;
    }

    function clearTable(id) {
      let tableChildren = document.getElementById(id).children;
      while (tableChildren.length > 1) {
        [].forEach.call(tableChildren, function (child) {
          if (child.tagName != "TBODY") {
            child.remove();
          }
        });
      }
    }

    //---------------------------------
    //----Ajax Calls with Callbacks----
    //---------------------------------
    function ajaxCallsGet(path) {
      console.log("Send: GET Request to " + path);
      return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
          resolve(xhr);
        });
        xhr.open("GET", path, true);
        xhr.send();
      });
    }

    function getRoom(callback) {
      //Start all Ajax calls and set promises
      Promise.all([
        ajaxCallsGet("/api/room").then(
          function (res) {
            rooms = JSON.parse(res.responseText);
            if (rooms == null) {
              rooms = [];
            }
          },
          function (err) {
            console.log(err);
          }
        ),
        ajaxCallsGet("/api/lamp").then(
          function (res) {
            lamps = JSON.parse(res.responseText);
            if (lamps == null) {
              lamps = [];
            }
          },
          function (err) {
            console.log(err);
          }
        ),
        ajaxCallsGet("/api/shutter").then(
          function (res) {
            shutters = JSON.parse(res.responseText);
            if (shutters == null) {
              shutters = [];
            }
          },
          function (err) {
            console.log(err);
          }
        ),
        ajaxCallsGet("/api/radiator").then(
          function (res) {
            radiators = JSON.parse(res.responseText);
            if (radiators == null) {
              radiators = [];
            }
          },
          function (err) {
            console.log(err);
          }
        )
      ]).then(function () {
        //All promises are fullfilled
        console.log("All Roomdata should be here");
        console.log(rooms);
        console.log(lamps);
        console.log(shutters);
        console.log(radiators);
        callback();
      });
    }

    function getScene(callback) {
      Promise.all([
        ajaxCallsGet("/api/scene").then(
          function (res) {
            scenes = JSON.parse(res.responseText);
          },
          function (err) {
            console.log(err);
          }
        )
      ]).then(function () {
        //All promises are fullfilled
        console.log(scenes);
        callback();
      });
    }
    //----------------------------------
    //---Callbacks for the Ajax Calls---
    //----------------------------------
    function roomDOM() {
      let roomsElement = document.getElementsByClassName("rooms")[0];
      //Check if ".rooms" is empty
      while (roomsElement.children.length != 0) {
        [].forEach.call(roomsElement.children, function (room) {
          room.remove();
        });
      }
      if (rooms != null) {
        rooms.forEach(room => {
          //Fragement for one Room
          let roomFragment = document.createDocumentFragment();
          //Outer Div
          let roomDiv = document.createElement("DIV");
          roomDiv.setAttribute("class", "room");
          roomDiv.setAttribute("id", room.RoomID);
          //Name in Div
          let nameTag = document.createElement("H2");
          nameTag.setAttribute("class", "roomTitle");
          nameTag.textContent = room.Name;
          roomDiv.appendChild(nameTag);
          //Lamps
          lamps.forEach(lamp => {
            if (lamp.RoomID == room.RoomID) {
              //Outer Div
              let lampDiv = document.createElement("DIV");
              lampDiv.setAttribute("class", "lamp");
              lampDiv.setAttribute("id", "lamp:" + lamp.LampID);
              lampDiv.addEventListener("click", function (e) {
                if (e.target.tagName == "DIV" || e.target.tagName == "H4") {
                  console.log("SeemsGood");
                  //Get Device 
                  let id;
                  if (e.target.tagName == "H4") {
                    id = e.target.parentElement.id.split(":");
                  } else {
                    id = e.target.id.split(":");
                  }

                  let lamp = getDevice(id[0], id[1]);
                  document.getElementById("lampNameModal").textContent = lamp.Name;
                  document.getElementById("lampNameInput").value = lamp.Name;
                  if (lamp.Status) {
                    document.getElementById("lampModalSwitch").checked = true;
                  } else {
                    document.getElementById("lampModalSwitch").checked = false;
                  }
                  document.getElementById("lampModalIDHolder").value = lamp.LampID;
                  showModal("lampModal");
                }
              });
              //Nametag
              let lampName = document.createElement("H4");
              lampName.setAttribute("class", "lampTitle");
              lampName.textContent = lamp.Name;
              lampDiv.appendChild(lampName);
              //Toggle switch from https://www.w3schools.com/howto/howto_css_switch.asp
              let switchLabel = document.createElement("LABEL");
              switchLabel.setAttribute("class", "switch");
              let switchInput = document.createElement("INPUT");
              switchInput.setAttribute("type", "checkbox");
              switchInput.setAttribute("id", "Lamp:" + lamp.LampID);
              if (lamp.Status == 1) {
                switchInput.setAttribute("checked", "checked");
              }
              switchLabel.appendChild(switchInput);
              let switchSpan = document.createElement("SPAN");
              switchSpan.setAttribute("class", "slider round");
              switchLabel.appendChild(switchSpan);
              lampDiv.appendChild(switchLabel);
              //Eventlistener
              switchSpan.addEventListener("click", function (e) {
                //Update listener
                let newLamp = getDevice("lamp", lamp.LampID);
                if (e.target.parentElement.children[0].checked) {
                  newLamp.Status = 0;
                } else {
                  newLamp.Status = 1;
                }
                ajaxCallsMethod("UPDATE", "/api/lamp", JSON.stringify(newLamp)).then(
                  function (res) {
                    //console.log(res);
                  },
                  function (err) {
                    console.log(err);
                  }
                );
              });
              //Append lamps to RoomDiv
              roomDiv.appendChild(lampDiv);
            }
          });
          shutters.forEach(shutter => {
            if (shutter.RoomID == room.RoomID) {
              //Outer Div
              let shutterDiv = document.createElement("DIV");
              shutterDiv.setAttribute("class", "shutter");
              shutterDiv.setAttribute("id", "shutter:" + shutter.ShutterID);
              shutterDiv.addEventListener("click", function (e) {
                if (e.target.tagName == "DIV" || e.target.tagName == "H4") {
                  console.log("SeemsGood");
                  //Get Device 
                  let id;
                  if (e.target.tagName == "H4") {
                    id = e.target.parentElement.id.split(":");
                  } else {
                    id = e.target.id.split(":");
                  }
                  let shutter = getDevice(id[0], id[1]);
                  document.getElementById("shutterNameModal").textContent = shutter.Name;
                  document.getElementById("shutterNameInput").value = shutter.Name;
                  document.getElementById("shutterNumberInput").value = shutter.Status;
                  document.getElementById("shutterModalIDHolder").value = shutter.ShutterID;
                  showModal("shutterModal");
                }
              });
              //Nametag
              let shutterName = document.createElement("H4");
              shutterName.setAttribute("class", "shutterTitle");
              shutterName.textContent = shutter.Name;
              shutterDiv.appendChild(shutterName);
              //Input for setting shutterstatus
              let shutterInput = document.createElement("INPUT");
              shutterInput.setAttribute("type", "number");
              shutterInput.setAttribute("value", shutter.Status);
              shutterInput.setAttribute("max", "100");
              shutterInput.setAttribute("min", "0");
              shutterInput.setAttribute("class", "shutterInput");
              shutterInput.setAttribute("id", shutter.ShutterID);
              shutterDiv.appendChild(shutterInput);
              //Eventlistener
              shutterInput.addEventListener("input", function (evt) {
                //Update listener
                let newShutter = getDevice("shutter", shutter.ShutterID);
                if (parseInt(evt.target.value) > 100) {
                  newShutter.Status = 100;
                } else if (parseInt(evt.target.value) < 0) {
                  newShutter.Status = 0
                } else {
                  newShutter.Status = parseInt(evt.target.value);
                }
                ajaxCallsMethod("UPDATE", "/api/shutter", JSON.stringify(newShutter)).then(
                  function (res) {
                    //console.log(res);
                  },
                  function (err) {
                    console.log(err);
                  }
                );
              });
              //Append Shutter to room
              roomDiv.appendChild(shutterDiv);
            }
          });
          radiators.forEach(radiator => {
            if (radiator.RoomID == room.RoomID) {
              //Outer Div
              let radiatorDiv = document.createElement("DIV");
              radiatorDiv.setAttribute("class", "radiator");
              radiatorDiv.setAttribute("id", "radiator:" + radiator.RadiatorID);
              radiatorDiv.addEventListener("click", function (e) {
                if (e.target.tagName == "DIV" || e.target.tagName == "H4") {
                  console.log("SeemsGood");
                  //Get Device 
                  let id;
                  if (e.target.tagName == "H4") {
                    id = e.target.parentElement.id.split(":");
                  } else {
                    id = e.target.id.split(":");
                  }
                  let radiator = getDevice(id[0], id[1]);
                  document.getElementById("radiatorNameModal").textContent = radiator.Name;
                  document.getElementById("radiatorNameInput").value = radiator.Name;
                  document.getElementById("radiatorNumberInput").value = radiator.Status;
                  document.getElementById("radiatorModalIDHolder").value = radiator.RadiatorID;
                  showModal("radiatorModal");
                }
              });
              //Nametag
              let radiatorName = document.createElement("H4");
              radiatorName.setAttribute("class", "radiatorTitle");
              radiatorName.textContent = radiator.Name;
              radiatorDiv.appendChild(radiatorName);
              //Input for setting radiatorstatus
              let radiatorInput = document.createElement("INPUT");
              radiatorInput.setAttribute("type", "number");
              radiatorInput.setAttribute("value", radiator.Status);
              radiatorInput.setAttribute("min", "0");
              radiatorInput.setAttribute("max", "35");
              radiatorInput.setAttribute("class", "radiatorInput");
              radiatorInput.setAttribute("id", radiator.RadiatorID);
              radiatorDiv.appendChild(radiatorInput);
              //Eventlistener
              radiatorInput.addEventListener("input", function (evt) {
                //Update listener
                let newRadiator = getDevice("radiator", radiator.RadiatorID);
                if (parseInt(evt.target.value) > 35) {
                  newRadiator.Status = 35;
                } else if (parseInt(evt.target.value) < 0) {
                  newRadiator.Status = 0;
                } else {
                  newRadiator.Status = parseInt(evt.target.value);
                }
                ajaxCallsMethod("UPDATE", "/api/radiator", JSON.stringify(newRadiator)).then(
                  function (res) {
                    //console.log(res);
                  },
                  function (err) {
                    console.log(err);
                  }
                );
              });
              //Append radiator to room
              roomDiv.appendChild(radiatorDiv);
            }
          });
          roomDiv.addEventListener("click", function (e) {
            changeRoomEvent(e);
          });
          //Append to fragment and then to DOM
          roomFragment.appendChild(roomDiv);
          roomsElement.appendChild(roomFragment);
        });
      }
    }

    function sceneDOM() {
      let sceneElement = document.getElementsByClassName("scenes")[0];
      //Check if ".scenes" is empty
      while (sceneElement.children.length != 0) {
        [].forEach.call(sceneElement.children, function (scene) {
          scene.remove();
        });
      }
      if (scenes != null) {
        scenes.forEach(scene => {
          if (scene.UserID == user.UserID) {
            let sceneFragment = document.createDocumentFragment();
            //outer Div
            let sceneDiv = document.createElement("DIV");
            sceneDiv.setAttribute("class", "scene");
            sceneDiv.setAttribute("id", scene.SceneID);
            //LeftDiv
            let leftDiv = document.createElement("DIV");
            leftDiv.setAttribute("class", "sceneLeft");
            leftDiv.setAttribute("id", "sceneLeft:" + scene.SceneID);
            //MiddleDiv
            let middleDiv = document.createElement("DIV");
            middleDiv.setAttribute("class", "sceneMiddle");
            middleDiv.setAttribute("id", "sceneMiddle:" + scene.SceneID);
            //RightDiv
            let rightDiv = document.createElement("DIV");
            rightDiv.setAttribute("class", "sceneRight");
            rightDiv.setAttribute("id", "sceneRight:" + scene.SceneID);
            //startButton
            let sceneStart = document.createElement("INPUT");
            sceneStart.setAttribute("type", "button");
            sceneStart.setAttribute("class", "sceneStartBtn");
            sceneStart.setAttribute("id", scene.SceneID);
            sceneStart.setAttribute("value", "Starten");
            leftDiv.appendChild(sceneStart);
            //Name
            let sceneName = document.createElement("H4");
            sceneName.setAttribute("class", "sceneTitle");
            sceneName.textContent = scene.Name;
            middleDiv.appendChild(sceneName);
            //Time/Sunset/Sunrise
            let sceneTime = document.createElement("H4");
            sceneTime.setAttribute("class", "sceneTime");
            let totaloffset = scene.Negoffset + scene.Posoffset;
            if (scene.Sunrise) {
              sceneTime.textContent =
                "Wird zum Sonnenaufgang mit einem Offset von " +
                totaloffset +
                "min. ausgeführt";
            } else if (scene.Sunset) {
              sceneTime.textContent =
                "Wird zum Sonnenuntergang mit einem Offset von " +
                totaloffset +
                " min. ausgeführt";
            } else {
              sceneTime.textContent =
                "Wird um " +
                scene.Time +
                " mit einem Offset von " +
                totaloffset +
                " min. ausgeführt";
            }
            middleDiv.appendChild(sceneTime);
            //Active or not
            //Toggle switch from https://www.w3schools.com/howto/howto_css_switch.asp
            let switchLabel = document.createElement("LABEL");
            switchLabel.setAttribute("class", "switch");
            let switchInput = document.createElement("INPUT");
            switchInput.setAttribute("type", "checkbox");
            switchInput.setAttribute("id", "Scene:" + scene.SceneID);
            if (scene.Active) {
              switchInput.checked = true;
            } else {
              switchInput.checked = false;
            }
            switchLabel.appendChild(switchInput);
            let switchSpan = document.createElement("SPAN");
            switchSpan.setAttribute("class", "slider round");
            switchLabel.appendChild(switchSpan);
            rightDiv.appendChild(switchLabel);
            //Eventlistener
            switchSpan.addEventListener("click", function () {
              if (switchInput.checked) {
                scene.Active = false;
              } else {
                scene.Active = true;
              }
              ajaxCallsMethod("UPDATE", "/api/scene", JSON.stringify(scene)).then(
                function (res) {
                  if (JSON.parse(res.responseText)) {
                    console.log(res);
                    //getRoom(roomDOM);
                  }
                },
                function (err) {
                  console.log(err);
                }
              );
              console.log(scene.SceneID + " and " + switchInput.checked);
            });
            sceneStart.addEventListener("click", function () {
              console.log("Start: Scene " + scene.SceneID);
              ajaxCallsMethod("PUT", "/api/scene", JSON.stringify(scene)).then(
                function (res) {
                  getRoom(roomDOM);
                  console.log(res);
                },
                function (err) {
                  console.log(err);
                }
              );
            });
            sceneDiv.addEventListener("click", function (e) {
              changeSceneEvent(e);
            });
            sceneDiv.appendChild(leftDiv);
            sceneDiv.appendChild(middleDiv);
            sceneDiv.appendChild(rightDiv);
            //Append to Dom
            sceneFragment.appendChild(sceneDiv);
            sceneElement.appendChild(sceneFragment);
          }
        });
      }
    }
    //----------------------------------
    //-----Show and Hide the Modals-----
    //----------------------------------
    function showModal(modalName) {
      //Blur Page
      document.getElementsByClassName("container")[0].style.filter = "blur(10px)";
      //Disable other Pagecontent
      document.getElementsByClassName("container")[0].classList.add("disabled");
      switch (modalName) {
        case "settings":
          document.getElementById("settingsModal").style.display = "block";
          break;
        case "newDevice":
          document.getElementById("newDeviceModal").style.display = "block";
          //I dont want to reload the Rooms here to save bandwith, i will use the saved ones...
          let roomSelect = document.getElementById("newDeviceRoom");
          let selectRoomsFragment = document.createDocumentFragment();
          rooms.forEach(room => {
            let option = document.createElement("option");
            option.setAttribute("value", room.RoomID);
            option.textContent = room.Name;
            selectRoomsFragment.appendChild(option);
          });
          roomSelect.appendChild(selectRoomsFragment);
          break;
        case "newRoom":
          document.getElementById("newRoomModal").style.display = "block";
          break;
        case "newScene":
          document.getElementById("newSceneModal").style.display = "block";
          //I dont want to reload the Devices here to save bandwith, i will use the saved ones...
          //Hide and show Time Field when sunset or sunrise are choosen
          let timeSelect = document.getElementById("newSceneTime");
          let timeInput = document.getElementById("timeDiv");
          timeSelect.addEventListener("change", function () {
            if (timeSelect.value == "time") {
              timeInput.style.display = "block";
            } else {
              timeInput.style.display = "none";
            }
          });

          let even = false;
          let evenFragment = document.createDocumentFragment();
          let unevenFragment = document.createDocumentFragment();
          for (let i = 0; i < lamps.length + shutters.length + radiators.length; i++) {
            let tr = document.createElement("TR");
            let addTd = document.createElement("TD");
            let deviceTd = document.createElement("TD");
            let kindTd = document.createElement("TD");
            let addBtn = document.createElement("INPUT");
            addBtn.setAttribute("type", "button");
            addBtn.setAttribute("value", "Hinzufügen");
            if (even) {
              even = !even;
              if (i >= lamps.length + shutters.length) {
                //Add radiators
                addBtn.setAttribute(
                  "id",
                  "radiator:" +
                  radiators[i - (lamps.length + shutters.length)].RadiatorID
                );
                kindTd.textContent = "Heizung";
                deviceTd.textContent =
                  radiators[i - (lamps.length + shutters.length)].Name;
              } else if (i >= lamps.length) {
                //Add Shutter
                addBtn.setAttribute(
                  "id",
                  "shutter:" + shutters[i - lamps.length].ShutterID
                );
                kindTd.textContent = "Rollläden";
                deviceTd.textContent = shutters[i - lamps.length].Name;
              } else {
                //Add lamps
                addBtn.setAttribute("id", "lamp:" + lamps[i].LampID);
                kindTd.textContent = "Lampe";
                deviceTd.textContent = lamps[i].Name;
              }
            } else {
              even = !even;
              if (i >= lamps.length + shutters.length) {
                //Add radiators
                addBtn.setAttribute(
                  "id",
                  "radiator:" +
                  radiators[i - (lamps.length + shutters.length)].RadiatorID
                );
                kindTd.textContent = "Heizung";
                deviceTd.textContent =
                  radiators[i - (lamps.length + shutters.length)].Name;
              } else if (i >= lamps.length) {
                //Add Shutter
                addBtn.setAttribute("id", "shutter:" + shutters[i - lamps.length].ShutterID);
                kindTd.textContent = "Rollläden";
                deviceTd.textContent = shutters[i - lamps.length].Name;
              } else {
                //Add lamp
                addBtn.setAttribute("id", "lamp:" + lamps[i].LampID);
                kindTd.textContent = "Lampe";
                deviceTd.textContent = lamps[i].Name;
              }
            }
            //--------------------------
            //--- Add Button listener---
            //--------------------------
            addBtn.addEventListener("click", function (e) {
              newSceneAddDeviceListener(e);
            });
            addTd.appendChild(addBtn);
            tr.appendChild(addTd);
            tr.appendChild(deviceTd);
            tr.appendChild(kindTd);
            if (even) {
              evenFragment.appendChild(tr);
            } else {
              unevenFragment.appendChild(tr);
            }
          }
          document
            .getElementById("newSceneDevicesLeft")
            .appendChild(evenFragment);
          document
            .getElementById("newSceneDevicesRight")
            .appendChild(unevenFragment);
          break;
        case "roomModal":
          document.getElementById("roomModal").style.display = "block";
          break;
        case "sceneModal":
          document.getElementById("sceneModal").style.display = "block";
          break;
        case "lampModal":
          document.getElementById("lampModal").style.display = "block";
          break;
        case "shutterModal":
          document.getElementById("shutterModal").style.display = "block";
          break;
        case "radiatorModal":
          document.getElementById("radiatorModal").style.display = "block";
          break;
      }
    }

    function hideModal(modalName) {
      //Unblur Page
      document.getElementsByClassName("container")[0].style.filter = "blur(0)";
      //Enable other Pagecontent
      document.getElementsByClassName("container")[0].classList.remove("disabled");
      //Empty Tables
      clearTable("newSceneDevicesRight");
      clearTable("newSceneDevicesLeft");
      clearTable("newSceneAktions");
      clearTable("roomModalDeleteDevices");
      clearTable("roomModalAddDevices");
      clearTable("changeSceneAddDevices");
      clearTable("changeSceneDeleteDevices");
      //Hide modals
      switch (modalName) {
        case "settings":
          document.getElementById("settingsModal").style.display = "none";
          break;
        case "newDevice":
          document.getElementById("newDeviceModal").style.display = "none";
          break;
        case "newRoom":
          document.getElementById("newRoomModal").style.display = "none";
          break;
        case "newScene":
          document.getElementById("newSceneModal").style.display = "none";
          break;
        case "updateRoom":
          document.getElementById("roomModal").style.display = "none";
          break;
        case "updateScene":
          document.getElementById("sceneModal").style.display = "none";
          break;
        case "lampModal":
          document.getElementById("lampModal").style.display = "none";
          break;
        case "shutterModal":
          document.getElementById("shutterModal").style.display = "none";
          break;
        case "radiatorModal":
          document.getElementById("radiatorModal").style.display = "none";
      }
    }

    function logout() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = cookie.substr(0, eqPos);
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      window.location.replace("/login");
    }
    //------------------------------------
    //---Eventlistener for modal inters---
    //------------------------------------
    function changeSceneEvent(e) {
      if (e.target.tagName == "DIV" || e.target.tagName == "H4") {
        //Get Scene
        let sceneId;
        if (e.target.tagName == "H4") {
          sceneId = e.target.parentElement.id.split(":")[1];
        } else {
          sceneId = e.target.id.split(":")[1];
        }
        let currentScene = getSingleScene(sceneId);
        //Append Scene ID for later
        document.getElementById("sceneId").value = currentScene.SceneID;
        //Append Name
        document.getElementById("sceneName").textContent = currentScene.Name;
        document.getElementById("changeSceneName").value = currentScene.Name;
        //Append Time
        if (currentScene.Sunset == true) {
          document.getElementById("timeDiv").style.display = "none";
          document.getElementById("changeSceneTime").value = "sunset";
        } else if (currentScene.Sunrise == true) {
          document.getElementById("changeSceneTimeDiv").style.display = "none";
          document.getElementById("changeSceneTime").value = "sunrise";
        } else {
          document.getElementById("changeSceneTime").value = "time";
          document.getElementById("changeScenePointInTime").value = currentScene.Time;
        }

        document.getElementById("changeSceneTime").addEventListener("change", function (e) {
          if (document.getElementById("changeSceneTime").value == "time") {
            document.getElementById("changeSceneTimeDiv").style.display = "block";
          } else {
            document.getElementById("changeSceneTimeDiv").style.display = "none";
          }
        });
        //Append Offset
        document.getElementById("changeScenePosOffset").value = currentScene.Posoffset;
        document.getElementById("changeSceneNegOffset").value = currentScene.Negoffset;
        //Append deletable Devices
        let deleteTableFragment = document.createDocumentFragment();
        for (let i = 0; i < (currentScene.Lamps.length + currentScene.Shutters.length + currentScene.Radiators.length); i++) {
          let tr = document.createElement("TR");
          let statusTd = document.createElement("TD");
          let deleteTd = document.createElement("TD");
          let deviceTd = document.createElement("TD");
          let kindTd = document.createElement("TD");
          //DeleteBtn
          let deleteBtn = document.createElement("INPUT");
          deleteBtn.setAttribute("type", "button");
          deleteBtn.setAttribute("value", "Entfernen");
          //Status
          let statusInput = document.createElement("INPUT");
          if (i >= currentScene.Lamps.length + currentScene.Shutters.length) {
            //Add radiators
            deleteBtn.setAttribute("id", "radiator:" + currentScene.Radiators[i - (currentScene.Lamps.length + currentScene.Shutters.length)].RadiatorID);
            kindTd.textContent = "Heizung";
            deviceTd.textContent = currentScene.Radiators[i - (currentScene.Lamps.length + currentScene.Shutters.length)].Name;
            statusInput.setAttribute("type", "number");
            statusInput.setAttribute("min", 0);
            statusInput.setAttribute("max", 35);
            statusInput.setAttribute("value", currentScene.Radiators[i - (currentScene.Lamps.length + currentScene.Shutters.length)].Status);
            statusInput.setAttribute("id", "radiator:" + currentScene.Radiators[i - (currentScene.Lamps.length + currentScene.Shutters.length)].RadiatorID);
          } else if (i >= currentScene.Lamps.length) {
            //Add Shutter
            deleteBtn.setAttribute("id", "shutter:" + currentScene.Shutters[i - currentScene.Lamps.length].ShutterID);
            kindTd.textContent = "Rollläden";
            deviceTd.textContent = currentScene.Shutters[i - currentScene.Lamps.length].Name;
            statusInput.setAttribute("type", "number");
            statusInput.setAttribute("min", 0);
            statusInput.setAttribute("max", 100);
            statusInput.setAttribute("value", currentScene.Shutters[i - currentScene.Lamps.length].Status);
            statusInput.setAttribute("id", "shutter:" + currentScene.Shutters[i - currentScene.Lamps.length].ShutterID);
          } else {
            //Add lamps
            deleteBtn.setAttribute("id", "lamp:" + currentScene.Lamps[i].LampID);
            kindTd.textContent = "Lampe";
            deviceTd.textContent = lamps[i].Name;
            statusInput.setAttribute("type", "checkbox");
            if (currentScene.Lamps[i].Status == 1) {
              statusInput.checked = true;
            } else {
              statusInput.checked = false;
            }
            statusInput.setAttribute("id", "lamp:" + currentScene.Lamps[i].LampID);
          }
          //--------------------------
          //--- Add Button listener---
          //--------------------------
          deleteBtn.addEventListener("click", function (e) {
            changeSceneDeleteDevice(e);
          });
          deleteTd.appendChild(deleteBtn);
          statusTd.appendChild(statusInput);
          tr.appendChild(statusTd);
          tr.appendChild(deviceTd);
          tr.appendChild(kindTd);
          tr.appendChild(deleteTd);
          deleteTableFragment.appendChild(tr);
        }
        document.getElementById("changeSceneDeleteDevices").appendChild(deleteTableFragment);
        //Get Devices 
        let isDevice = false;
        let otherLamps = [];
        lamps.forEach(allLamp => {
          currentScene.Lamps.forEach(sceneLamp => {
            if (allLamp.LampID == sceneLamp.LampID) {
              isDevice = true;
            }
          });
          if (!isDevice) {
            otherLamps.push(allLamp);
          }
          isDevice = false;
        });
        let otherShutters = [];
        shutters.forEach(allShutter => {
          currentScene.Shutters.forEach(sceneShutter => {
            if (allShutter.ShutterID == sceneShutter.ShutterID) {
              isDevice = true;
            }
          });
          if (!isDevice) {
            otherShutters.push(allShutter);
          }
          isDevice = false;
        });
        let otherRadiators = [];
        radiators.forEach(allRadiator => {
          currentScene.Radiators.forEach(sceneRadiator => {
            if (allRadiator.RadiatorID == sceneRadiator.RadiatorID) {
              isDevice = true;
            }
          });
          if (!isDevice) {
            otherRadiators.push(allRadiator);
          }
          isDevice = false;
        });
        //DOM scripting
        let addTableFragment = document.createDocumentFragment();
        for (let i = 0; i < (otherLamps.length + otherRadiators.length + otherShutters.length); i++) {
          let tr = document.createElement("TR");
          let addTd = document.createElement("TD");
          let deviceTd = document.createElement("TD");
          let kindTd = document.createElement("TD");
          let addBtn = document.createElement("INPUT");
          addBtn.setAttribute("type", "button");
          addBtn.setAttribute("value", "Hinzufügen");
          if (i >= otherLamps.length + otherShutters.length) {
            //Add radiators
            addBtn.setAttribute("id", "radiator:" + otherRadiators[i - (otherLamps.length + otherShutters.length)].RadiatorID);
            kindTd.textContent = "Heizung";
            deviceTd.textContent = otherRadiators[i - (otherLamps.length + otherShutters.length)].Name;
          } else if (i >= otherLamps.length) {
            //Add Shutter
            addBtn.setAttribute("id", "shutter:" + otherShutters[i - otherLamps.length].ShutterID);
            kindTd.textContent = "Rollläden";
            deviceTd.textContent = otherShutters[i - otherLamps.length].Name;
          } else {
            //Add lamps
            addBtn.setAttribute("id", "lamp:" + otherLamps[i].LampID);
            kindTd.textContent = "Lampe";
            deviceTd.textContent = otherLamps[i].Name;
          }
          //--------------------------
          //--- Add Button listener---
          //--------------------------
          addBtn.addEventListener("click", function (e) {
            changeSceneAddDevice(e);
          });
          addTd.appendChild(addBtn);
          tr.appendChild(addTd);
          tr.appendChild(deviceTd);
          tr.appendChild(kindTd);
          addTableFragment.appendChild(tr);
        }
        document.getElementById("changeSceneAddDevices").appendChild(addTableFragment);

        showModal("sceneModal");
      }
    }

    function changeSceneAddDevice(e) {
      let deviceId = e.target.id.split(":");
      let device = getDevice(deviceId[0], deviceId[1]);
      let actionTable = document.getElementById("changeSceneDeleteDevices");
      let tr = document.createElement("TR");
      let aktionTd = document.createElement("TD");
      let deleteTd = document.createElement("TD");
      let kindTd = document.createElement("TD");
      let deleteBtn = document.createElement("INPUT");
      deleteBtn.setAttribute("type", "button");
      deleteBtn.setAttribute("value", "Entfernen");
      deleteBtn.addEventListener("click", function (e) {
        changeSceneDeleteDevice(e);
      });
      let aktionInput = document.createElement("INPUT");
      if (typeof device.LampID != "undefined") {
        aktionInput.setAttribute("type", "checkbox");
        aktionInput.checked = true;
        aktionInput.setAttribute("id", "lamp:" + device.LampID);
        deleteBtn.setAttribute("id", "lamp:" + device.LampID);
        kindTd.textContent = "Lampe";
      } else if (typeof device.ShutterID != "undefined") {
        aktionInput.setAttribute("type", "number");
        aktionInput.setAttribute("max", "100");
        aktionInput.setAttribute("min", "0");
        aktionInput.setAttribute("value", device.Status);
        aktionInput.setAttribute("id", "shutter:" + device.ShutterID);
        deleteBtn.setAttribute("id", "shutter:" + device.ShutterID);
        kindTd.textContent = "Rollläden";
      } else if (typeof device.RadiatorID != "undefined") {
        aktionInput.setAttribute("type", "number");
        aktionInput.setAttribute("max", "35");
        aktionInput.setAttribute("min", "0");
        aktionInput.setAttribute("value", device.Status);
        aktionInput.setAttribute("id", "radiator:" + device.RadiatorID);
        deleteBtn.setAttribute("id", "radiator:" + device.RadiatorID);
        kindTd.textContent = "Heizung";
      }
      deleteTd.appendChild(deleteBtn);
      aktionTd.appendChild(aktionInput);
      let deviceTd = document.createElement("TD");
      deviceTd.textContent = device.Name;
      tr.appendChild(aktionTd);
      tr.appendChild(deviceTd);
      tr.appendChild(kindTd);
      tr.appendChild(deleteTd);
      let trFragment = document.createDocumentFragment();
      trFragment.appendChild(tr);
      actionTable.appendChild(trFragment);

      //Remove from old Table
      e.target.parentElement.parentElement.remove();
    }

    function changeSceneDeleteDevice(e) {
      let deviceId = e.target.id.split(":");
      let device = getDevice(deviceId[0], deviceId[1]);
      //Remove old tr
      e.target.parentElement.parentElement.remove();
      //Add to device Table
      let trFragment = document.createDocumentFragment();
      let tr = document.createElement("TR");
      //Btn stuff
      let btnTd = document.createElement("TD");
      let addBtn = document.createElement("INPUT");
      addBtn.setAttribute("type", "button");
      addBtn.setAttribute("value", "Hinzufügen");
      //Kind stuff
      let kindTd = document.createElement("TD");
      if (typeof device.LampID != "undefined") {
        addBtn.setAttribute("id", "lamp:" + device.LampID);
        kindTd.textContent = "Lampe";
      } else if (typeof device.ShutterID != "undefined") {
        addBtn.setAttribute("id", "shutter:" + device.ShutterID);
        kindTd.textContent = "Rollläden";
      } else if (typeof device.RadiatorID != "undefined") {
        addBtn.setAttribute("id", "radiator:" + device.RadiatorID);
        kindTd.textContent = "Heizung";
      }
      addBtn.addEventListener("click", function (e) {
        changeSceneAddDevice(e);
      });
      btnTd.appendChild(addBtn);
      //Name stuff
      let nameTd = document.createElement("TD");
      nameTd.textContent = device.Name;

      //Append to tr and then to fragment
      tr.appendChild(btnTd);
      tr.appendChild(nameTd);
      tr.appendChild(kindTd);
      trFragment.appendChild(tr);
      document.getElementById("changeSceneAddDevices").appendChild(trFragment);
    }

    function newSceneAddDeviceListener(e) {
      //Get device Data
      let device = e.target.id.split(":");
      device = getDevice(device[0], device[1]);
      //Remove from old Table
      e.target.parentElement.parentElement.remove();
      //Add to Aktion Table
      let actionTable = document.getElementById("newSceneAktions");
      let trFragment = document.createDocumentFragment();
      let tr = document.createElement("TR");
      let aktionTd = document.createElement("TD");
      let deleteTd = document.createElement("TD");
      let deleteBtn = document.createElement("INPUT");
      deleteBtn.setAttribute("type", "button");
      deleteBtn.setAttribute("value", "Entfernen");

      deleteBtn.addEventListener("click", function (e) {
        newSceneDeleteDeviceListener(e.target);
      });

      deleteTd.appendChild(deleteBtn);
      let aktionInput = document.createElement("INPUT");
      if (typeof device.LampID != "undefined") {
        aktionInput.setAttribute("type", "checkbox");
        aktionInput.setAttribute("id", "lamp:" + device.LampID);
        deleteBtn.setAttribute("id", "lamp:" + device.LampID);
      } else if (typeof device.ShutterID != "undefined") {
        aktionInput.setAttribute("type", "number");
        aktionInput.setAttribute("max", "100");
        aktionInput.setAttribute("min", "0");
        aktionInput.setAttribute("id", "shutter:" + device.ShutterID);
        deleteBtn.setAttribute("id", "shutter:" + device.ShutterID);
      } else if (typeof device.RadiatorID != "undefined") {
        aktionInput.setAttribute("type", "number");
        aktionInput.setAttribute("max", "35");
        aktionInput.setAttribute("min", "0");
        aktionInput.setAttribute("id", "radiator:" + device.RadiatorID);
        deleteBtn.setAttribute("id", "radiator:" + device.RadiatorID);
      }
      aktionTd.appendChild(aktionInput);
      let deviceTd = document.createElement("TD");
      deviceTd.textContent = device.Name;
      tr.appendChild(aktionTd);
      tr.appendChild(deviceTd);
      tr.appendChild(deleteTd);
      trFragment.appendChild(tr);
      actionTable.appendChild(trFragment);
    }

    function newSceneDeleteDeviceListener(e) {
      let isLamp = false;
      let isShutter = false;
      let isRadiator = false;
      let kind;
      //Get clicked Device
      let btnID = e.id;
      let deviceData = e.id.split(":");
      device = getDevice(deviceData[0], deviceData[1]);
      if (deviceData[0] == "lamp") {
        isLamp = true;
        kind = "Lampe";
      } else if (deviceData[0] == "shutter") {
        isShutter = true;
        kind = "Rollladen";
      } else {
        isRadiator = true;
        kind = "Heizung";
      }
      //Remove old tr
      document.getElementById(btnID).parentElement.parentElement.remove();
      //Add to device Table
      let trFragment = document.createDocumentFragment();
      let tr = document.createElement("TR");
      //Btn stuff
      let btnTd = document.createElement("TD");
      let addBtn = document.createElement("INPUT");
      addBtn.setAttribute("type", "button");
      addBtn.setAttribute("value", "Hinzufügen");
      if (isLamp) {
        addBtn.setAttribute("id", "lamp:" + device.LampID);
      } else if (isShutter) {
        addBtn.setAttribute("id", "shutter:" + device.ShutterID);
      } else if (isRadiator) {
        addBtn.setAttribute("id", "radiator:" + deviceData.RadiatorID);
      }
      addBtn.addEventListener("click", function (e) {
        newSceneAddDeviceListener(e);
      });
      btnTd.appendChild(addBtn);
      //Name stuff
      let nameTd = document.createElement("TD");
      nameTd.textContent = device.Name;
      //Kind stuff
      let kindTd = document.createElement("TD");
      kindTd.textContent = kind;
      //Append to tr and then to fragment
      tr.appendChild(btnTd);
      tr.appendChild(nameTd);
      tr.appendChild(kindTd);
      trFragment.appendChild(tr);
      //Decide which table to use
      if (
        document.getElementById("newSceneDevicesLeft").children.length >=
        document.getElementById("newSceneDevicesRight").children.length
      ) {
        document.getElementById("newSceneDevicesRight").appendChild(trFragment);
      } else {
        document.getElementById("newSceneDevicesLeft").appendChild(trFragment);
      }

      //e.parentElement.remove();
    }

    function changeRoomEvent(e) {
      //The child divs should not call this listener
      if (e.target.className == "room" || e.target.className == "roomTitle") {
        //Get Room Data
        let currentRoom;
        let roomDevices = [];
        let otherDevices = [];
        let roomLamps = [];
        let roomShutters = [];
        let roomRadiators = [];
        let otherLamps = [];
        let otherShutters = [];
        let otherRadiators = [];
        rooms.forEach(room => {
          if (room.RoomID == e.target.id) {
            currentRoom = room;
          }
        });
        //Get devices of this room
        lamps.forEach(lamp => {
          if (lamp.RoomID == currentRoom.RoomID) {
            roomDevices.push(lamp);
            roomLamps.push(lamp);
          } else {
            otherDevices.push(lamp);
            otherLamps.push(lamp);
          }
        });
        shutters.forEach(shutter => {
          if (shutter.RoomID == currentRoom.RoomID) {
            roomDevices.push(shutter);
            roomShutters.push(shutter);
          } else {
            otherDevices.push(shutter);
            otherShutters.push(shutter);
          }
        });
        radiators.forEach(radiator => {
          if (radiator.RoomID == currentRoom.RoomID) {
            roomDevices.push(radiator);
            roomRadiators.push(radiator);
          } else {
            otherDevices.push(radiator);
            otherRadiators.push(radiator);
          }
        });
        console.log(currentRoom);
        console.log(roomDevices);
        console.log(otherDevices);
        //Delete Devices Table
        let deleteTableFragment = document.createDocumentFragment();
        for (let i = 0; i < (roomLamps.length + roomShutters.length + roomRadiators.length); i++) {
          let tr = document.createElement("TR");
          let deleteTd = document.createElement("TD");
          let deviceTd = document.createElement("TD");
          let kindTd = document.createElement("TD");
          let deleteBtn = document.createElement("INPUT");
          deleteBtn.setAttribute("type", "button");
          deleteBtn.setAttribute("value", "Entfernen");
          if (i >= roomLamps.length + roomShutters.length) {
            //Add radiators
            deleteBtn.setAttribute(
              "id",
              "radiator:" +
              roomRadiators[i - (roomLamps.length + roomShutters.length)]
              .RadiatorID
            );
            kindTd.textContent = "Heizung";
            deviceTd.textContent =
              roomRadiators[i - (roomLamps.length + roomShutters.length)].Name;
          } else if (i >= roomLamps.length) {
            //Add Shutter
            deleteBtn.setAttribute(
              "id",
              "shutter:" + roomShutters[i - roomLamps.length].ShutterID
            );
            kindTd.textContent = "Rollläden";
            deviceTd.textContent = roomShutters[i - roomLamps.length].Name;
          } else {
            //Add lamps
            deleteBtn.setAttribute("id", "lamp:" + roomLamps[i].LampID);
            kindTd.textContent = "Lampe";
            deviceTd.textContent = lamps[i].Name;
          }
          //--------------------------
          //--- Add Button listener---
          //--------------------------
          deleteBtn.addEventListener("click", function (e) {
            changeRoomDeleteDevice(e);
          });
          deleteTd.appendChild(deleteBtn);
          tr.appendChild(deleteTd);
          tr.appendChild(deviceTd);
          tr.appendChild(kindTd);
          deleteTableFragment.appendChild(tr);
        }
        document
          .getElementById("roomModalDeleteDevices")
          .appendChild(deleteTableFragment);

        //Add Devices Table
        let addTableFragment = document.createDocumentFragment();
        for (let i = 0; i < (otherLamps.length + otherRadiators.length + otherShutters.length); i++) {
          let tr = document.createElement("TR");
          let addTd = document.createElement("TD");
          let deviceTd = document.createElement("TD");
          let kindTd = document.createElement("TD");
          let addBtn = document.createElement("INPUT");
          addBtn.setAttribute("type", "button");
          addBtn.setAttribute("value", "Hinzufügen");
          if (i >= otherLamps.length + otherShutters.length) {
            //Add radiators
            addBtn.setAttribute(
              "id",
              "radiator:" +
              otherRadiators[i - (otherLamps.length + otherShutters.length)]
              .RadiatorID
            );
            kindTd.textContent = "Heizung";
            deviceTd.textContent =
              otherRadiators[i - (otherLamps.length + otherShutters.length)].Name;
          } else if (i >= otherLamps.length) {
            //Add Shutter
            addBtn.setAttribute(
              "id",
              "shutter:" + otherShutters[i - otherLamps.length].ShutterID
            );
            kindTd.textContent = "Rollläden";
            deviceTd.textContent = otherShutters[i - otherLamps.length].Name;
          } else {
            //Add lamps
            addBtn.setAttribute("id", "lamp:" + otherLamps[i].LampID);
            kindTd.textContent = "Lampe";
            deviceTd.textContent = otherLamps[i].Name;
          }
          //--------------------------
          //--- Add Button listener---
          //--------------------------
          addBtn.addEventListener("click", function (e) {
            changeRoomAddDevice(e);
          });
          addTd.appendChild(addBtn);
          tr.appendChild(addTd);
          tr.appendChild(deviceTd);
          tr.appendChild(kindTd);
          addTableFragment.appendChild(tr);
        }

        document.getElementById("updateRoomId").setAttribute("value", currentRoom.RoomID);
        document.getElementById("roomModalAddDevices").appendChild(addTableFragment);
        document.getElementById("roomName").textContent = currentRoom.Name;
        document.getElementById("changeRoomName").value = currentRoom.Name;
        showModal("roomModal");
      }
    }

    function changeRoomAddDevice(e) {
      let deleteTableFragment = document.createDocumentFragment();
      //Get Device Info
      let id = e.target.id.split(":");
      let currentDevice = getDevice(id[0], id[1]);

      let tr = document.createElement("TR");
      let deleteTd = document.createElement("TD");
      let deviceTd = document.createElement("TD");
      let kindTd = document.createElement("TD");
      let deleteBtn = document.createElement("INPUT");
      deleteBtn.setAttribute("type", "button");
      deleteBtn.setAttribute("value", "Entfernen");
      if (id[0] == "radiator") {
        //Add radiators
        deleteBtn.setAttribute("id", "radiator:" + id[1]);
        kindTd.textContent = "Heizung";
        deviceTd.textContent = currentDevice.Name;
      } else if (id[0] == "shutter") {
        //Add Shutter
        deleteBtn.setAttribute("id", "shutter:" + id[1]);
        kindTd.textContent = "Rollläden";
        deviceTd.textContent = currentDevice.Name;
      } else if (id[0] == "lamp") {
        //Add lamps
        deleteBtn.setAttribute("id", "lamp:" + id[1]);
        kindTd.textContent = "Lampe";
        deviceTd.textContent = currentDevice.Name;
      }
      //--------------------------
      //--- Add Button listener---
      //--------------------------
      deleteBtn.addEventListener("click", function (e) {
        changeRoomDeleteDevice(e);
      });

      deleteTd.appendChild(deleteBtn);
      tr.appendChild(deleteTd);
      tr.appendChild(deviceTd);
      tr.appendChild(kindTd);
      deleteTableFragment.appendChild(tr);
      //Remove old Device
      e.target.parentElement.parentElement.remove();
      document.getElementById("roomModalDeleteDevices").appendChild(deleteTableFragment);
    }

    function changeRoomDeleteDevice(e) {
      //Get Device Info
      let id = e.target.id.split(":");
      let currentDevice = getDevice(id[0], id[1]);

      let addTableFragment = document.createDocumentFragment();
      let tr = document.createElement("TR");
      let addTd = document.createElement("TD");
      let deviceTd = document.createElement("TD");
      let kindTd = document.createElement("TD");
      let addBtn = document.createElement("INPUT");
      addBtn.setAttribute("type", "button");
      addBtn.setAttribute("value", "Hinzufügen");
      if (id[0] == "radiator") {
        //Add radiators
        addBtn.setAttribute("id", "radiator:" + id[1]);
        kindTd.textContent = "Heizung";
        deviceTd.textContent = currentDevice.Name;
      } else if (id[0] == "shutter") {
        //Add Shutter
        addBtn.setAttribute("id", "shutter:" + id[1]);
        kindTd.textContent = "Rollläden";
        deviceTd.textContent = currentDevice.Name;
      } else if (id[0] == "lamp") {
        //Add lamps
        addBtn.setAttribute("id", "lamp:" + id[1]);
        kindTd.textContent = "Lampe";
        deviceTd.textContent = currentDevice.Name;
      }
      //--------------------------
      //--- Add Button listener---
      //--------------------------
      addBtn.addEventListener("click", function (e) {
        changeRoomAddDevice(e);
      });
      addTd.appendChild(addBtn);
      tr.appendChild(addTd);
      tr.appendChild(deviceTd);
      tr.appendChild(kindTd);
      addTableFragment.appendChild(tr);
      //Remove old Device
      e.target.parentElement.parentElement.remove();
      document.getElementById("roomModalAddDevices").appendChild(addTableFragment);
    }
    //----------------------------
    //---Ajaxcalls other method---
    //----------------------------
    function ajaxCallsMethod(method, path, data) {
      console.log("Send: " + data + " to " + path + " via " + method);
      return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
          resolve(xhr);
        });
        xhr.open(method, path, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
      });
    }
    //add Eventlistener to sidebar
    document.getElementsByClassName("settings")[0].addEventListener("click", function () {
      showModal("settings");
    });
    document.getElementsByClassName("newDevice")[0].addEventListener("click", function () {
      showModal("newDevice");
    });
    document.getElementsByClassName("newRoom")[0].addEventListener("click", function () {
      showModal("newRoom");
    });
    document.getElementsByClassName("newScene")[0].addEventListener("click", function () {
      showModal("newScene");
    });
    document.getElementsByClassName("logout")[0].addEventListener("click", function () {
      logout();
    });
    //Eventlistener for the modals
    //Close Modals with the "X" in the top right
    let allX = document.getElementsByClassName("closeX");
    [].forEach.call(allX, function (element) {
      element.addEventListener("click", function () {
        //Close Modal
        element.parentElement.style.display = "none";
        //Clear tables 
        clearTable("newSceneDevicesRight");
        clearTable("newSceneDevicesLeft");
        clearTable("newSceneAktions");
        clearTable("roomModalDeleteDevices");
        clearTable("roomModalAddDevices");
        clearTable("changeSceneAddDevices");
        clearTable("changeSceneDeleteDevices");
        //Unblur Page
        document.getElementsByClassName("container")[0].style.filter =
          "blur(0)";
        //Enable other Pagecontent
        document
          .getElementsByClassName("container")[0]
          .classList.remove("disabled");
      });
    });
    //Create Room from Modal
    document.getElementById("newRoomCreate").addEventListener("click", function (e) {
      let name = {
        Name: document.getElementById("newRoomName").value
      };
      ajaxCallsMethod("POST", "/api/room", JSON.stringify(name)).then(
        function (res) {
          response = JSON.parse(res.responseText);
          if (response) {
            hideModal("newRoom");
            getRoom(roomDOM);
          } else {
            //TODO Modal for Errors maybe?
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Create Device from Modal
    document.getElementById("newDeviceCreate").addEventListener("click", function (e) {
      //Get values
      let kind = document.getElementById("newDeviceKind").value;
      let room = parseInt(document.getElementById("newDeviceRoom").value);
      let name = document.getElementById("newDeviceName").value;
      let device = {
        Name: name,
        RoomID: room
      };
      let url = "/api/" + kind;
      ajaxCallsMethod("POST", url, JSON.stringify(device)).then(
        function (res) {
          console.log(res);
          hideModal("newDevice");
          getRoom(roomDOM);
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Create new Scene from Modal
    document.getElementById("newSceneCreate").addEventListener("click", function (e) {
      //Get values
      let name = document.getElementById("newSceneName").value;
      //time
      let time = document.getElementById("newSceneTime").value;
      let timepoint;
      if (time == "time") {
        timepoint = document.getElementById("newScenePointInTime").value;
      }
      let sunset = false;
      let sunrise = false;
      if (time == "sunrise") {
        sunrise = true;
      } else if (time == "sunset") {
        sunset = true;
      }
      //Offsets
      let posOffset = document.getElementById("posOffset").value;
      let negOffset = document.getElementById("negOffset").value;
      //Devices
      let aktions = document.getElementById("newSceneAktions").children;
      let inputLamps = [],
        inputShutters = [],
        inputRadiators = [];
      [].forEach.call(aktions, function (aktion) {
        if (aktion.tagName == "TR") {
          let inputs = aktion.getElementsByTagName("input");
          let id, value;
          [].forEach.call(inputs, function (input) {
            if (input.type != "button") {
              id = input.id.split(":");
              if (id[0] == "lamp") {
                let lamp = getDevice("lamp", id[1]);
                if (input.checked) {
                  lamp.status = 0;
                } else {
                  lamp.status = 1;
                }
                inputLamps.push(lamp);
              } else if (id[0] == "shutter") {
                let shutter = getDevice("shutter", id[1]);
                if (parseInt(input.value) > 100) {
                  shutter.status = 100;
                } else if (parseInt(input.value) < 0) {
                  shutter.status = 0;
                } else {
                  shutter.status = parseInt(input.value);
                }
                inputShutters.push(shutter);
              } else if (id[0] == "radiator") {
                let radiator = getDevice("radiator", id[1]);
                if (parseInt(input.value) > 35) {
                  radiator.status = 35;
                } else if (parseInt(input.value) < 0) {
                  radiator.status = 0;
                } else {
                  radiator.status = parseInt(input.value);
                }
                inputRadiators.push(radiator);
              }
              value = input.value;
            }
          });
        }
      });
      console.log(inputLamps);
      console.log(inputShutters);
      console.log(inputRadiators);
      let scene = {
        userid: user.UserID,
        name: name,
        active: true,
        time: timepoint,
        sunset: sunset,
        sunrise: sunrise,
        posOffset: parseInt(posOffset),
        negOffset: parseInt(negOffset),
        lamps: inputLamps,
        shutters: inputShutters,
        radiators: inputRadiators
      };
      ajaxCallsMethod("POST", "/api/scene", JSON.stringify(scene)).then(
        function (res) {
          console.log(res);
          hideModal("newScene");
          getScene(sceneDOM);
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Delete User from Settings Modal
    document.getElementById("settingsDeleteUser").addEventListener("click", function (e) {
      ajaxCallsMethod("DELETE", "/api/settings", "deleteUser").then(
        function (res) {
          var cookies = document.cookie.split(";");

          for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = cookie.substr(0, eqPos);
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }

          window.location.replace("/register");
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Delete Room from roomModal
    document.getElementById("deleteRoom").addEventListener("click", function (e) {
      //New devices, every device can only be in one Room
      let deviceTable = document.getElementById("roomModalDeleteDevices");
      let deleteRoomLamps = [];
      let deleteRoomShutters = [];
      let deleteRoomRadiators = [];
      [].forEach.call(deviceTable.children, function (tr) {
        if (tr.tagName == "TR") {
          let deviceId = tr.children[0].children[0].id.split(":");
          if (deviceId[0] == "lamp") {
            deleteRoomLamps.push(getDevice(deviceId[0], deviceId[1]));
          } else if (deviceId[0] == "shutter") {
            deleteRoomShutters.push(getDevice(deviceId[0], deviceId[1]));
          } else if (deviceId[0] == "radiator") {
            deleteRoomRadiators.push(getDevice(deviceId[0], deviceId[1]));
          }
        }
      });
      let id = document.getElementById("updateRoomId").value;
      //Update room with Ajax
      //Create Objekt
      let deleteRoom = {
        RoomID: parseInt(id),
        Lamps: deleteRoomLamps,
        Shutters: deleteRoomShutters,
        Radiators: deleteRoomRadiators
      };

      ajaxCallsMethod("DELETE", "/api/room", JSON.stringify(deleteRoom)).then(
        function (res) {
          console.log(res);
          if (JSON.parse(res.responseText) == true) {
            hideModal("updateRoom");
            getRoom(roomDOM);
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Change Room from roomModal
    document.getElementById("saveRoomSettings").addEventListener("click", function (e) {
      //Get Room Data
      //New Name (Old is default)
      let name = document.getElementById("changeRoomName").value;
      let id = document.getElementById("updateRoomId").value;
      //New devices, every device can only be in one Room
      let deviceTable = document.getElementById("roomModalDeleteDevices");
      let updateRoomLamps = [];
      let updateRoomShutters = [];
      let updateRoomRadiators = [];
      [].forEach.call(deviceTable.children, function (tr) {
        if (tr.tagName == "TR") {
          let deviceId = tr.children[0].children[0].id.split(":");
          if (deviceId[0] == "lamp") {
            updateRoomLamps.push(getDevice(deviceId[0], deviceId[1]));
          } else if (deviceId[0] == "shutter") {
            updateRoomShutters.push(getDevice(deviceId[0], deviceId[1]));
          } else if (deviceId[0] == "radiator") {
            updateRoomRadiators.push(getDevice(deviceId[0], deviceId[1]));
          }
        }
      });
      //Update room with Ajax
      //Create Objekt
      let updateRoom = {
        Name: name,
        RoomID: parseInt(id),
        Lamps: updateRoomLamps,
        Shutters: updateRoomShutters,
        Radiators: updateRoomRadiators
      };
      //Send Object
      ajaxCallsMethod("UPDATE", "/api/room", JSON.stringify(updateRoom)).then(
        function (res) {
          console.log(res);
          if (JSON.parse(res.responseText) == true) {
            hideModal("updateRoom");
            getRoom(roomDOM);
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Delete scene from Scenemodal
    document.getElementById("deleteScene").addEventListener("click", function (e) {
      let id = document.getElementById("sceneId").value;
      let scene = {
        SceneID: parseInt(id)
      };
      ajaxCallsMethod("DELETE", "/api/scene", JSON.stringify(scene)).then(
        function (res) {
          response = JSON.parse(res.responseText);
          console.log(response);
          if (response) {
            hideModal("updateScene");
            getScene(sceneDOM);
          } else {
            //TODO Modal for Errors maybe?
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Change scene from Scenemodal
    document.getElementById("saveSceneSettings").addEventListener("click", function (e) {
      //Get Name 
      let updatedScene = {};
      let id = document.getElementById("sceneId").value;
      updatedScene.sceneid = parseInt(id);
      let name = document.getElementById("changeSceneName").value;
      updatedScene.name = name;
      //Get Devices (with Aktions)
      let deviceTable = document.getElementById("changeSceneDeleteDevices");
      let updateSceneLamps = [];
      let updateSceneShutters = [];
      let updateSceneRadiators = [];
      [].forEach.call(deviceTable.children, function (tr) {
        if (tr.tagName == "TR") {
          let deviceId = tr.children[0].children[0].id.split(":");
          let status = tr.children[0].children[0].value;
          if (deviceId[0] == "lamp") {
            let currentLamp = getDevice(deviceId[0], deviceId[1]);
            if (tr.children[0].children[0].checked) {
              currentLamp.Status = 1;
            } else {
              currentLamp.Status = 0;
            }
            updateSceneLamps.push(currentLamp);
          } else
          if (deviceId[0] == "shutter") {
            let currentShutter = getDevice(deviceId[0], deviceId[1]);
            if (parseInt(tr.children[0].children[0].value) > 100) {
              currentShutter.Status = 100;
            } else if (parseInt(tr.children[0].children[0].value) < 0) {
              currentShutter.Status = 0;
            } else {
              currentShutter.Status = parseInt(tr.children[0].children[0].value);
            }
            updateSceneShutters.push(currentShutter);
          } else if (deviceId[0] == "radiator") {
            let currentRadiator = getDevice(deviceId[0], deviceId[1]);
            if (parseInt(tr.children[0].children[0].value) > 35) {
              currentRadiator.Status = 35;
            } else if (parseInt(tr.children[0].children[0].value) < 0) {
              currentRadiator.Status = 0;
            } else {
              currentRadiator.Status = parseInt(tr.children[0].children[0].value);
            }

            updateSceneRadiators.push(currentRadiator);
          }
        }
      });
      updatedScene.lamps = updateSceneLamps;
      updatedScene.shutters = updateSceneShutters;
      updatedScene.radiators = updateSceneRadiators;
      //Get timestamp (with offset)
      let timeHelper = document.getElementById("changeSceneTime").value;
      updatedScene.time = "";
      updatedScene.sunrise = false;
      updatedScene.sunset = false;
      if (timeHelper == "time") {
        updatedScene.time = document.getElementById("changeScenePointInTime").value;
      } else if (timeHelper == "sunrise") {
        updatedScene.sunrise = true;
      } else if (timeHelper == "sunset") {
        updatedScene.sunset = true;
      }
      updatedScene.posoffset = parseInt(document.getElementById("changeScenePosOffset").value);
      updatedScene.negoffset = parseInt(document.getElementById("changeSceneNegOffset").value);
      updatedScene.active = true;
      updatedScene.userid = user.UserID;
      console.log(updatedScene);
      ajaxCallsMethod("UPDATE", "/api/scene", JSON.stringify(updatedScene)).then(
        function (res) {
          if (JSON.parse(res.responseText)) {
            getScene(sceneDOM);
            hideModal("updateScene");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Delete Lamp from Lampmodal
    document.getElementById("deleteLampModal").addEventListener("click", function (e) {
      let lamp = getDevice("lamp", document.getElementById("lampModalIDHolder").value);
      ajaxCallsMethod("DELETE", "/api/lamp", JSON.stringify(lamp)).then(
        function (res) {
          if (JSON.parse(res.responseText)) {
            getRoom(roomDOM);
            hideModal("lampModal");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Change Lamp from Lampmodal
    document.getElementById("saveLampModal").addEventListener("click", function (e) {
      let lamp = getDevice("lamp", document.getElementById("lampModalIDHolder").value);
      lamp.Name = document.getElementById("lampNameInput").value;
      let status = document.getElementById("lampModalSwitch").checked;
      if (status) {
        lamp.Status = 1;
      } else {
        lamp.Status = 0;
      }
      ajaxCallsMethod("UPDATE", "/api/lamp", JSON.stringify(lamp)).then(
        function (res) {
          if (JSON.parse(res.responseText)) {
            getRoom(roomDOM);
            hideModal("lampModal");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Delete shutter from shuttermodal
    document.getElementById("deleteShutterModal").addEventListener("click", function (e) {
      let shutter = getDevice("shutter", document.getElementById("shutterModalIDHolder").value);
      ajaxCallsMethod("DELETE", "/api/shutter", JSON.stringify(shutter)).then(
        function (res) {
          if (JSON.parse(res.responseText)) {
            getRoom(roomDOM);
            hideModal("shutterModal");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Change shutter from shuttermodal
    document.getElementById("saveShutterModal").addEventListener("click", function (e) {
      let shutter = getDevice("shutter", document.getElementById("shutterModalIDHolder").value);
      shutter.Name = document.getElementById("shutterNameInput").value;
      let status = document.getElementById("shutterNumberInput").value;
      if (status > 100) {
        shutter.Status = 100;
      } else if (status < 0) {
        shutter.Status = 0;
      } else {
        shutter.Status = parseInt(status);
      }
      ajaxCallsMethod("UPDATE", "/api/shutter", JSON.stringify(shutter)).then(
        function (res) {
          if (JSON.parse(res.responseText)) {
            getRoom(roomDOM);
            hideModal("shutterModal");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Delete radiator from radiatormodal
    document.getElementById("deleteRadiatorModal").addEventListener("click", function (e) {
      let radiator = getDevice("radiator", document.getElementById("radiatorModalIDHolder").value);
      ajaxCallsMethod("DELETE", "/api/radiator", JSON.stringify(radiator)).then(
        function (res) {
          if (JSON.parse(res.responseText)) {
            getRoom(roomDOM);
            hideModal("radiatorModal");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Change radiator from radiatormodal
    document.getElementById("saveRadiatorModal").addEventListener("click", function (e) {
      let radiator = getDevice("radiator", document.getElementById("radiatorModalIDHolder").value);
      radiator.Name = document.getElementById("radiatorNameInput").value;
      let status = document.getElementById("radiatorNumberInput").value;
      if (status > 35) {
        radiator.Status = 35;
      } else if (status < 0) {
        radiator.Status = 0;
      } else {
        radiator.Status = parseInt(status);
      }
      ajaxCallsMethod("UPDATE", "/api/radiator", JSON.stringify(radiator)).then(
        function (res) {
          if (JSON.parse(res.responseText)) {
            getRoom(roomDOM);
            hideModal("radiatorModal");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    });
  },
  false
);
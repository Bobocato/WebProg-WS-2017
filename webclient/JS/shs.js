//Global Scope
//These variables can be used globally and will be used to save Ajax requests
var rooms, lamps, shutters, radiators, scenes;

//Start page when DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function () {
    getRoom(roomDOM);
    getScene(sceneDOM);
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
              lampDiv.setAttribute("id", lamp.LampID);
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
              switchSpan.addEventListener("click", function () {
                //TODO write real update listener
                console.log(lamp.LampID);
              });
              //Append lamps to RoomDiv
              //outerLampDiv.appendChild(lampDiv);
              roomDiv.appendChild(lampDiv);
            }
          });
          shutters.forEach(shutter => {
            if (shutter.RoomID == room.RoomID) {
              //Outer Div
              let shutterDiv = document.createElement("DIV");
              shutterDiv.setAttribute("class", "shutter");
              shutterDiv.setAttribute("id", shutter.ShutterID);
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
                //TODO write real update listener
                console.log(shutter.ShutterID + " and " + this.value);
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
              radiatorDiv.setAttribute("id", radiator.RadiatorID);
              //Nametag
              let radiatorName = document.createElement("H4");
              radiatorName.setAttribute("class", "radiatorTitle");
              radiatorName.textContent = radiator.Name;
              radiatorDiv.appendChild(radiatorName);
              //Input for setting radiatorstatus
              let radiatorInput = document.createElement("INPUT");
              radiatorInput.setAttribute("type", "number");
              radiatorInput.setAttribute("value", radiator.Status);
              radiatorInput.setAttribute("max", "0");
              radiatorInput.setAttribute("min", "35");
              radiatorInput.setAttribute("class", "radiatorInput");
              radiatorInput.setAttribute("id", radiator.RadiatorID);
              radiatorDiv.appendChild(radiatorInput);
              //Eventlistener
              radiatorInput.addEventListener("input", function (evt) {
                //TODO write real update listener
                console.log(radiator.radiatorID + " and " + this.value);
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
      if (sceneElement.children.length != 0) {
        [].forEach.call(sceneElement.children, function (scene) {
          scene.remove();
        });
      }
      scenes.forEach(scene => {
        let sceneFragment = document.createDocumentFragment();
        //outer Div
        let sceneDiv = document.createElement("DIV");
        sceneDiv.setAttribute("class", "scene");
        sceneDiv.setAttribute("id", scene.SceneID);
        //startButton
        let sceneStart = document.createElement("INPUT");
        sceneStart.setAttribute("type", "button");
        sceneStart.setAttribute("class", "sceneStartBtn");
        sceneStart.setAttribute("id", scene.SceneID);
        sceneStart.setAttribute("value", "Starten");
        sceneDiv.appendChild(sceneStart);
        //Name
        let sceneName = document.createElement("H4");
        sceneName.setAttribute("class", "sceneTitle");
        sceneName.textContent = scene.Name;
        sceneDiv.appendChild(sceneName);
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
        sceneDiv.appendChild(sceneTime);
        //Active or not
        //Toggle switch from https://www.w3schools.com/howto/howto_css_switch.asp
        let switchLabel = document.createElement("LABEL");
        switchLabel.setAttribute("class", "switch");
        let switchInput = document.createElement("INPUT");
        switchInput.setAttribute("type", "checkbox");
        switchInput.setAttribute("id", "Scene:" + scene.SceneID);
        if (scene.Active) {
          switchInput.setAttribute("checked", "checked");
        }
        switchLabel.appendChild(switchInput);
        let switchSpan = document.createElement("SPAN");
        switchSpan.setAttribute("class", "slider round");
        switchLabel.appendChild(switchSpan);
        sceneDiv.appendChild(switchLabel);
        //Eventlistener
        switchSpan.addEventListener("click", function () {
          //TODO write real update listener
          console.log(scene.SceneID + " and " + switchInput.checked);
        });
        sceneStart.addEventListener("click", function () {
          //TODO write real update listener
          console.log("Start: Scene " + scene.SceneID);
        });
        //Append to Dom
        sceneFragment.appendChild(sceneDiv);
        sceneElement.appendChild(sceneFragment);
      });
    }
    //----------------------------------
    //-----Show and Hide the Modals-----
    //----------------------------------
    function showModal(modalName) {
      //Blur Page
      document.getElementsByClassName("container")[0].style.filter =
        "blur(10px)";
      //Disable other Pagecontent
      document.getElementsByClassName("container")[0].classList.add("disabled");
      //TODO Show modals
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
          //TODO delete old data that could be there

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
          for (
            let i = 0; i < lamps.length + shutters.length + radiators.length; i++
          ) {
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
                addBtn.setAttribute(
                  "id",
                  "shutter:" + shutters[i - lamps.length].ShutterID
                );
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
          clearTable("newSceneDevicesRight");
          clearTable("newSceneDevicesLeft");
          clearTable("newSceneAktions");
          break;
        case "updateRoom":
          document.getElementById("roomModal").style.display = "none";
          break;
      }
    }

    function logout() {
      //TODO logout the user
    }
    //------------------------------------
    //---Eventlistener for modal inters---
    //------------------------------------
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
      /**TODO **/
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
      } else if (id[0] == "radiator") {
        //Add Shutter
        deleteBtn.setAttribute(
          "id",
          "shutter:" + id[1]);
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
                  lamp.status = 1;
                } else {
                  lamp.status = 0;
                }
                inputLamps.push(lamp);
              } else if (id[0] == "shutter") {
                let shutter = getDevice("shutter", id[1]);
                shutter.status = parseInt(input.value);
                inputShutters.push(shutter);
              } else if (id[0] == "radiator") {
                let radiator = getDevice("radiator", id[1]);
                radiator.status = parseInt(input.value);
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
          console.log(res);
        },
        function (err) {
          console.log(err);
        }
      );
    });
    //Delete Room from roomModal
    document.getElementById("deleteRoom").addEventListener("click", function (e) {
      //TODO Delete devices
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

  },
  false
);
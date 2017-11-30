//Start page when DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function() {
    showRoom();
    showScene();
    //TODO Write JS code here
    function showModal(modalName) {
      //Blur Page
      document.getElementsByClassName("container")[0].style.filter =
        "blur(10px)";
      //Disable other Pagecontent
      document.getElementsByClassName("container")[0].disabled = true;
      //TODO Show modals
      switch (modalName) {
        case "settings":
          document.getElementById("settingsModal").style.display = "block";
          break;
        case "newDevice":
          document.getElementById("deviceModal").style.display = "block";
          break;
        case "newRoom":
          document.getElementById("roomModal").style.display = "block";
          break;
        case "newScene":
          document.getElementById("sceneModal").style.display = "block";
          break;
      }
      /*
      document
      .getElementById(modalName + "Close")
      .addEventListener("click", function() {
      //Close Modal
      //Unblur Page
      document.getElementsByClassName("container")[0].style.filter = "blur(0)";
      //Enable other Pagecontent
      document.getElementsByClassName("container")[0].disabled = false;
      });
      */
    }
    function logout() {
      //TODO logout the user
    }
    //This function will male the Ajax calls for the "GET"-Part of the api
    function getData(entity) {
      //Url: /api/room
      //Method: "GET"
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function() {
        console.log(xhr);
        shortUrl = xhr.responseURL.split("api");
        let entity;
        switch (shortUrl[1]) {
          case "/room":
            entity = JSON.parse(xhr.responseText);
            console.log(entity[0]);
            break;
          case "/lamp":
            entity = JSON.parse(xhr.responseText);
            console.log(entity[0]);
            break;
          case "/scene":
            entity = JSON.parse(xhr.responseText);
            console.log(entity[0]);
            break;
          case "/shutter":
            entity = JSON.parse(xhr.responseText);
            console.log(entity[0]);
            break;
          case "/logout":
            entity = JSON.parse(xhr.responseText);
            console.log(entity);
            break;
        }
        return entity;
      });
      let url = "/api/" + entity;
      xhr.open("GET", url, true);
      xhr.send();
    }

    function showRoom() {
      //Start all Ajax calls and set promises
      let rooms, lamps, shutters;
      Promise.all([
        ajaxCalls("/api/room").then(
          function(res) {
            rooms = JSON.parse(res.responseText);
          },
          function(err) {
            console.log(err);
          }
        ),
        ajaxCalls("/api/lamp").then(
          function(res) {
            lamps = JSON.parse(res.responseText);
          },
          function(err) {
            console.log(err);
          }
        ),
        ajaxCalls("/api/shutter").then(
          function(res) {
            shutters = JSON.parse(res.responseText);
          },
          function(err) {
            console.log(err);
          }
        )
      ]).then(function() {
        //All promises are fullfilled
        console.log("All Roomdata should be here");
        console.log(rooms);
        console.log(lamps);
        console.log(shutters);
        let roomsElement = document.getElementsByClassName("rooms")[0];
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
          //"X" for deleting the room
          /*
          let closeX = document.createElement("SPAN");
          closeX.setAttribute("class", "deleteRoom");
          closeX.setAttribute("id", room.RoomID);
          closeX.textContent = "X";
          roomDiv.appendChild(closeX);
          */
          //Lamps
          lamps.forEach(lamp => {
            //let outerLampDiv = document.createElement("DIV");
            //outerLampDiv.setAttribute("class", "lamps");
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
              //"X" for deleting the lamp
              /*
              let closeX = document.createElement("SPAN");
              closeX.setAttribute("class", "deleteLamp");
              closeX.setAttribute("id", lamp.LampID);
              closeX.textContent = "X";
              lampDiv.appendChild(closeX);
              */
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
              //Append Shutter to room
              roomDiv.appendChild(shutterDiv);
            }
          });
          //Check if ".rooms" is empty
          if (
            document.getElementsByClassName("rooms")[0].children.length != 0
          ) {
            document
              .getElementsByClassName("rooms")[0]
              .children.forEach(room => {
                room.remove();
              });
          }
          //Append to fragment and then to DOM
          roomFragment.appendChild(roomDiv);
          roomsElement.appendChild(roomFragment);
        });
      });
    }

    function showScene() {
      let scenes;
      Promise.all([
        ajaxCalls("/api/scene").then(
          function(res) {
            scenes = JSON.parse(res.responseText);
          },
          function(err) {
            console.log(err);
          }
        )
      ]).then(function() {
        //All promises are fullfilled
        console.log(scenes);
        let sceneElement = document.getElementsByClassName("scenes")[0];
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

          //Append to Dom
          sceneFragment.appendChild(sceneDiv);
          sceneElement.appendChild(sceneFragment);
        });
      });
    }

    function ajaxCalls(path) {
      return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function() {
          resolve(xhr);
        });
        xhr.open("GET", path, true);
        xhr.send();
      });
    }

    //add Eventlistener to sidebar
    document
      .getElementsByClassName("settings")[0]
      .addEventListener("click", function() {
        showModal("settings");
      });
    document
      .getElementsByClassName("newDevice")[0]
      .addEventListener("click", function() {
        showModal("newDevice");
      });
    document
      .getElementsByClassName("newRoom")[0]
      .addEventListener("click", function() {
        showModal("newRoom");
      });
    document
      .getElementsByClassName("newScene")[0]
      .addEventListener("click", function() {
        showModal("newScene");
      });
    document
      .getElementsByClassName("logout")[0]
      .addEventListener("click", function() {
        logout();
      });
  },
  false
);

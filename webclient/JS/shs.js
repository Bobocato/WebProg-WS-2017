//Start page when DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function() {
    showRoom();
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
      let rooms, lamps, shutter;
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
            shutter = JSON.parse(res.responseText);
          },
          function(err) {
            console.log(err);
          }
        )
      ]).then(function() {
        //All promises are fullfilled
        console.log("All data should be here");
        console.log(rooms);
        console.log(lamps);
        console.log(shutter);
        let roomsElement = document.getElementsByClassName("rooms")[0];
        rooms.forEach(room => {
          //Fragement for one Room
          let roomFragment = document.createDocumentFragment();
          //Outer Div
          let roomDiv = document.createElement("DIV");
          roomDiv.setAttribute("class", "room");
          //Name in Div
          let nameTag = document.createElement("H2");
          nameTag.setAttribute("class", "roomTitle");
          nameTag.textContent = room.Name;
          roomDiv.appendChild(nameTag);
          //"X" for deleting the room
          let closeX = document.createElement("SPAN");
          closeX.setAttribute("class", "deleteRoom");
          closeX.setAttribute("id", room.RoomID);
          closeX.textContent = "X";
          roomDiv.appendChild(closeX);
          //Lamps
          lamps.forEach(lamp => {
            let outerLampDiv = document.createElement("DIV");
            outerLampDiv.setAttribute = ("class", "lamps");
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
              let closeX = document.createElement("SPAN");
              closeX.setAttribute("class", "deleteLamp");
              closeX.setAttribute("id", lamp.LampID);
              closeX.textContent = "X";
              lampDiv.appendChild(closeX);
              //Toggle switch from https://www.w3schools.com/howto/howto_css_switch.asp
              let switchLabel = document.createElement("LABEL");
              switchLabel.setAttribute("class", "switch");
              let switchInput = document.createElement("INPUT");
              switchInput.setAttribute("type", "checkbox");
              switchLabel.appendChild(switchInput);
              let switchSpan = document.createElement("SPAN");
              switchSpan.setAttribute("class", "slider round");
              switchLabel.appendChild(switchSpan);
              lampDiv.appendChild(switchLabel);
              //Append lamps to RoomDiv
              outerLampDiv.appendChild(lampDiv);
              roomDiv.appendChild(outerLampDiv);
            }
          });
          //Append to fragment and then to DOM
          roomFragment.appendChild(roomDiv);
          roomsElement.appendChild(roomFragment);
        });
      });

      //Url: /api/room
      //Method: "GET"
      /*
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function() {
        console.log(xhr);
        let roomFragment = document.createDocumentFragment();

        //Check if ".rooms" is empty
        if (document.getElementsByClassName("rooms")[0].children.length != 0) {
          document.getElementsByClassName("rooms")[0].children.forEach(room => {
            room.remove();
          });
        }
      });
      let url = "/api/room";
      xhr.open("GET", url, true);
      xhr.send();

      //".rooms" should be empty now => load and insert new rooms
      rooms = getData("room");
      console.log(rooms);
      console.log("does this wait");
      */
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

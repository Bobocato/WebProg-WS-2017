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
      //Check if ".rooms" is empty
      if (document.getElementsByClassName("rooms")[0].children.length != 0) {
        document.getElementsByClassName("rooms")[0].children.forEach(room => {
          room.remove();
        });
      }
      //".rooms" should be empty now => load and insert new rooms
      rooms = getData("room");
      console.log(rooms);
      console.log("does this wait");
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

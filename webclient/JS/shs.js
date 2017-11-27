//Start page when DOM is loaded
document.addEventListener(
    "DOMContentLoaded",
    function() {

        getRooms();

        //TODO Write JS code here
        function showModal (modalName){
            //Blur Page
            document.getElementsByClassName("container")[0].style.filter = "blur(10px)";
            //TODO Show modals
            switch (modalName){
            case statistics:
                break;
            case newDevice:
                break;
            case newRoom:
                break;
            case newScene:
                break;
            }
        }

        function logout(){
            //TODO logout the user
        }

        function getRooms(){
            // Url: /api/room
            //Method: "GET"
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/room", true)
            xhr.send()
            
            xhr.addEventListener("load", function(){
                console.log(xhr.responseText);
            })
        }

        function sendAjax(method, url, data ){
            let xhr = new XMLHttpRequest();
            if (data != null){
                xhr.open(method, url, true);
                xhr.send(data);
            } else {
                xhr.open(method, url, true);
                xhr.send();
            }
            
            //Callback
            xhr.addEventListener("load", function(){

            });
        }

        //add Eventlistener to sidebar
        document.getElementsByClassName("statistics")[0].addEventListener(showModal(statistics));
        document.getElementsByClassName("newDevice")[0].addEventListener(showModal(newDevice));
        document.getElementsByClassName("newRoom")[0].addEventListener(showModal(newRoom));
        document.getElementsByClassName("newScene")[0].addEventListener(showModal(newScene));
        document.getElementsByClassName("logout")[0].addEventListener(logout());

    },
    false
  );
  
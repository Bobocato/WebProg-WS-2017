//Start page when DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function() {
    //Is the User here because he got relayed back?
    let queryString = window.location.href.split("?");
    if (queryString[1] == "error=wrongUser") {
      console.log("No user with this data!");
      document.getElementById("wronguser").style.display = "block";
    } else if (queryString[1] == "error=notLoggedin") {
      console.log("Not logged in!");
      document.getElementById("nouser").style.display = "block";
    }
  },
  false
);

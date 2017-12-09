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
  //TODO implement this SHIT
  changeSceneDeleteDevice(e);
});
deleteTd.appendChild(deleteBtn);
statusTd.appendChild(statusInput);
tr.appendChild(statusTd);
tr.appendChild(deviceTd);
tr.appendChild(kindTd);
tr.appendChild(deleteTd);
deleteTableFragment.appendChild(tr);

document.getElementById("changeSceneDeleteDevices").appendChild(deleteTableFragment);
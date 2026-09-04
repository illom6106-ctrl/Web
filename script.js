let phase = 1;

function createRoom() {
  alert("Room created! ID: 123456");
  window.location = "trade.html";
}

function joinRoom() {
  let code = prompt("Enter Room ID:");
  if (code) window.location = "trade.html";
}

function depositFunds() {
  phase = 2;
  document.getElementById("phase").innerText = "Phase 2: Asset Delivery";
}

function releaseFunds() {
  phase = 4;
  document.getElementById("phase").innerText = "Phase 4: Completed - Funds Released";
}

function sendMessage() {
  let msg = document.getElementById("msg").value;
  let chat = document.getElementById("chat");
  chat.innerHTML += "<div>" + msg + "</div>";
  document.getElementById("msg").value = "";
}

function toggleMask() {
  let cred = document.getElementById("cred");
  cred.type = cred.type === "password" ? "text" : "password";
}

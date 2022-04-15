//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//-- mensaje de escribiendo
let escribir = false

//-- Pido un nombre de usuario
var user_name = prompt("Introduce tu nombre de usuario: ");
if (user_name == null || user_name == "") {
  user_name = prompt("Tiene que introducir un nombre de usuario para continuar");
}
console.log("nombre de usuario: " + user_name)

socket.emit('user_name', user_name)

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:black">' + msg + '</p>';
  // aqui tengo que poer el sonido linea 22
});

msg_entry.oninput = () => {
  if(!escribir){
    socket.send("Escribiendo...")
    escribir = true
    msg_entry.value = "";
  }
}

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}
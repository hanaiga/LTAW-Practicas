const electron = require('electron');
const ip = require('ip');
//const process = require('process');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const v_node = document.getElementById("info1");
const v_chrome = document.getElementById("info2");
const v_electron = document.getElementById("info3");
const archi = document.getElementById("info4");
const plataf = document.getElementById("info5");
const direct = document.getElementById("info6");
const num_usuarios = document.getElementById("users");
const dir_ip = document.getElementById("ip");
const code = document.getElementById("qrcode");
const boton = document.getElementById("btn_test");
const mensajes = document.getElementById("display");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal



v_node.textContent = process.versions.node;
v_chrome.textContent = process.versions.chrome;
v_electron.textContent = process.versions.electron;
//-- Obtener arquitectura
archi.textContent = process.arch;
//-- Obtener plataforma
plataf.textContent = process.platform;
//-- obtener directorio
direct.textContent = process.cwd();
//-- Obtener direccion IP

//////////////////////////////// creo q tiene q ser solo puerto
dir_ip.textContent = ("http://" + ip.address() + ":" + '9090' + '/index.html');

btn_test.onclick = () => {
    display.innerHTML += "TEST! ";
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Boton apretado");
}

//-- Numero de usuarios
electron.ipcRenderer.on('users', (event, message) => {
    console.log("Recibido: " + message);
    num_usuarios.textContent = message;
});

//-- Mensajes de los clientes
electron.ipcRenderer.on('msg_client', (event, message) => {
    console.log("Recibido!!!!!!!!!!!!!!!!: " + message);
    mensajes.innerHTML += message + "<br>";
});
//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('print', (event, message) => {
    console.log("Recibido: " + message);
    print.textContent = message;
  });
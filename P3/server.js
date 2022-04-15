//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-- contador del numero de usuarios
var usuarios

//-- Establezco los tipos de respuestas que hay
const bienvenida = 'Bienvenid@ al chat'





//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
    let url = __dirname + '/public/index.html'
  res.sendFile(url);
  console.log('nuevo acceso a la pagina principal')
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));


//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.green);

  //-- Como hay una nueva conexion, aumento el numero de usuarios
  usuarios += 1

  //-- Le mando mensaje de bienvenida al usuario nuevo
  socket.send('<p style="color:Green">' + bienvenida + '</p>');


  //-- Obtengo el nombre de usuario
  socket.on("user_name", (user_name) =>{

    console.log("nuevo usuario: " + user_name)

    //-- Mando mensaje de aviso a los demas 
    io.send('<p style="color:Green">' + user_name + " se acaba de unir al chat! " + '</p>')


    //-- Evento de desconexión
    socket.on('disconnect', function(){
      console.log('** CONEXIÓN TERMINADA **'.red);

      //-- Un usuario se acaba de desconectar, lo resto a la lista
      usuarios -= 1

      //-- Mando mensaje de aviso a los demas
      io.send('<p style="color:Green">' + user_name + " ha abandonado el chat " + '</p>')

      console.log("ha abandonado: " + user_name)

    });  

    //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
    socket.on("message", (msg)=> {
      console.log("Mensaje Recibido!: " + msg.blue);

      //-- Reenviarlo a todos los clientes conectados
      io.send(msg);
    });

  })


});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
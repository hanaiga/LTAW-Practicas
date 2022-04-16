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
var usuarios = 0

//-- Array de usuarios 
var array_usuarios = []

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
  socket.send('<h4>' + bienvenida + '</h4>');


  //-- Obtengo el nombre de usuario
  socket.on("user_name", (user_name) =>{

    array_usuarios.push(user_name)


    console.log("nuevo usuario: " + user_name)

    //-- Mando mensaje de aviso a los demas 
    io.send('<h5>' + user_name + " se acaba de unir al chat! " + '</h5>')


    //-- Evento de desconexión
    socket.on('disconnect', function(){
      console.log('** CONEXIÓN TERMINADA **'.red);

      //-- Un usuario se acaba de desconectar, lo resto a la lista
      usuarios -= 1

      //-- Mando mensaje de aviso a los demas
      io.send('<h5>' + user_name + " ha abandonado el chat " + '</h5>')

      console.log("ha abandonado: " + user_name)
      let pos = array_usuarios.indexOf(user_name);
      array_usuarios.splice(pos, 1);

    });  

    //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
    socket.on("message", (msg)=> {
      console.log("Mensaje Recibido!: " + msg.blue);
        console.log(msg.includes("/"))

        if(msg.includes("/")){
          console.log("Accediendo al menu de comandos")
          let comando = msg.split("/")[1]
          //-- Solo se envia al usuario
          switch(comando){
            case "help":
              mensaje = '<h5> Introduce uno de los siguientes comandos:</h5>' 
                        + '<h5> /list: Número de usuarios conectados</h5>'
                        + '<h5> /hello: Recibir un saludo </h5>'
                        + '<h5> /date: Fecha Actual </h5>'
                        + '<h5> /time: Las horas </h5>'
                        + '<h5> /users: Las usuarios conectados </h5>'

              socket.send(mensaje)
              break
            case "list":
              mensaje = '<h3> ---- Actualmente hay ' + usuarios + ' usuari@s conectados ---- </h3>'
              socket.send(mensaje)
              break
            case "users":
              mensaje = '<h3> ---- Los usuarios conectados son:  ' + array_usuarios + ' ---- </h3>'
              socket.send(mensaje)
              break
            case "hello":
              mensaje = "<h4> ---- ¡Hola Charlatan! ---- </h4>"
              socket.send(mensaje)
              break
            case "date":
              let date = new Date()
              mensaje = '<h3> ---- La fecha actual es: ' + date.getDate() + '-' +  date.getMonth() + '-' + date.getFullYear() + ' ---- </h3>'
              socket.send(mensaje) 
              break
            case "time":
              let time = new Date()
              mensaje = '<h3> ---- La hora actual es: ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ---- </h3> '
              socket.send(mensaje) 
              break
            default:
              mensaje = 'El comando intorducido no es reconocido <br>'
                        + 'Introduce /help para más informacion <br>'

              socket.send(mensaje)
              break
          }
        }else{
          //-- Reenviarlo a todos los clientes conectados
          io.send(msg);
        }

    });

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log(array_usuarios)

  })


});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
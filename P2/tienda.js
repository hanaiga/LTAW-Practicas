//-- Servidor tienda
//-- Importar el módulo FS
const fs = require('fs');
const http = require('http');


//-- Puerto del servidor 
const PUERTO = 9090; 

//-- LA base de datos -> tienda.json
const BASE_DATOS = fs.readFileSync("tienda.json")

//-- Obtenemos la estructura de la base de datos
 const tienda = JSON.parse(BASE_DATOS)

const FORMULARIO = fs.readFileSync('login.html', 'utf-8')

// cuando el usuario rellena el form y esta registrado
const RESPUESTA = fs.readFileSync('login-res.html', 'utf-8')

// la devuelvo si el usuario rellena el form y no esta resgtrado
const ERROR = fs.readFileSync('login-res-error.html', 'utf-8')

//-- creamos arrays para almacenar nombres de usuarios y contraseñas
let nombres = []
let contraseñas = []

//-- inicializo la variable que va a tener el content a entregar
let content

//-- Recorro la base de datos y agrego los usuarios
tienda[1]["usuarios"].forEach((element, index)=>{
  console.log("Usuario " + (index + 1) + ": " + element.usuario);
  nombres.push(element.usuario);
});
console.log(nombres)

//-- Creamos el servidor
const server = http.createServer(function(req, res) {
    
  //-- Hemos recibido una solicitud
  console.log("Petición recibida!");

  //-- Obtenemos la URL del content
  let url = new URL(req.url, 'http://' + req.headers['host']);
  console.log("La URL del content solicitado es: " + url.href)
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("  Ruta: " + url.pathname);
  console.log("  Parametros: " + url.searchParams); //-- aqui puedo ver el nombre del usuario

  //-- Obtengo los parametros rellenados en el formulario
  let nombre = url.searchParams.get('nombre')
  console.log("El nombre de usuario es: " + nombre)
  let contra = url.searchParams.get('password')
  console.log("La contraseña es: " + contra)

    //-- Aqui almaceno el content solicitado
  let content = "";

  //-- Analizo
  //-- si es el content raiz devuelvo la pag principal
  if(url.pathname == '/') { 
    content += "/tienda.html" 
  } else if (url.pathname == '/login'){
    //comprobar si hay cookie
    // ahora suponiendo que no hay mandamos formulario para que lo rellene
    content = FORMULARIO
    
    // la extension es html
    ext = "html"

  //-- Nos devuelve el formulario relleno miramos si esta registrado en la base de datos
  }else if (url.pathname == '/procesar') {
    if (nombres.includes(nombre) ) {
      console.log("usuario: " + nombre)

      // aqui tengo que dar la cooke linea 248

      console.log("usuario registrado, todo ok")
      content = RESPUESTA
      html_user = nombre
      // devuelvo este mensaje en html para el cliente
      content = content.replace("USER",html_user )
    }else{
      content = ERROR
    }
  } else { 
    content = url.pathname;
  }
  
  //-- obtengo la extension del content
  extension = content.split(".")[1]; 
  content = "." + content 

  console.log("Recurso solicitado: " + content);
  console.log("Extension del content: " + extension);

  //-- Defino tipos de mime
  const type_mime = {
    "html" : "text/html",
    "css" : "text/css",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png",
    "gif" : "image/gif",
    "ico" : "image/ico",
  }; 

  //-- Defino tipo de mime del content solicitado
  let mime = type_mime[extension];

  fs.readFile(content, function(err,data) {
    //-- Si se produce error muestro pag de error
    if(err) {

        //-- Mandamos cabecera de error
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log("404 Not Found");
      content = "error.html";
      data = fs.readFileSync(content);
       
    }else { 
        //-- Mandamos cabecera de ok
      res.writeHead(200, {'Content-Type': mime});
      console.log("200 OK")
    }
    
    // Enviamos el content solicitado
    res.write(data);
    res.end();
  });
   
});
  
//-- Activo el servidor:
server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);
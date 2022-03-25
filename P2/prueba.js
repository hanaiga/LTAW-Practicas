//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 9090;

//-- pag principal
const MAIN = fs.readFileSync('tienda.html', 'utf-8')

//-- pag de error general
const MAINERROR = fs.readFileSync('error.html', 'utf-8')

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

//-- Recorro la base de datos y agrego los usuarios
tienda[1]["usuarios"].forEach((element, index)=>{
  console.log("Usuario " + (index + 1) + ": " + element.usuario);
  nombres.push(element.usuario);
  contraseñas.push(element.password)
});
console.log(nombres)
console.log(contraseñas)

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



const server = http.createServer((req, res) => {

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
  
    //-- Por defecto entregar formulario
    let content_type = "text/html";
    let content = "";
  
    if(url.pathname == '/') { 
        content = MAIN
    } else if (url.pathname == '/procesar') {
        content_type = "text/html";
  
        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        content = RESPUESTA.replace("NOMBRE", nombre);
  
        //-- si el usuario es Chuck Norris se añade HTML extra
        let html_extra = nombre;
        content = content.replace("HTML_EXTRA", html_extra);
    }
  
     //-- obtengo la extension del content
  extension = content.split(".")[1]; 
  content = "." + content 

  
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

  let mime = type_mime[extension];
    //-- Enviar la respuesta
    res.setHeader('Content-Type', mime);
    res.write(content);
    res.end()
  
  });
});
  server.listen(PUERTO);
  console.log("Escuchando en puerto: " + PUERTO);
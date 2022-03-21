//-- Servidor tienda
//-- Importar el módulo FS
const fs = require('fs');
const http = require('http');


//-- Puerto del servidor 
const PUERTO = 9090; 

//-- Creamos el servidor
const server = http.createServer(function(req, res) {
    
  //-- Hemos recibido una solicitud
  console.log("Petición recibida!");

  //-- Obtenemos la URL del recurso
  let url = new URL(req.url, 'http://' + req.headers['host']);
  console.log("La URL del recurso solicitado es: " + url.href)

    //-- Aqui almaceno el recurso solicitado
  let recurso = "";

  //-- Analizo
  //-- si es el recurso raiz devuelvo la pag principal
  if(url.pathname == '/') { 
    recurso += "/tienda.html" 
  } else { 
    recurso = url.pathname;
  }
  
  //-- obtengo la extension del recurso
  extension = recurso.split(".")[1]; 
  recurso = "." + recurso 

  console.log("Recurso solicitado: " + recurso);
  console.log("Extension del recurso: " + extension);

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

  //-- Defino tipo de mime del recurso solicitado
  let mime = type_mime[extension];

  fs.readFile(recurso, function(err,data) {
    //-- Si se produce error muestro pag de error
    if(err) {

        //-- Mandamos cabecera de error
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log("404 Not Found");
      recurso = "html/error.html";
      data = fs.readFileSync(recurso);
       
    }else { 
        //-- Mandamos cabecera de ok
      res.writeHead(200, {'Content-Type': mime});
      console.log("200 OK")
    }
    
    // Enviamos el recurso solicitado
    res.write(data);
    res.end();
  });
   
});
  
//-- Activo el servidor:
server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);
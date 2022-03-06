//-- Servidor tienda
//-- Importar el módulo FS
const fs = require('fs');
const http = require('http');

//-- Puerto donde escuha el servidor
const PUERTO = 9090;

//-- Texto HTML de la página de error
const pagina_error = fs.readFileSync('error.html');

//-- Creo el servidor y establezco la retrollamada
const server = http.createServer((req, res)=>{

    //-- Recibida una peticion
    console.log("Petición recibida!");

    //-- Analizar el recurso y obtengo la URL del mensaje de solicitud
    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log(" URL solicitada: " + url.href)
    console.log(url.pathname)

    //-- Aqui almaceno el recurso pedido
    let recurso = ""

    //-- Analizo la solicitud
    //-- Si es el recurso raiz devuelvo la pag principal de la tienda
    if (url.pathname == '/') {
        recurso += "/tienda.html"
    }else{ //-- otro, me quedo con su recurso
        recurso += url.pathname
    }

    //-- la extension del recurso
    extension = recurso.split(".")[1]

    //-- Defino los tipos de mime
    const type_mime = {
        "html" : "text/html",
        "css"  : "text/css",
        "jpg"  : "image/jpg",
        "JPG"  : "image/jpg",
        "jpeg" : "image/jpeg",
        "png"  : "image/png",
        "gif"  : "image/gif",
        "ico"  : "image/x-icon"
    }

    //-- Defino el tipo de mime del recurso
    let mime = type_mime[extension]

    //-- Leo el fichero
    fs.readFile(recurso, function(err, data){

        //-- Si se produce error, muestro la pag de error
        if (err){
            //-- La cabecera 404 de error
            res.writeHead(404, {'Content-Type': 'text/html'})
            console.log("404 Not Found")
            data = fs.readFileSync(pagina_error)

        //-- Ningun error, cabecera de 200 ok     
        }else{
            res.writeHead(200, {'Content-Type': mime})
            console.log("200 OK")
        }

        //-- Envio el recurso solicitado 
        res.write(data)
        res.end()

    })
})

server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);


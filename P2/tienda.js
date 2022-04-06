//-- Servidor tienda
//-- Importar el módulo FS
const fs = require('fs');
const http = require('http');


//-- Puerto del servidor 
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

// los productos de la tienda
const productos = tienda[0].productos
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


//-- voy a crear un array con los nombres de los productos
let products_json = []

for (i=0; i<productos.length; i++){
  nombre_prod = Object.keys(productos[i])[0]
  productto = productos[i]
  lista_prod = productto[nombre_prod]
   products_json.push(lista_prod)
   console.log(products_json)
}

  //-- Defino tipos de mime
  const type_mime = {
    "html" : "text/html",
    "css" : "text/css",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png",
    "gif" : "image/gif",
    "ico" : "image/ico",
    "js"   : "application/javascript",
    "json": "application/json"
  }; 

  // array donde guardamos los nombres buscados
  let result_busqueda = []
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

// recurso es mi url.patchname y su solicitud es mi content
    //-- Aqui almaceno el content solicitado
  let content = "";

  //-- Analizo
  //-- si es el content raiz devuelvo la pag principal
  if(url.pathname == '/') { 
    content += "/tienda.html"
  } else if (url.pathname == '/procesar') {
    if (nombres.includes(nombre) && contraseñas.includes(contra)) {
      console.log("usuario: " + nombre)

      // aqui tengo que dar la cooke linea 248

      console.log("usuario registrado, todo ok")
      
      content = "/login-res.html"
      html_user = nombre
      
    }else{
      content += "/login-res-error.html" 
    }
  }else { 
    content = url.pathname;
  }





  let file = ""

  if(url.pathname == '/productos'){
   
    content_type = type_mime["json"];

       //-- Leer los parámetros
       let param1 = url.searchParams.get('param1');

       //-- Convertimos los caracteres alphanumericos en string
       param1 = param1.toUpperCase();
   
       console.log("Param: " +  param1);

       for (let prodc of products_json){
         prodU = prodc.toUpperCase()

         if(prodU.startsWith(param1)){
           result_busqueda.push(prodc)
         }
       }
       console.log(result_busqueda)
       busqueda = result_busqueda;
       console.log(busqueda)
       filenammee = JSON.stringify(result_busqueda);
       console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
       console.log(filenammee)
       res.setHeader('Content-Type', content_type);
       res.write(filenammee);
       res.end()
       return;

  }else if(url.pathname == './cliente.js'){
    //-- Leer fichero javascript
   // console.log("recurso: " + file);
    fs.readFile(filenammee, 'utf-8', (err,data) => {
        if (err) {
            console.log("Error: " + err)
            return;
        } else {
          console.log()
          res.setHeader('Content-Type', 'application/javascript');
          res.write(data);
          res.end();
        }
    });
    
    return;
  }else if(url.pathname == '/buscar'){

    //for (let coso of result_busqueda)
    content = "/tienda.html"
    
  }


  //-- obtengo la extension del content
  extension = content.split(".")[1]; 

  content = "." + content 

  console.log("Recurso solicitado: " + content);
  console.log("Extension del content: " + extension);


  //-- Defino tipo de mime del content solicitado
  let mime = type_mime[extension];
  


  fs.readFile(content, function(err,data) {
    //-- Si se produce error muestro pag de error
    if(err) {

        //-- Mandamos cabecera de error
      res.writeHead(404, {'Content-Type': content_type});
      console.log("404 Not Found");
      content = "error.html";
      data = fs.readFileSync(content);
       
    }else { 
        //-- Mandamos cabecera de ok
      res.writeHead(200, {'Content-Type': mime});
      console.log("200 OK")

      let file = ""
      let description = ""
      let precio = ""
      let stock = ""

      //-- login
      if (content == "./tienda.html"){
        file = fs.readFileSync('tienda.html', 'utf-8')
        //data = file.replace("<h3></h3>", '<h3> Usuario: ' + html_user + '</h3>')

      }else if (content  == "./login-res.html"){
        file = fs.readFileSync('login-res.html', 'utf-8')
        data = file.replace("HTML_EXTRA", html_user )
        file = fs.readFileSync('tienda.html', 'utf-8')
        data = file.replace("<h3></h3>", '<h3> Usuario: ' + html_user + '</h3>')

        //-- productos
      } else if (content == "./m1.html"){  
        file = fs.readFileSync('m1.html', 'utf-8')
        description = productos[0]["Descripcion"]
        precio = productos[0]["Precio"]
        stock = productos[0]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./m1.html"){  
        file = fs.readFileSync('m1.html', 'utf-8')
        description = productos[0]["Descripcion"]
        precio = productos[0]["Precio"]
        stock = productos[0]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./m2.html"){  
        file = fs.readFileSync('m2.html', 'utf-8')
        description = productos[1]["Descripcion"]
        precio = productos[1]["Precio"]
        stock = productos[1]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./m3.html"){  
        file = fs.readFileSync('m3.html', 'utf-8')
        description = productos[2]["Descripcion"]
        precio = productos[2]["Precio"]
        stock = productos[2]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./m4.html"){  
        file = fs.readFileSync('m4.html', 'utf-8')
        description = productos[3]["Descripcion"]
        precio = productos[3]["Precio"]
        stock = productos[3]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./m5.html"){  
        file = fs.readFileSync('m5.html', 'utf-8')
        description = productos[4]["Descripcion"]
        precio = productos[4]["Precio"]
        stock = productos[4]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./m6.html"){  
        file = fs.readFileSync('m6.html', 'utf-8')
        description = productos[5]["Descripcion"]
        precio = productos[5]["Precio"]
        stock = productos[5]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)

        //-- apartir de aqui productos de hombre
      }else if (content == "./h1.html"){  
        file = fs.readFileSync('h1.html', 'utf-8')
        description = productos[6]["Descripcion"]
        precio = productos[6]["Precio"]
        stock = productos[6]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./h2.html"){  
        file = fs.readFileSync('h2.html', 'utf-8')
        description = productos[7]["Descripcion"]
        precio = productos[7]["Precio"]
        stock = productos[7]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./h3.html"){  
        file = fs.readFileSync('h3.html', 'utf-8')
        description = productos[8]["Descripcion"]
        precio = productos[8]["Precio"]
        stock = productos[8]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./h4.html"){  
        file = fs.readFileSync('h4.html', 'utf-8')
        description = productos[9]["Descripcion"]
        precio = productos[9]["Precio"]
        stock = productos[9]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./h5.html"){  
        file = fs.readFileSync('h5.html', 'utf-8')
        description = productos[10]["Descripcion"]
        precio = productos[10]["Precio"]
        stock = productos[10]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }else if (content == "./h6.html"){  
        file = fs.readFileSync('h6.html', 'utf-8')
        description = productos[11]["Descripcion"]
        precio = productos[11]["Precio"]
        stock = productos[11]["Stock"]

        //-- Cambio los datos de la base en el producto
        data = file.replace("DESCRIPCION", description)
        data = data.replace("PRECIO", precio)
        data = data.replace("STOCK", stock)
      }


    }
    
    // Enviamos el content solicitado
    res.write(data);
    res.end();
  });
   
});
  
//-- Activo el servidor:
server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);
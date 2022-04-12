//-- Servidor tienda
//-- Importar el módulo FS
const fs = require('fs');
const http = require('http');


//-- Puerto del servidor 
const PUERTO = 9090; 


const base = "tienda.json"

//-- LA base de datos -> tienda.json
const BASE_DATOS = fs.readFileSync("tienda.json")

//-- Obtenemos la estructura de la base de datos
const tienda = JSON.parse(BASE_DATOS)

//-- Los productos de la tienda
const productos = tienda[0].productos

//-- para guardar pedidos
const fin_pedido = tienda[2]["tramitar"]

//-- creamos arrays para almacenar nombres de usuarios y contraseñas
let nombres = []
let contraseñas = []

//-- Recorro la base de datos y agrego los usuarios
tienda[1]["usuarios"].forEach((element, index)=>{
  console.log("Usuario " + (index + 1) + ": " + element.usuario);
  nombres.push(element.usuario);
  contraseñas.push(element.password)
});


//-- Array con los nombres de los productos
let products_json = []

//--Array con los productos que se meten en la cesta
let productos_cesta = []

//-- Recorro la base y meto los nombres de los productos en el array
for (i=0; i<productos.length; i++){
  nombre_prod = Object.keys(productos[i])[0]
  productto = productos[i]
  lista_prod = productto[nombre_prod]
  products_json.push(lista_prod)

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

//-- Creamos el servidor
const server = http.createServer(function(req, res) {
    
  //-- Hemos recibido una solicitud
  console.log("Petición recibida!");

  let pedido = ''
  let cantidad = ''
  let nombre_user
  let cookie_pedido

  //-- leemos las cookies que hay
  const cookie = req.headers.cookie

 //-- tenemos cookies
  if (cookie){
    //-- las cookies que tenemos 
    console.log(cookie)

    //-- obtengo cada cookie 
    let cookies = cookie.split(";")

    //-- Recorro las cookies obtenidas
    cookies.forEach((element) => {

      //-- Obtengo la cookie completa con el valor
      let[elemento, valor] = element.split('=')

      //-- Miro si la cookie es de tipo user
      if(elemento.trim() === 'user'){
        nombre_user = valor
        console.log(nombre_user)
      }else if (elemento.trim() === 'cesta'){
        cookie_pedido = valor
      }
    })

  }else{
    console.log("No hay cookies")
  }

  //-- Obtenemos la URL del content
  let url = new URL(req.url, 'http://' + req.headers['host']);
  console.log("La URL del content solicitado es: " + url.href)
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("  Ruta: " + url.pathname);
  console.log("  Parametros: " + url.searchParams); //-- aqui puedo ver el nombre del usuario

  //-- Obtengo los parametros rellenados en el formulario
  nombre = url.searchParams.get('nombre')
  console.log("El nombre de usuario es: " + nombre)
  let contra = url.searchParams.get('password')
  console.log("La contraseña es: " + contra)
  let direccion = url.searchParams.get('direccion')
  console.log("La direccion es: " + direccion)
  let tarjeta = url.searchParams.get('tarjeta')
  console.log("El numero de tarjeta es: " + tarjeta)

  //-- Aqui almaceno el content solicitado
  let content = "";

  //-- Añado el numero de tarjeta y direccion si no son vacio
  if((direccion != null) && (tarjeta != null)){

    let tramite = {
      "usuario": nombre_user,
      "productos": productos_cesta,
      "tarjeta": tarjeta,
      "direccion": direccion
    }

    //-- Agrego los detalles del pedido en la base Json
    fin_pedido.push(tramite)

    //-- Convierto la variable a cadena JSON
    let mytienda = JSON.stringify(tienda);

    //-- la guardo en el fichero destino
    fs.writeFileSync(base, mytienda);
  }

  //-- Analizo
  //-- si es el content raiz devuelvo la pag principal
  if(url.pathname == '/') { 

    content += "/tienda.html"

  } else if (url.pathname == '/procesar') {

    //-- Miro si el nombre esta registrado o no
    if (nombres.includes(nombre) && contraseñas.includes(contra)) {
     
      console.log("usuario: " + nombre)

      console.log("usuario registrado, todo ok")
      
      content = "/login-res.html"
      html_user = nombre

      //-- Guardamos la cookie del registro
      res.setHeader('Set-Cookie', "user=" + nombre)
      
    }else{
      content += "/login-res-error.html" 
    }

    //-- Añadiendo productos a la cesta
  }else if(url.pathname == '/cestam1' || url.pathname == '/cestam2' ||url.pathname == '/cestam3' ||
    url.pathname == '/cestam4' || url.pathname == '/cestam5' ||url.pathname == '/cestam6' ||
    url.pathname == '/cestah1' ||url.pathname == '/cestah2' ||url.pathname == '/cestah3' ||
    url.pathname == '/cestah4' ||url.pathname == '/cestah5' ||url.pathname == '/cestah6' ||url.pathname == '/cesta' ){
    
      //-- Defino a que producto equivale cada path
      switch(url.pathname){
        case '/cestam1':
          produx = 'LANCOME'
          break
        case '/cestam2':
          produx = 'YVES SAINT LAURENT'
          break
        case '/cestam3':
          produx = 'JIMMY CHOO'
          break
        case '/cestam4':
          produx = 'TOUS'
          break
        case '/cestam5':
          produx = 'CHLOE'
          break
        case '/cestam6':
          produx = 'MARC JACOBS'
          break
        case '/cestah1':
          produx = 'PACO RABENNE'
          break
        case '/cestah2':
          produx = 'DIOR'
          break
        case '/cestah3':
          produx =  'HUGO BOSS'
          break
        case '/cestah4':
          produx = 'CAROLINA HERRERA'
          break
        case '/cestah5':
          produx = 'BEVERLY HILLS'
          break
        case '/cestah6':
          produx = 'RALPH LAUREN'
          break
        case '/cesta':
          produx = ''
          break
        default:
          content += "error.html"
          break
      }
   
      //-- Agrego productos al carrito
      if (produx != ''){
        productos_cesta.push(produx);
      }

      cantidad = productos_cesta.length
  
      let cookie_cesta = ''

    //-- Recorro los productos de la cesta para añadirlos a la cookie
    for (i=0; i<productos_cesta.length; i++){
      produc_cesta = productos_cesta[i]
      pedido += (produc_cesta + '<br>' + '<br>') 
      cookie_cesta += (produc_cesta + ', ') 
    }

    //-- Guardamos la cookie del pedido
    res.setHeader('Set-Cookie', "cesta=" + cookie_cesta)
    content += "/compra.html"
    content = content.replace('CERO', cantidad)
    content = content.replace('CESTA', pedido)

    //-- Procesar la compra
  }else if(url.pathname == '/finalizar'){

    //-- Si esta iniciado sesion se puede procesar sino no.
    if(nombre_user){
      content += "/finalizar.html"
    }else{
      content += "/cesta-mal.html"
    }
    
  }else { 
    content = url.pathname;
  }

  const fichero = "result-Json.json";
  const buscado = fs.readFileSync(fichero);
  const resultBusq = JSON.parse(buscado); 

  //-- Busqueda
  if(url.pathname == '/productos'){
   
    content_type = type_mime["json"];
    //-- Array donde guardamos los nombres buscados
    let result_busqueda = []

    //-- Leo los parámetros
    let param1 = url.searchParams.get('param1');

    //-- Convertimos los caracteres en string
    param1 = param1.toUpperCase();
   
    console.log("Param: " +  param1);

    let busqueda = ""
        
    for (let prodc of products_json){
      prodU = prodc.toUpperCase()
      //-- Si el producto coincide con alguna busqueda lo añado
      if(prodU.startsWith(param1)){
        result_busqueda.push(prodc)
      }
    }

    busqueda = result_busqueda;
    filenammee = JSON.stringify(result_busqueda);
    fs.writeFileSync('result-json.json', filenammee);

    res.setHeader('Content-Type', content_type);
    res.write(filenammee);
    res.end()
    return;

  //-- Si le damos al boton de buscar
  }else if(url.pathname == '/buscar'){

    if (resultBusq == "LANCOME"){
      content = "/m1.html"
    }else if (resultBusq == "YVES SAINT LAURENT"){
      content = "/m2.html"
    }else if (resultBusq == "JIMMY CHOO"){
      content = "/m3.html"
    }else if (resultBusq == "TOUS"){
      content = "/m4.html"
    }else if (resultBusq == "CHLOE"){
      content = "/m5.html"
    }else if (resultBusq == "MARC JACOBS"){
      content = "/m6.html"
    }else if (resultBusq == "PACO RABENNE"){
      content = "/h1.html"
    }else if (resultBusq == "DIOR"){
      content = "/h2.html"
    }else if (resultBusq == "HUGO BOSS"){
      content = "/h3.html"
    }else if (resultBusq == "CAROLINA HERRERA"){
      content = "/h4.html"
    }else if (resultBusq == "BEVERLY HILLS"){
      content = "/h5.html"
    }else if (resultBusq == "RALPH LAUREN"){
      content = "/h6.html"
    }else{
      content = "/tienda.html"
    }
    
  }

  //-- Obtengo la extension del content
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

      //-- Login
      if (content == "./tienda.html"){

        file = fs.readFileSync('tienda.html', 'utf-8')
        //-- Compruebo si hay cookie muestro el usuario sino no
        if(nombre_user){
          data = file.replace("<h3></h3>", '<h3> Usuario: ' + nombre_user + '</h3>')
        }else{
          data = file
        }

      }else if (content == "./m1.html"){  
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


      }else if(content == "./compra.html"){

        file = fs.readFileSync('compra.html', 'utf-8')

        //-- compruebo si hay cookie muestro lo que haya en cesta sino lo otro
        if(cookie_pedido){
          espacio = ('<br>')
          data = file.replace('CERO', cantidad)
          data = data.replace('CESTA', pedido)
        }else{
          espacio = ('<br>')
          data = file.replace('CERO', cantidad)
          data = data.replace('CESTA', pedido)
          
        } 
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
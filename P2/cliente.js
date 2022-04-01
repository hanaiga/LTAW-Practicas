console.log("Ejecutando Javascript...");

//-- Obtenemos el display donde vamos a mostrar las busquedas realizadas.
const display1 = document.getElementById("display1");

//-- La caja de las busquedas
const caja = document.getElementById("caja");

//-- Funcion de retrollamada
caja.oninput = () => {

    //-- Creamos objeto para hacer peticiones AJAX
    const m = new XMLHttpRequest();

    //-- Función de callback que se invoca cuando
    //-- hay cambios de estado en la petición
    m.onreadystatechange = () => {

        //-- Petición enviada y recibida. Todo OK!
        if (m.readyState==4) {
                console.log("###############################################")
            //-- Solo la procesamos si la respuesta es correcta
            if (m.status==200) {

                //-- La respuesta es un objeto JSON
                let productos = JSON.parse(m.responseText)
                console.log(productos);

                //-- Borrar el resultado anterior
                display1.innerHTML = "";

                //--Recorrer los productos del objeto JSON
                for (let i=0; i < productos.length; i++) {
                 
                    //-- Escribir en el display
                    display1.innerHTML += productos[i];
                                            
                    
                }

            } else {
                //-- Hay un error en la petición
                //-- Lo notificamos en la consola y en la propia web
                console.log("Error en la petición: " + m.status + " " + m.statusText);
               // display2.innerHTML += '<p>ERROR</p>'
            }
        }
    }

    console.log(caja.value.length);

    //-- Peticion AJAX de busqueda
    //-- La peticion se realia solo si hay al menos 3 carácter
    if (caja.value.length >=3) {

      //-- Configurar la petición
      m.open("GET","/productos?param1=" + caja.value, true);

      //-- Enviar la petición!
      m.send();
      
    } else {
        display1.innerHTML="";
    }
}
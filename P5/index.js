const qrcode = require('qrcode');
const code = document.getElementById("qrcode");


url = ("http://" + ":" + '9090');

   
//-- Generar el codigo qr de la url
   qrcode.toDataURL(url , function (err, url) {
       code.src = 'hola';
   });
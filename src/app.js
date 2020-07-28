const fs = require('fs');
const regEx = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s\n]+)(?=\))/g;

const rutaRelativa = '../README.md'
const rutaAbsoluta = 'C:\Users\User\Documents\laboratoria\front-end\burguer-queen'
const rutaErr = './xguuytu'

fs.readFile("README.md", "utf-8", (err ,file) => {
  if (err){
    console.log(err);
  } else {
    const linkFound = file.match(regEx)
    console.log(linkFound);
  }
})

//const file = fs.readdir('../',(error, file)=>{
//  if (error){
//    throw error;
//  }
//  console.log('me trae la lista de archivos',file)
//
//  fs.readFile('../README.md', 'UTF-8', (error, archivo) => {
//    if (error){
//      throw error;
//    }
//    console.log (archivo);
//  })
//  console.log('Contenido de Archivo');
//});

//Validar que un archivo existe
const archivo = 'README.md'
const valideFile = fs.access(archivo, fs.constants.F_OK, (err) => {
  if (err){
    console.log('El archivo no existe');
  } else {
    console.log('El archivo si existe');
  }
})

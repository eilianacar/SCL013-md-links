#!/usr/bin/env node
'use strict';
const path = require('path');
const {
  readFile,
  readDirectoryFiles,
  stadistics
} = require('./src/fileReaded');

const mdLinks = (route) => {
  let searchMd = '.md'
  let indexFile = route.includes(searchMd);
  // proceso el path y veo que es
  if (indexFile != false) {
    readFile(route, "utf-8")
      .then(response => {
        commandResponse(response, route);
      })
      .catch(error => console.error("Error at mdLinks: ", error));
  } else {
    readDirectoryFiles(route, "utf-8")
      .then(files => {
        files.forEach(filePath => {
          readFile(filePath)
            .then(links => {
              commandResponse(links, route);
            })
            .catch(error => {
              console.error("Error at mdLinks: ", error)
            });
        })
      })
      .catch(error => console.error("Error at mdLinks: ", error));
  }
}

const validateFileAt = (route) => {
  getLinksFromFiles(route)
  .then(allLinks=>{
    stadistics(allLinks)
    .then(resultsAllLinks => {
      const validLinks = resultsAllLinks.filter((r) => {
        if (r.linkValido) {
          return true;
        }
        return false;
      });

      console.table({
        "Valid links:": validLinks.length,
        "Not valid links:": (resultsAllLinks.length - validLinks.length)
      });
    })
    .catch(error =>{
      console.error("Error at getLinksFromFiles: ", error);
    });
  })
  .catch(error=>{
    console.error("Error at validateFileAt: ", error);
  }); 
}

const getLinksFromFiles = (route) => {
  return new Promise((resolve, reject) => {
    const getLinksFromFilesPromeses = [];
    let searchMd = '.md'
    let indexFile = route.includes(searchMd)
    if (indexFile != false) {
      getLinksFromFilesPromeses.push(new Promise((resolve, reject) => {
        readFile(route, 'utf-8')
          .then(links => {
            resolve(links) 
          })
          .catch(error => {
            reject(error)
          });
      }));
      Promise.all(getLinksFromFilesPromeses)
      .then(allLinks => {
        resolve(allLinks);
      })
      .catch(error => {
        reject(error);
      });
    } else {
      readDirectoryFiles(route, "utf-8")
        .then(files => {
          files.forEach(filePath => {
            getLinksFromFilesPromeses.push(new Promise((resolve, reject) => {
              readFile(filePath)
                .then(links => {
                  resolve(links);
                })
                .catch(error => {
                  reject(error);
                });
            }));
          }); // end For

          Promise.all(getLinksFromFilesPromeses)
          .then((promisesLinksResults = []) => {
            // los resultados de las promesas vienen asi: [["", ""], ["", ""]]
            // pero los tenemos que componer asi: ["", ".", "", ""]
            let concatenatedLinks = [];
            promisesLinksResults.forEach(promiseResult => {
              concatenatedLinks = concatenatedLinks.concat(promiseResult);
            });
            resolve(concatenatedLinks);
          })
          .catch(error => {
            reject(error);
          });
        })
        .catch(error => console.error("Error readDirectoryFiles", error))
    }
  });
}

// Obtengo nombre de la ruta
const filePathName = (route) => {
  let directories = path.dirname(route);
  let filename = path.basename(route);
  let pathOfFile = `${directories}/${filename}`;
  return pathOfFile;
}

const commandResponse = (links, route) => {
  links.map(link => {
    let pathOfFile = filePathName(route);
    let responseMdLinks = `${pathOfFile} ${link}`;
    return console.log(responseMdLinks)
  });
}

module.exports = {
  mdLinks,
  validateFileAt,
}

















// //entrypoint

//1 leer path y verificar si es un directorio o un archivo

//2 imprimir contenido del archivo o archivos para directorio

//3 agregar manejo de options --stats --validate por parte de la cli

//4 agregar funcion para el caso de validate que se encargue de realizar
//  una peticion http a la ruta para verificar su estado, imprimir ruta y estado
//  por ejemplo:
/*
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
 */
//5 agregar funcion para el caso de stats que verifique el estado de los links
//  e imprimia las estadisticas, por ejemplo:
//       total: 3
//       unique: 3

//6 agregar funcionque para elcaso de validate YYYY stats, devuelva los stats
//  con los links broken, por ejemplo"
         // Total: 3
         // Unique: 3
         // Broken: 1

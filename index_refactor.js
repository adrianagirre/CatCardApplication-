var Promise = require('promise');
const fetch = require('node-fetch');
let argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
let blend = require('@mapbox/blend');


let {
    greeting = 'Hello', who = 'You', width = 400, height = 500, color = 'Pink', size = 100
} = argv;

const firstCat = "https://cataas.com/cat/says/" + greeting + "?width=" + width + "&height=" + height + "&color" + color + "&s=" + size;
const secondCat = "https://cataas.com/cat/says/" + who + "?width=" + width + "&height=" + height + "&color" + color + "&s=" + size;


var catOne = new Promise((resolve, reject) => {
    return fetch(firstCat).then(response => {
        if (response.ok) {

            resolve(response.blob())
        } else {
            reject(new Error('error'))
        }
    }, error => {
        reject(new Error(error.message))
    })
})

var catTwo = new Promise((resolve, reject) => {
    return fetch(secondCat).then(response => {
        if (response.ok) {
            resolve(response.blob())
        } else {
            reject(new Error('error'))
        }
    }, error => {
        reject(new Error(error.message))
    })
})

Promise.all([catOne, catTwo]).then(values => {

    console.log(values);


    blend([{
                buffer: Buffer(values[0]),
                x: 20,
                y: 10
            },
            {
                buffer: Buffer(values[1]),
                x: -30,
                y: 90
            }
        ], {
            width: width * 2,
            height: height,
            format: 'jpeg',
        },
        (err, data) => {
            const fileOut = join(process.cwd(), `/cat-card.jpg`);

            writeFile(fileOut, data, 'binary', (err) => {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log("The file was saved!");
            });
        });


}).catch(reason => {
    console.log(reason)
});
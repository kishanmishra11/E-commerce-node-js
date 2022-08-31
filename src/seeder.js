require('./app');
require('./db/conn');
const seeder = require('./seeder/seeder');
const promises = [];
seeder.forEach((seed) => {
    promises.push(require(`./seeder/${seed}Seeder.js`)
        .run());
});
Promise.all(promises)
    .then(() => {
        console.log('Seeders completed');
    }, (err) => {
        console.error('Seeder error', err);
    });
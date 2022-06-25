const block = require('./infra/block');

var bobj = new block.Block("Test Block")

bobj.generateHash().then((result) => {
    console.log('Generated hash => ', result.toString());
    var bobj2 = new block.Block("Test Block 2", result.toString())

    bobj2.generateHash().then((result1) => {
        console.log('Generated hash 2 => ', result1.toString());
    })
}).catch((error) => {
    console.error('Error => ' +error)
});
const express = require('express')
const router = express.Router()

router.get('/',(req,res) => {
    res.render('index')
})

router.post('/get-name',(req,res) => {
    let guestname = req.body.guestname
    let letter = guestname[0]
    // console.log(letter)
    // res.send('ok')
    db.one('SELECT name,imageurl,diet,rank,letter FROM dinos WHERE letter = $1',[letter]).then((dino) => {
        res.render('dino-name',dino)
    })

})

router.get('/dinos',async (req,res) => {
    const dinos = await db.any('SELECT id, name, imageurl FROM dinos;')
    // console.assert(Array.isArray(dinos), 'uh-oh, dinos is not an array')
    // console.assert(dinos.length >= 1, 'dinos is empty - whats up with that?')
    // console.assert(dinos[0].id, 'the first dino does not have an id!')
    res.render('dinos',{dinos:dinos})
})

router.get('/dino-detail/:id', (req, res) => {
    const id = req.params.id

    db.one('SELECT name,imageurl,diet,rank,id FROM dinos WHERE id = $1', [id])
    .then((dino) => {
        res.render('dino-detail', dino)

    }).catch(function (x) {
        console.log("is this promise erroring out?")
        console.log(x)
        res.send(x)
    })
})


module.exports = router
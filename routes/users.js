const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/register',(req,res) => {
    res.render('register')
})

router.post('/register',(req,res) => {
    let username = req.body.username
    let password = req.body.password
    
    bcrypt.hash(password,10).then(function(hash) {
        db.none('INSERT INTO users (username,password) VALUES ($1,$2);',[username,hash])
        .then(() => {
            console.log('success')
            res.redirect('/users/login')
        })
    })
})

router.get('/login',(req,res) => {
    res.render('login')
})

router.post('/login',(req,res) => {
    let username = req.body.username
    let password = req.body.password

    db.one('SELECT id,username,password FROM users WHERE username = $1',[username])
    .then(user => {
        if(user) {
            // console.log(user)
            bcrypt.compare(password,user.password).then(function(result) {
                if(result) { 
                    
                    req.session.user = { userid: user.id, username: user.username }
                    res.redirect('/dinos')
                } else {
                    res.render('login', {message: 'Invalid username or password'})
                }
            });
        } else {
            res.render('login', {message: 'Invalid credentials'})
        }
        // what is the catch scenario here...??
    }).catch(error => res.render('login', {message: 'Invalid'}))

})

router.get('/favorites',(req,res) => {
    let id = req.session.user.userid

//SELECT dinos.name from favorites join users on favorites.userid = users.id join dinos on favorites.dinos = dinos.id  where users.id = 3  
    db.any(`SELECT * FROM (SELECT dinos.name,dinos.rank,dinos.diet,dinos.imageurl, favorites.userid FROM favorites INNER JOIN dinos ON dinos.id = favorites.dinos) as favs WHERE 
    favs.userid = $1`,[id])
    .then((dinos) => {
        // favs.push(dino)
        res.render('favorites',{dinos:dinos})
    })
})
//you don't really use '/favorites/:id' when you are doing a post
router.post('/favorites',(req,res) => {
    let id = req.session.user.userid
    let dinoId = req.body.dinoId
    console.log(id)
    console.log(dinoId)
    db.none('INSERT INTO favorites (userid, dinos) VALUES ($1, $2);',[id,dinoId])
    .then(() => {
        res.redirect('/users/favorites')
    })

})

module.exports = router
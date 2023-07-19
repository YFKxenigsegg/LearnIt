const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport')

router.get('/login', checkNotAuthenticated, async (req, res) => {
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true
}))

router.get('/register', async (req, res) => {
    res.render('auth/register')
})

router.post('/register', async (req, res) => {
    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            passwordHash: await bcrypt.hash(req.body.password, 10)
        })
        res.redirect('login')
    } catch (error) {
        res.redirect('register')
    }
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('login')
})

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router
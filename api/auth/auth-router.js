const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const Users = require('../users/users-model');
const { validateUser, usernameIsUnique, usernameExists } = require('./auth-middleware');

router.post('/register', validateUser, usernameIsUnique, async (req, res, next) => {
    try {
        const user = req.body.user;
        const hash = bcrypt.hashSync(user.password, 12);
        user.password = hash;
        let result = await Users.add(user);
        res.status(201).json(result);
    } catch(err) {
        next(err);
    }
});

router.post('/login', validateUser, usernameExists, (req, res, next) => {
    const password = req.body.password;
    if(bcrypt.compareSync(password, req.user.password) == true) {
        req.session.user = req.user;

        if(req.user.username == 'james') {
            req.session.isAdmin = true;
        }


        res.json(`Welcome back, ${req.user.username}!`);
    } else {
        next({ status: 401, message: 'invalid credentials provided!' });
    }
});

router.get('/logout', (req, res, next) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err != null) {
                next({ message: 'error while logging out' });
            } else {
                res.json('logged out');
            }
        });
    } else {
        req.end();
    }
});

module.exports = router;
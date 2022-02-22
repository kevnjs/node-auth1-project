const Users = require('../users/users-model');

function validateUser(req, res, next) {
    if(!req.body.username || typeof req.body.username != 'string' || !req.body.username.trim()) {
        next({ status: 400, message: 'username is required and must be a string' });
    } else if(!req.body.password || typeof req.body.password != 'string' || !req.body.password.trim()) {
        next({ status: 400, message: 'password is required and must be a string' });
    } else {
        req.user = {
            username: req.body.username.trim(),
            password: req.body.password.trim(),
        };
        next();
    }
}

function usernameIsUnique(req, res, next) {
    if(Users.findBy({ username: req.user.username }).first() != null) {
        next({ status: 400, message: `user '${req.user.username}' already exists!` });
    } else {
        next();
    }
}

async function usernameExists(req, res, next) {
    const user = await Users.findBy({ username: req.user.username }).first();
    if(user == null) {
        next({ status: 400, message: `user '${req.user.username}' does not exist!` });
    } else {
        req.user = user;
        next();
    }
}

function restricted(req, res, next) {
    if(req.session.user == null) {
        next({ status: 401, message: 'this endpoint is restricted!' });
    } else {
        next();
    }
}

function restrictedAdmin(req, res, next) {
    if(req.session.isAdmin != true) {
        next({ status: 401, message: 'this endpoint is restricted!' });
    } else {
        next();
    }
}


module.exports = {
    validateUser, usernameIsUnique, usernameExists, restricted
}
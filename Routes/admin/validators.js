const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users')

module.exports = {
    // sign up validator
    requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
        const existingUser = await usersRepo.getOneBy({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        } else {
            return true;
        }
    }),
    
    // sign up validator
    requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
    
    // sign up validator
    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req })=>{ 
        if (passwordConfirmation !== req.body.password){
            throw new Error('Passwords must match')
        } else {
            return true;
        }
    }),
    
    // sign in validator
    requireEmailExist: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email not found')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });
    
        if (!user) {
            throw new Error('Email not found');
        }
    }),
    
    // sign in validator
    requirePasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email })
        if (!user) {
            throw new Error('Invalid password');
        }
        
        const validPassword = await usersRepo.comparePasswords(user.password, password);
    
        if (!validPassword) {
            throw new Error('Invalid password')
        }
    }),
    
    // new product title validator
    requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40})
    .withMessage('Must be between 5 and 40 characters'),
    
    // new product price validator
    requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater then 1'),
    
}
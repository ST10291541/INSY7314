const { body } = require('express-validator');

// Banking-specific validation rules
const fullNameField = body('fullName')
  .isLength({ min: 2, max: 100 })
  .withMessage('Full name must be between 2 and 100 characters')
  .matches(/^[A-Za-z\s]+$/)
  .withMessage('Full name can only contain letters and spaces');

const idNumberField = body('idNumber')
  .isLength({ min: 8, max: 20 })
  .withMessage('ID number must be between 8 and 20 characters')
  .matches(/^[A-Z0-9]+$/)
  .withMessage('ID number can only contain letters and numbers');

const accountNumberField = body('accountNumber')
  .isLength({ min: 8, max: 12 })
  .withMessage('Account number must be between 8 and 12 digits')
  .matches(/^\d+$/)
  .withMessage('Account number can only contain numbers');

const usernameField = body('username')
  .isLength({ min: 3, max: 30 })
  .withMessage('Username must be between 3 and 30 characters')
  .matches(/^[A-Za-z0-9_]+$/)
  .withMessage('Username can only contain letters, numbers, and underscores');

const emailField = body('email')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

const passwordStrength = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Za-z]/)
  .withMessage('Password must contain at least one letter')
  .matches(/\d/)
  .withMessage('Password must contain at least one number');

// Customer registration rules
const registerRules = [
  fullNameField,
  idNumberField,
  accountNumberField,
  usernameField,
  emailField,
  passwordStrength
];

// Login rules (accepts email or username)
const loginRules = [
  body('login')
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Payment validation rules
//add swift code 
const paymentRules = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isIn(['USD', 'EUR', 'GBP', 'ZAR'])
    .withMessage('Invalid currency'),
  body('payeeAccountNumber')
    .isLength({ min: 8, max: 20 })
    .withMessage('Invalid payee account number'),
  body('payeeName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Payee name must be between 2 and 100 characters')
];

module.exports = {
  registerRules,
  loginRules,
  paymentRules
};
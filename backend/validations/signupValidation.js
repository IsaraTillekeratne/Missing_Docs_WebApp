const yup = require('yup');

const signupSchema = yup.object().shape({
    userName: yup.string().required(),
    userEmail: yup.string().email().required(),
    userPassword: yup.string().required(),
});

module.exports = signupSchema;
const yup = require('yup');

const signinSchema = yup.object().shape({
    userEmail: yup.string().email().required(),
    userPassword: yup.string().required(),
});

module.exports = signinSchema;
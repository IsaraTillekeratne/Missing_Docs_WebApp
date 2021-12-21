const adminRole = (req, res, next) => {
    if (req.userRole === 'A') {
        return next();
    } else {
        return res.send({ error: 'No admin privileges', auth: false });
    }
}

module.exports = { adminRole };
const getRole = (req, res) => {
    if (req.userRole === null) {
        res.send('<h3>You are not assigned to a role. Please try later.</h3>');
    } else {
        return req.userRole;
    }
}

module.exports = { getRole };
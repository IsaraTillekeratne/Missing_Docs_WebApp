const adminRole = (req, res, next) => {
    if (req.userRole === 'A') {
        return next();
    } else {
        return res.send({ error: 'No admin privileges', auth: false });
    }
}

const leaderRole = (req, res, next) => {
    if (req.userRole === 'L') {
        return next();
    } else {
        return res.send({ error: 'No team leader privileges', auth: false });
    }
}

const memberRole = (req, res, next) => {
    if (req.userRole === 'M') {
        return next();
    } else {
        return res.send({ error: 'No team member privileges', auth: false });
    }
}

module.exports = { adminRole, leaderRole, memberRole };
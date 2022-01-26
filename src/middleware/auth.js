const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim()
        // const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWYwZjZjZjY0MWI0NzlmY2NkMzNhMzgiLCJpYXQiOjE2NDMxODE3NzV9.6LBkgLwt58KYIIHS71k3643Vn2aVik5GKGeB1Om9PfM'
        const decoded = jwt.verify(token, 'jsonwebtoken')
        console.log(decoded)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            throw new Error('User not found')
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send({
            error: 'Please authenticate.'
        })
    }

}

module.exports = auth
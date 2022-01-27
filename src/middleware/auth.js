const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim()
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
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
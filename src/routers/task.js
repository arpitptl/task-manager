const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {

    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/tasks', auth, async (req, res) => {

    try {
        const tasks = await Task.find({
            owner: req.user._id
        })
        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)

    } catch (e) {
        res.status(500).send(e)
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidUpdates = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdates) {
        return res.status(400).send({
            error: 'Updates invalid'
        })
    }

    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }
        await task.remove()
        res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router
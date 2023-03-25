const stages = require('express').Router()
const db = require('../models')
const { Stage } = db
const { Op } = require('sequelize')


//ALL
stages.get('/', async (req, res) => {
    try {
        const foundStages = await Stage.findAll({
            order: [ [ 'date', 'ASC' ] ],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%`}
            }
        })
        res.status(200).json(foundStages)
    } catch (error) {
        res.status(500).json(error)
    }
})


//ONE
stages.get('/:name', async (req, res) => {
    try {
        const foundStage = await Stage.findOne({
            where: { stage_name: req.params.name },
            include:{ 
                model: Event, 
                as: "events",
                through: Stage_Event
            },
        })
        res.status(200).json(foundStage)
    } catch (error) {
        res.status(500).json(error)
    }
})


//CREATE
stages.post('/', async (req, res) => {
    try {
        const newStage = await Stage.create(req.body)
        res.status(200).json({
            message: 'Successfully formed a new stage',
            data: newStage
        })
    } catch(err) {
        res.status(500).json(err)
    }
})


//UPDATE
stages.put('/:id', async (req, res) => {
    try {
        const updatedStages = await Stage.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully formed ${updatedStages} stage(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})


//CANCEL
stages.delete('/:id', async (req, res) => {
    try {
        const deletedStages = await Stage.destroy({
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully destroyed ${deletedStages} stage(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = stages
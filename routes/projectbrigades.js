import express from 'express'
import ProjectBrigadesController from '../controllers/projectBrigadesController.js'

const router = new express.Router()


router.post('/create',  ProjectBrigadesController.create)
router.get('/getall', ProjectBrigadesController.getAll)
router.get('/getone/:id([0-9]+)', ProjectBrigadesController.getOne)

export default router
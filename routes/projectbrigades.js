import express from 'express'
import ProjectBrigadesController from '../controllers/projectBrigadesController.js'

const router = new express.Router()


router.post('/create',  ProjectBrigadesController.create)
router.get('/getall', ProjectBrigadesController.getAll)
router.get('/getone/:id([0-9]+)', ProjectBrigadesController.getOne)
router.put('/createPlanStart/:id([0-9]+)', ProjectBrigadesController.createPlanStart)
router.put('/createPlanFinish/:id([0-9]+)', ProjectBrigadesController.createPlanFinish)

export default router
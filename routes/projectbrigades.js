import express from 'express'
import ProjectBrigadesController from '../controllers/projectBrigadesController.js'

const router = new express.Router()


router.post('/create',  ProjectBrigadesController.create)
router.get('/getall', ProjectBrigadesController.getAll)
router.get('/getone/:id([0-9]+)', ProjectBrigadesController.getOne)
router.put('/createPlanStart/:id([0-9]+)', ProjectBrigadesController.createPlanStart)
router.put('/createPlanFinish/:id([0-9]+)', ProjectBrigadesController.createPlanFinish)
router.put('/updateBrigade/:id([0-9]+)', ProjectBrigadesController.updateBrigade)
router.delete('/delete/:id([0-9]+)', ProjectBrigadesController.delete)

export default router
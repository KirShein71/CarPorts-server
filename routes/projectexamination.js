import express from 'express'
import ProjectExaminationController from '../controllers/projectExaminationController.js'

const router = new express.Router()

router.get('/getAll',  ProjectExaminationController.getAll)
router.get('/getAllProjectBrigadeExamination/:brigadeId([0-9]+)/:projectId([0-9]+)', ProjectExaminationController.getAllProjectBrigadeExamination)
router.get('/getAllExaminationForProject/:id([0-9]+)', ProjectExaminationController.getAllExaminationForProject)
router.post('/create',  ProjectExaminationController.create)
router.put('/updateResult/:id([0-9]+)',  ProjectExaminationController.updateResult)
router.delete('/delete/:id',  ProjectExaminationController.delete)
router.delete('/deleteAllProjectBrigade/:projectId([0-9]+)/:brigadeId([0-9]+)', ProjectExaminationController.deleteAllProjectBrigade)

export default router
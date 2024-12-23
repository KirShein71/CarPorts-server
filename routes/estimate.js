import express from 'express'
import EstimateController from '../controllers/estimateController.js'

const router = new express.Router()


router.post('/create',  EstimateController.create)
router.put('/createEstimateBrigade/:id([0-9]+)', EstimateController.createEstimateBrigade)
router.get('/getall', EstimateController.getAll)
router.get('/getAllEstimatesForAllProjects', EstimateController.getAllEstimatesForAllProjects)
router.get('/getAllEstimateForBrigade/:id([0-9]+)', EstimateController.getAllEstimateForBrigade)
router.get('/getAllEstimateForBrigadeFinishProject/:id([0-9]+)', EstimateController.getAllEstimateForBrigadeFinishProject)
router.get('/getAllEstimateForBrigadeProject/:id([0-9]+)/:project([0-9]+)', EstimateController.getAllEstimateForBrigadeProject)
router.get('/getAllEstimateForProject/:id([0-9]+)', EstimateController.getAllEstimateForProject)
router.get('/getone/:id([0-9]+)', EstimateController.getOne)
router.put('/updateEstimatePrice/:id([0-9]+)', EstimateController.updateEstimatePrice)
router.put('/updateBrigadeForProject/:id([0-9]+)/:project([0-9]+)', EstimateController.updateBrigadeForProject)
router.delete('/delete/:id([0-9]+)', EstimateController.delete)
router.delete('/deleteEstimateBrigadeForProject/:id([0-9]+)/:project([0-9]+)', EstimateController.deleteEstimateBrigadeForProject)

export default router
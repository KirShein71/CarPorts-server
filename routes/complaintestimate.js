import express from 'express'
import ComplaintEstimateController from '../controllers/complaintEstimateController.js'

const router = new express.Router()


router.post('/create',  ComplaintEstimateController.create)
router.put('/createEstimateBrigade/:id([0-9]+)', ComplaintEstimateController.createEstimateBrigade)
router.get('/getall', ComplaintEstimateController.getAll)
router.get('/getAllEstimateForComplaint/:id([0-9]+)', ComplaintEstimateController.getAllEstimateForComplaint)
router.get('/getAllEstimateForBrigadeComplaint/:id([0-9]+)/:complaint([0-9]+)', ComplaintEstimateController.getAllEstimateForBrigadeComplaint)
router.get('/getAllComplaintEstimateForBrigadeForAllProject/:id([0-9]+)', ComplaintEstimateController.getAllComplaintEstimateForBrigadeForAllProject)
router.get('/getone/:id([0-9]+)', ComplaintEstimateController.getOne)
router.put('/updateEstimatePrice/:id([0-9]+)', ComplaintEstimateController.updateEstimatePrice)
router.put('/updateBrigadeForComplaint/:id([0-9]+)/:complaint([0-9]+)', ComplaintEstimateController.updateBrigadeForComplaint)
router.delete('/delete/:id([0-9]+)', ComplaintEstimateController.delete)
router.delete('/deleteEstimateBrigadeForComplaint/:id([0-9]+)/:complaint([0-9]+)', ComplaintEstimateController.deleteEstimateBrigadeForComplaint)

export default router

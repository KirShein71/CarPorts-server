import express from 'express'
import ControlTourController from '../controllers/controlTourController.js'

const router = new express.Router()


router.post('/create',  ControlTourController.create)
router.get('/getall', ControlTourController.getAll)
router.get('/getDaysSetForProjects', ControlTourController.getDaysSetForProjects)
router.get('/getone/:id([0-9]+)', ControlTourController.getOne)
router.get('/getAllNumberOfDaysSetForProject/:setId([0-9]+)', ControlTourController.getAllNumberOfDaysSetForProject)
router.get('/getAllNumberOfDaysControlTourForRegion', ControlTourController.getAllNumberOfDaysControlTourForRegion)
router.get('/getAllNumberOfDaysControlTour/:setId([0-9]+)/:projectId([0-9]+)', ControlTourController.getAllNumberOfDaysControlTour)
router.put('/updateControlTour/:id([0-9]+)', ControlTourController.updateControlTour)
router.delete('/delete/:id([0-9]+)', ControlTourController.delete)
router.put('/refreshDataControlTour/:id([0-9]+)', ControlTourController.refreshDataControlTour)


router.get('/getAllCertainDays', ControlTourController.getAllCertainDays)

export default router
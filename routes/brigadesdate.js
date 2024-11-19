import express from 'express'
import BrigadesDateController from '../controllers/brigadesDateController.js'

const router = new express.Router()


router.post('/create',  BrigadesDateController.create)
router.get('/getall', BrigadesDateController.getAll)
router.get('/getAllForOneBrigade/:brigadeId([0-9]+)', BrigadesDateController.getAllForOneBrigade)
router.get('/getone/:id([0-9]+)', BrigadesDateController.getOne)
router.get('/getAllNumberOfDaysBrigadeForProject/:brigadeId([0-9]+)', BrigadesDateController.getAllNumberOfDaysBrigadeForProject)
router.get('/getAllNumberOfDaysBrigadeForRegion', BrigadesDateController.getAllNumberOfDaysBrigadeForRegion)
router.get('/getAllNumberOfDaysBrigade/:brigadeId([0-9]+)/:projectId([0-9]+)', BrigadesDateController.getAllNumberOfDaysBrigade)
router.put('/updateBrigadesDate/:id([0-9]+)', BrigadesDateController.updateBrigadesDate)
router.delete('/delete/:id([0-9]+)', BrigadesDateController.delete)

router.get('/getAllDate', BrigadesDateController.getAllDate)
router.get('/getAllCertainDays', BrigadesDateController.getAllCertainDays)

export default router
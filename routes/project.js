import express from 'express'
import ProjectController from '../controllers/projectController.js'




const router = new express.Router()

router.get('/getall', ProjectController.getAll)
router.get('/getAllWithNoDetails', ProjectController.getAllWithNoDetails)
router.get('/getAllWithNoMaterials', ProjectController.getAllWithNoMaterials)
router.get('/getAllWithNoDesing', ProjectController.getAllWithNoDesing)
router.get('/getAllWithNoInstallers', ProjectController.getAllWithNoInstallers)
router.get('/getAllWithNoShipment', ProjectController.getAllWithNoShipment)
router.get('/getAllWithNoAccount', ProjectController.getAllWithNoAccount)
router.get('/getone/:id([0-9]+)', ProjectController.getOne)
router.post('/create',  ProjectController.create)
router.put('/update/:id([0-9]+)',  ProjectController.update)
router.delete('/delete/:id([0-9]+)',  ProjectController.delete)






export default router
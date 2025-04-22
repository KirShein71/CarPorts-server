import express from 'express'
import ProjectController from '../controllers/projectController.js'




const router = new express.Router()

router.get('/getall', ProjectController.getAll)
router.get('/getFinishProject', ProjectController.getFinishProject)
router.get('/getAllWithNoDetails', ProjectController.getAllWithNoDetails)
router.get('/getAllWithNoMaterials', ProjectController.getAllWithNoMaterials)
router.get('/getAllWithNoDesing', ProjectController.getAllWithNoDesing)
router.get('/getAllWithNoInstallers', ProjectController.getAllWithNoInstallers)
router.get('/getAllWithNoShipment', ProjectController.getAllWithNoShipment)
router.get('/getAllWithNoAccount', ProjectController.getAllWithNoAccount)
router.get('/getAllProjectsWithNoInBrigadesDate', ProjectController.getAllProjectsWithNoInBrigadesDate)
router.get('/getone/:id([0-9]+)', ProjectController.getOne)
router.get('/getProjectInfo/:id([0-9]+)', ProjectController.getProjectInfo)
router.get('/getProjectInfoInstallation/:id([0-9]+)', ProjectController.getProjectInfoInstallation)
router.post('/create',  ProjectController.create)
router.put('/createDateFinish/:id([0-9]+)', ProjectController.createDateFinish)
router.delete('/restoreProject/:finish', ProjectController.restoreProject)
router.put('/closedProject/:id([0-9]+)', ProjectController.closedProject)
router.put('/createRegion/:id([0-9]+)', ProjectController.createRegion)
router.put('/createInstallationBilling/:id([0-9]+)', ProjectController.createInstallationBilling)
router.put('/updateNote/:id([0-9]+)', ProjectController.updateNote)
router.put('/updateDesignPeriod/:id([0-9]+)', ProjectController.updateDesignPeriod)
router.put('/updateExpirationDate/:id([0-9]+)', ProjectController.updateExpirationDate)
router.put('/updateInstallationPeriod/:id([0-9]+)', ProjectController.updateInstallationPeriod)
router.put('/reviseProjectNameAndNumberAndInstallationBilling/:id([0-9]+)',  ProjectController.reviseProjectNameAndNumberAndInstallationBilling)
router.put('/update/:id([0-9]+)',  ProjectController.update)
router.delete('/delete/:id([0-9]+)',  ProjectController.delete)






export default router
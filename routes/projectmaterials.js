import express from 'express'
import ProjectMaterialsController from '../controllers/projectMaterialsController.js'

const router = new express.Router()


router.post('/create',  ProjectMaterialsController.create)
router.put('/updateMaterialIdInOrderMaterials/:id([0-9]+)',  ProjectMaterialsController.updateMaterialIdInOrderMaterials)
router.put('/createCheckProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createCheckProjectMaterials)
router.delete('/deleteCheckProjectMaterials/:check', ProjectMaterialsController.deleteCheckProjectMaterials)
router.put('/createReadyDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createReadyDateProjectMaterials)
router.delete('/deleteReadyDateProjectMaterials/:ready_date', ProjectMaterialsController.deleteReadyDateProjectMaterials)
router.put('/createShippingDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createShippingDateProjectMaterials)
router.delete('/deleteShippingDateProjectMaterials/:shipping_date', ProjectMaterialsController.deleteShippingDateProjectMaterials)
router.put('/createPaymentDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createPaymentDateProjectMaterials)
router.delete('/deletePaymentDateProjectMaterials/:date_payment', ProjectMaterialsController.deletePaymentDateProjectMaterials)
router.put('/createColorProjectMaterials/:id([0-9]+)', ProjectMaterialsController.createColorProjectMaterials)
router.put('/createExpirationMaterialDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createExpirationMaterialDateProjectMaterials)
router.get('/getall', ProjectMaterialsController.getAll)
router.get('/getAllMaterialProject', ProjectMaterialsController.getAllMaterialProject)
router.get('/getAllProjectMaterialForLogistic', ProjectMaterialsController.getAllProjectMaterialForLogistic)
router.get('/getAllMaterialProjectForLogistic', ProjectMaterialsController.getAllMaterialProjectForLogistic)
router.post('/getPickupMaterialsForLogistic', ProjectMaterialsController.getPickupMaterialsForLogistic)
router.post('/getUnloadingForProject', ProjectMaterialsController.getUnloadingForProject)
router.get('/getone/:id([0-9]+)', ProjectMaterialsController.getOne)
router.delete('/delete/:id([0-9]+)', ProjectMaterialsController.delete)
router.put('/createWeightMaterial/:id([0-9]+)',  ProjectMaterialsController.createWeightMaterial)
router.put('/createDimensionsMaterial/:id([0-9]+)',  ProjectMaterialsController.createDimensionsMaterial)


export default router
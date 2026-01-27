import express from 'express'
import ProjectWarehoueseController from '../controllers/projectWarehoueseController.js'

const router = new express.Router()


router.post('/create',  ProjectWarehoueseController.create)
router.post('/addToProduction',  ProjectWarehoueseController.addToProduction)
router.patch('/update/:id([0-9]+)', ProjectWarehoueseController.update)
router.get('/getall', ProjectWarehoueseController.getAll)
router.get('/getone/:id([0-9]+)', ProjectWarehoueseController.getOne)
router.delete('/delete/:projectId',  ProjectWarehoueseController.delete)
router.delete('/deleteOneWarehouseDetail/:id([0-9]+)',  ProjectWarehoueseController.deleteOneWarehouseDetail)


export default router
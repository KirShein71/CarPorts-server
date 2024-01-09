import express from 'express'
import ProjectInstallersController from '../controllers/projectInstallersController.js'

const router = new express.Router()


router.post('/create',  ProjectInstallersController.create)
router.get('/getall', ProjectInstallersController.getAll)
router.get('/getone/:id([0-9]+)', ProjectInstallersController.getOne)

export default router
import express from 'express'
import DesignerController from '../controllers/designerController.js'



const router = new express.Router()

router.get('/getall', DesignerController.getAll)
router.get('/getAllActiveDesigner', DesignerController.getAllActiveDesigner)
router.get('/getone/:id([0-9]+)', DesignerController.getOne)
router.post('/create',  DesignerController.create)
router.put('/updateActiveDesigner/:id([0-9]+)',  DesignerController.updateActiveDesigner)
router.put('/updateDesignerName/:id([0-9]+)',  DesignerController.updateDesignerName)
router.delete('/delete/:id([0-9]+)',  DesignerController.delete)



export default router
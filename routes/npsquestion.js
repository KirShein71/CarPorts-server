import express from 'express'
import NpsQuestionController from '../controllers/npsQuestionController.js'


const router = new express.Router()

router.get('/getall', NpsQuestionController.getAll)
router.get('/getone/:id([0-9]+)', NpsQuestionController.getOne)
router.post('/create',  NpsQuestionController.create)
router.put('/updateName/:id([0-9]+)',  NpsQuestionController.updateName)
router.put('/updateChapter/:id([0-9]+)',  NpsQuestionController.updateChapter)
router.delete('/delete/:id([0-9]+)',  NpsQuestionController.delete)


export default router
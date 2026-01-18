import express from 'express'
import NpsChapterController from '../controllers/npsChapterController.js'


const router = new express.Router()

router.get('/getall', NpsChapterController.getAll)
router.get('/getone/:id([0-9]+)', NpsChapterController.getOne)
router.post('/create',  NpsChapterController.create)
router.put('/updateName/:id([0-9]+)',  NpsChapterController.updateName)
router.put('/updateNumber/:id([0-9]+)',  NpsChapterController.updateNumber)
router.delete('/delete/:id([0-9]+)',  NpsChapterController.delete)


export default router
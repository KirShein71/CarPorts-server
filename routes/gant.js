import express from 'express'
import GantController from '../controllers/gantController.js'


const router = new express.Router()

router.get('/getAllGanttData', GantController.getAllGanttData)



export default router
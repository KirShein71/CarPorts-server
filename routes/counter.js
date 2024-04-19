import express from 'express'
import CounterController from '../controllers/counterController.js'




const router = new express.Router()

router.get('/getProjectStatistics', CounterController.getProjectStatistics)


export default router
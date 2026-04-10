import express from 'express'
import DeviationController from '../controllers/deviationController.js'



const router = new express.Router()

router.post('/create',  DeviationController.create)




export default router
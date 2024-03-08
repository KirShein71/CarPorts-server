import express from 'express'
import RemainderDetailsController from '../controllers/remainderDetailsController.js'

const router = new express.Router()

router.get('/getAllRemainderOneDetail', RemainderDetailsController.getAllRemainderOneDetail)
router.get('/getOverproductionOneDetail', RemainderDetailsController.getOverproductionOneDetail)
router.get('/getProduceOneDetail', RemainderDetailsController.getProduceOneDetail)
router.get('/getWaitShipmentProjectOneDetail', RemainderDetailsController.getWaitShipmentProjectOneDetail)
router.get('/getWaitShipment', RemainderDetailsController.getWaitShipment)


export default router
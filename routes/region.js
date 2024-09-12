import express from 'express'
import RegionController from '../controllers/regionController.js'

const router = new express.Router()

router.get('/getAllRegion', RegionController.getAllRegion)

export default router
import express from 'express'
import PortfolioImageController from '../controllers/portfolioImageController.js'


const router = new express.Router()

router.get('/getone/:id([0-9]+)', PortfolioImageController.getOne)
router.get('/getAllByProjectId/:id([0-9]+)', PortfolioImageController.getAllByProjectId)
router.post('/create',  PortfolioImageController.create)
router.delete('/delete/:id([0-9]+)',  PortfolioImageController.delete)



export default router
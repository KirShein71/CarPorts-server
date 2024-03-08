import RemainderDetailsModel from '../models/RemainderDetails.js'
import AppError from '../errors/AppError.js'

class RemainderDetailsController {

    async getAllRemainderOneDetail(req, res, next) {
        try {
            const remainderdetails = await RemainderDetailsModel.getAllRemainderOneDetail()
            res.json(remainderdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOverproductionOneDetail(req, res, next) {
        try {
            const remainderdetails = await RemainderDetailsModel.getOverproductionOneDetail()
            res.json(remainderdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getProduceOneDetail(req, res, next) {
        try {
            const remainderdetails = await RemainderDetailsModel.getProduceOneDetail()
            res.json(remainderdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async getWaitShipmentProjectOneDetail(req, res, next) {
        try {
            const remainderdetails = await RemainderDetailsModel.getWaitShipmentProjectOneDetail()
            res.json(remainderdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getWaitShipment(req, res, next) {
        try {
            const remainderdetails = await RemainderDetailsModel.getWaitShipment()
            res.json(remainderdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
    
}

export default new RemainderDetailsController();
import ShipmentDetailsModel from '../models/ShipmentDetails.js'
import AppError from '../errors/AppError.js'


class ShipmentDetailsController {
    async getAll(req, res, next) {
        try {
            const shipmentdetails = await ShipmentDetailsModel.getAll()
            res.json(shipmentdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const shipmentdetails = await ShipmentDetailsModel.getOne(req.params.id)
            res.json(shipmentdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }



    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const shipmentdetails = await ShipmentDetailsModel.create( req.body)
            res.json(shipmentdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const shipmentdetails = await ShipmentDetailsModel.update(req.params.id, req.body,)
            res.json(shipmentdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async getSumOneShipmentDetail(req, res, next) {
        try {
            const shipmentdetails = await ShipmentDetailsModel.getSumOneShipmentDetail()
            res.json(shipmentdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.projectId) {
                throw new Error('Не найдена отметка времени')
            }
            const shipmentdetails = await ShipmentDetailsModel.delete(req.params.projectId)
            res.json(shipmentdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteOneShipmentDetail(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const shipmentdetails = await ShipmentDetailsModel.deleteOneShipmentDetail(req.params.id)
            res.json(shipmentdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


  
}

export default new ShipmentDetailsController()
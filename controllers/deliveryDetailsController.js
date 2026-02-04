import DeliveryDetailsModel from '../models/DeliveryDetails.js'
import AppError from '../errors/AppError.js'


class DeliveryDetailsController {
    async getAll(req, res, next) {
        try {
            const deliverydetails = await DeliveryDetailsModel.getAll()
            res.json(deliverydetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const deliverydetails = await DeliveryDetailsModel.getOne(req.params.id)
            res.json(deliverydetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }



    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const deliverydetails = await DeliveryDetailsModel.create( req.body)
            res.json(deliverydetails)
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
            const deliverydetails = await DeliveryDetailsModel.update(req.params.id, req.body,)
            res.json(deliverydetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async getSumOneDeliveryDetail(req, res, next) {
        try {
            const deliverydetails = await DeliveryDetailsModel.getSumOneDeliveryDetail()
            res.json(deliverydetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.projectId) {
                throw new Error('Не найдена отметка времени')
            }
            const deliverydetails = await DeliveryDetailsModel.delete(req.params.projectId)
            res.json(deliverydetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteOneDeliveryDetail(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const deliverydetails = await DeliveryDetailsModel.deleteOneDeliveryDetail(req.params.id)
            res.json(deliverydetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


  
}

export default new DeliveryDetailsController()
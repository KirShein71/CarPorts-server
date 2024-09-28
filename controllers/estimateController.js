import EstimateModel from '../models/Estimate.js'
import AppError from '../errors/AppError.js'


class estimateController {
    async getAll(req, res, next) {
        try {
            const estimate = await EstimateModel.getAll()
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimateForBrigade(req, res, next) {
        try {
            const estimate = await EstimateModel.getAllEstimateForBrigade()
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const estimate = await EstimateModel.getOne(req.params.id)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

 
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const estimate = await EstimateModel.create( req.body)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    

    async updateEstimatePrice(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const estimate = await BrigadesDateModel.updateestimatePrice(req.params.id, req.body,)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const estimate = await EstimateModel.delete(req.params.id)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new estimateController()
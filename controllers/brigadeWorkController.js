import BrigadeWorkModel from '../models/BrigadeWork.js'
import AppError from '../errors/AppError.js'

class BrigadeWorkController {

    async getAll(req, res, next) {
        try {
            const brigadework = await BrigadeWorkModel.getAll()
            res.json(brigadework)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const brigadework = await BrigadeWorkModel.getOne(req.params.id)
            res.json(brigadework)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const brigadework = await BrigadeWorkModel.create( req.body)
            res.json(brigadework)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateCount(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const brigadework = await BrigadeWorkModel.updateCount(req.params.id, req.body,)
            res.json(brigadework)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

}

export default new BrigadeWorkController;
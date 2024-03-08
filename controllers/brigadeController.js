import BrigadeModel from '../models/Brigade.js'
import AppError from '../errors/AppError.js'

class BrigadeController {
    async getAll(req, res, next) {
        try {
            const brigades = await BrigadeModel.getAll()
            res.json(brigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const brigade = await BrigadeModel.getOne(req.params.id)
            res.json(brigade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const brigade = await BrigadeModel.create(req.body, req.files?.image)
            res.json(brigade)
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
            const bragade = await BrigadeModel.update(req.params.id, req.body, req.files?.image)
            res.json(bragade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const brigade = await BrigadeModel.delete(req.params.id)
            res.json(brigade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new BrigadeController()
import DetailModel from '../models/Detail.js'
import AppError from '../errors/AppError.js'

class DetailsController {
    async getAll(req, res, next) {
        try {
            const details = await DetailModel.getAll()
            res.json(details)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const detail = await DetailModel.getOne(req.params.id)
            res.json(detail)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const detail = await DetailModel.create(req.body)
            res.json(detail)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createPrice(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const detail = await DetailModel.createPrice(req.params.id, req.body,)
            res.json(detail)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createNumber(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const detail = await DetailModel.createNumber(req.params.id, req.body,)
            res.json(detail)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const detail = await DetailModel.update(req.params.id, req.body,)
            res.json(detail)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const detail = await DetailModel.delete(req.params.id)
            res.json(detail)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new DetailsController()
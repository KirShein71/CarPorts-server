import ServiceModel from '../models/Service.js'
import AppError from '../errors/AppError.js'

class ServiceController {
    async getAll(req, res, next) {
        try {
            const mservice = await ServiceModel.getAll()
            res.json(mservice)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const service = await ServiceModel.getOne(req.params.id)
            res.json(service)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const service = await ServiceModel.create(req.body)
            res.json(service)
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
            const service = await ServiceModel.update(req.params.id, req.body,)
            res.json(service)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateNumber(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const service = await ServiceModel.updateNumber(req.params.id, req.body,)
            res.json(service)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const service = await ServiceModel.delete(req.params.id)
            res.json(service)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new ServiceController()
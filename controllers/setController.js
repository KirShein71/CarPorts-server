import SetModel from '../models/Set.js'
import AppError from '../errors/AppError.js'


class SetController {
 
    async getAll(req, res, next) {
        try {
            const sets = await SetModel.getAll()
            res.json(sets)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllActiveSet(req, res, next) {
        try {
            const sets = await SetModel.getAllActiveSet()
            res.json(sets)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id комплекта')
            }
            const set = await SetModel.getOne(req.params.id)
            res.json(set)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const sets = await SetModel.create(req.body)
            res.json(sets)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
 
    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id комплекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const set = await SetModel.update(req.params.id, req.body)
            res.json(set)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateActiveSet(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id комплекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const set = await SetModel.updateActiveSet(req.params.id, req.body)
            res.json(set)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id комплекта')
            }
            const set = await SetModel.delete(req.params.id)
            res.json(set)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new SetController()
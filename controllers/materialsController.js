import MaterialModel from '../models/Material.js'
import AppError from '../errors/AppError.js'

class MaterialsController {
    async getAll(req, res, next) {
        try {
            const materials = await MaterialModel.getAll()
            res.json(materials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const material = await MaterialModel.getOne(req.params.id)
            res.json(material)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const material = await MaterialModel.create(req.body)
            res.json(material)
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
            const material = await MaterialModel.update(req.params.id, req.body,)
            res.json(material)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const material = await MaterialModel.delete(req.params.id)
            res.json(material)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new MaterialsController()
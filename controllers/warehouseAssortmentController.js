import WarehouseAssortmentModel from '../models/WarehouseAssortment.js'
import AppError from '../errors/AppError.js'

class WarehouseAssortmentController {
    async getAll(req, res, next) {
        try {
            const warehouse_assortments = await WarehouseAssortmentModel.getAll()
            res.json(warehouse_assortments)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllActiveWarehouseAssortement(req, res, next) {
        try {
            const warehouse_assortments = await WarehouseAssortmentModel.getAllActiveWarehouseAssortement()
            res.json(warehouse_assortments)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const warehouse_assortment = await WarehouseAssortmentModel.getOne(req.params.id)
            res.json(warehouse_assortment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const warehouse_assortment = await WarehouseAssortmentModel.create(req.body)
            res.json(warehouse_assortment)
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
            const warehouse_assortment = await WarehouseAssortmentModel.update(req.params.id, req.body,)
            res.json(warehouse_assortment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateActiveWarehouseAssortment(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const warehouse_assortment = await WarehouseAssortmentModel.updateActiveWarehouseAssortment(req.params.id, req.body,)
            res.json(warehouse_assortment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const warehouse_assortment = await WarehouseAssortmentModel.delete(req.params.id)
            res.json(warehouse_assortment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new WarehouseAssortmentController()
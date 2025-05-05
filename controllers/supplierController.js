import SupplierModel from '../models/Supplier.js'
import AppError from '../errors/AppError.js'

class SupplierController {
    async getAll(req, res, next) {
        try {
            const suppliers = await SupplierModel.getAll()
            res.json(suppliers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id поставщика')
            }
            const supplier = await SupplierModel.getOne(req.params.id)
            res.json(supplier)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const supplier = await SupplierModel.create(req.body)
            res.json(supplier)
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
            const supplier = await SupplierModel.update(req.params.id, req.body,)
            res.json(supplier)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const supplier = await SupplierModel.delete(req.params.id)
            res.json(supplier)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new SupplierController()
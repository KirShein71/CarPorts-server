import AddWarehouseModel from '../models/AddWarehouse.js'
import AppError from '../errors/AppError.js'


class AddWarehouseController {
    async getAll(req, res, next) {
        try {
            const add_warehouse = await AddWarehouseModel.getAll()
            res.json(add_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const add_warehouse = await AddWarehouseModel.getOne(req.params.id)
            res.json(add_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }



    

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const add_warehouse = await AddWarehouseModel.create(req.body);
            res.json(add_warehouse);
        } catch (e) {
            next(AppError.badRequest(e.message));
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
            const add_warehouse = await AddWarehouseModel.update(req.params.id, req.body,)
            res.json(add_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getSumOneWarehouseDetail(req, res, next) {
        try {
            const add_warehouse = await AddWarehouseModel.getSumOneDetail()
            res.json(add_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getCostPriceOneWarehouseDetail(req, res, next) {
        try {
            const add_warehouse = await AddWarehouseModel.getCostPriceOneDetail()
            res.json(add_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.stock_date) {
                throw new Error('Не найдена отметка времени')
            }
            const add_warehouse = await AddWarehouseModel.delete(req.params.stock_date)
            res.json(add_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

}

export default new AddWarehouseController()
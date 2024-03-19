import StockDetailsModel from '../models/StockDetails.js'
import AppError from '../errors/AppError.js'


class StockDetailsController {
    async getAll(req, res, next) {
        try {
            const stockdetails = await StockDetailsModel.getAll()
            res.json(stockdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const stockdetails = await StockDetailsModel.getOne(req.params.id)
            res.json(stockdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }



    

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const stockdetails = await StockDetailsModel.create( req.body)
            res.json(stockdetails)
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
            const stockdetails = await StockDetailsModel.update(req.params.id, req.body,)
            res.json(stockdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getSumOneDetail(req, res, next) {
        try {
            const stockdetails = await StockDetailsModel.getSumOneDetail()
            res.json(stockdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getCostPriceOneDetail(req, res, next) {
        try {
            const stockdetails = await StockDetailsModel.getCostPriceOneDetail()
            res.json(stockdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.stock_date) {
                throw new Error('Не найдена отметка времени')
            }
            const stockdetails = await StockDetailsModel.delete(req.params.stock_date)
            res.json(stockdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

}

export default new StockDetailsController()

import StockAntypicalModel from '../models/StockAntypical.js'
import AppError from '../errors/AppError.js'


class StockAntypicalController {
    

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const stockantypical = await StockAntypicalModel.getOne(req.params.id)
            res.json(stockantypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const stockantypical = await StockAntypicalModel.create( req.body)
            res.json(stockantypical)
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
            const stockantypical = await StockAntypicalModel.update(req.params.id, req.body,)
            res.json(stockantypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

}

export default new StockAntypicalController()

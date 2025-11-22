import CoefficientModel from '../models/Сoefficient.js'
import AppError from '../errors/AppError.js'


class CoefficientController {
    
    async getAll(req, res, next) {
        try {
            const coefficients = await CoefficientModel.getAll()
            res.json(coefficients)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const coefficient = await CoefficientModel.getOne(req.params.id)
            res.json(coefficient)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
            try {
                if (Object.keys(req.body).length === 0) {
                    throw new Error('Нет данных для отправки')
                }
                const coefficient = await CoefficientModel.create(req.body)
                res.json(coefficient)
            } catch(e) {
                next(AppError.badRequest(e.message))
            }
        }
    

    async updateCoefficientName(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const coefficient = await CoefficientModel.updateCoefficientName(req.params.id, req.body)
            res.json(coefficient)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateCoefficientNumber(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const coefficient = await CoefficientModel.updateCoefficientNumber(req.params.id, req.body)
            res.json(coefficient)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const Coefficient = await CoefficientModel.delete(req.params.id)
            res.json(Coefficient)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new CoefficientController()
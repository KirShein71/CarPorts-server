import PaymentModel from '../models/Payment.js'
import AppError from '../errors/AppError.js'

class paymentController {
    async getAll(req, res, next) {
        try {
            const payment = await PaymentModel.getAll()
            res.json(payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const payment = await PaymentModel.getOne(req.params.id)
            res.json(payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const payment = await PaymentModel.create( req.body)
            res.json(payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllPaymentForBrigade(req, res, next) {
        try {
            const payment = await PaymentModel.getAllPaymentForBrigade(req.params.id)
            res.json(payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updatePaymentDate(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const payment = await PaymentModel.updatePaymentDate(req.params.id, req.body,)
            res.json(payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updatePaymentSum(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const payment = await PaymentModel.updatePaymentSum(req.params.id, req.body,)
            res.json(payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const payment = await PaymentModel.delete(req.params.id)
            res.json(payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new paymentController()

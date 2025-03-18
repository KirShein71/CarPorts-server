import ComplaintPaymentModel from '../models/ComplaintPayment.js'
import AppError from '../errors/AppError.js'

class ComplaintPaymentController {
    async getAll(req, res, next) {
        try {
            const complaint_payment = await ComplaintPaymentModel.getAll()
            res.json(complaint_payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const complaint_payment = await ComplaintPaymentModel.getOne(req.params.id)
            res.json(complaint_payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const complaint_payment = await ComplaintPaymentModel.create( req.body)
            res.json(complaint_payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllPaymentForBrigade(req, res, next) {
        try {
            const complaint_payment = await ComplaintPaymentModel.getAllPaymentForBrigade(req.params.id)
            res.json(complaint_payment)
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
            const complaint_payment = await ComplaintPaymentModel.updatePaymentDate(req.params.id, req.body,)
            res.json(complaint_payment)
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
            const complaint_payment = await ComplaintPaymentModel.updatePaymentSum(req.params.id, req.body,)
            res.json(complaint_payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const complaint_payment = await ComplaintPaymentModel.delete(req.params.id)
            res.json(complaint_payment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new ComplaintPaymentController()

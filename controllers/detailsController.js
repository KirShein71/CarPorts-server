import DetailModel from '../models/Detail.js'
import AppError from '../errors/AppError.js'

class DetailsController {
    async getAll(req, res, next) {
        try {
            const details = await DetailModel.getAll()
            res.json(details)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const detail = await DetailModel.getOne(req.params.id)
            res.json(detail)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new DetailsController()
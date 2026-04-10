import DeviationModel from '../models/Deviation.js'
import AppError from '../errors/AppError.js'

class DeviationController {

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const sets = await DeviationModel.create(req.body)
            res.json(sets)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new DeviationController()
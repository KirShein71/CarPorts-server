import CounterModel from '../models/Counter.js'
import AppError from '../errors/AppError.js'

class CounetController {
    async getProjectStatistics(req, res, next) {
        try {
            const project = await CounterModel.getProjectStatistics()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

   

    
}

export default new CounetController()
import RegionModel from '../models/Region.js'
import AppError from '../errors/AppError.js'

class RegionController {
    async getAllRegion(req, res, next) {
        try {
            const region = await RegionModel.getAllRegion()
            res.json(region)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new RegionController;
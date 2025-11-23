import GantModel from '../models/Gant.js'
import AppError from '../errors/AppError.js'


class GantController {

    async getAllGanttData(req, res, next) {
        try {
            const comaplaintimages = await GantModel.getAllGanttData()
            res.json(comaplaintimages)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

}

export default new GantController()
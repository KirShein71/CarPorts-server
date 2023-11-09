import MaterialModel from '../models/Material.js'
import AppError from '../errors/AppError.js'

class MaterialsController {
    async getAll(req, res, next) {
        try {
            const materials = await MaterialModel.getAll()
            res.json(materials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const material = await MaterialModel.getOne(req.params.id)
            res.json(material)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new MaterialsController()
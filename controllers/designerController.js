import DesignerModel from '../models/Desiner.js'
import AppError from '../errors/AppError.js'


class DesignerController {
    
    async getAll(req, res, next) {
        try {
            const designers = await DesignerModel.getAll()
            res.json(designers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllActiveDesigner(req, res, next) {
        try {
            const designers = await DesignerModel.getAllActiveDesigner()
            res.json(designers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const designer = await DesignerModel.getOne(req.params.id)
            res.json(designer)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
            try {
                if (Object.keys(req.body).length === 0) {
                    throw new Error('Нет данных для отправки')
                }
                const designer = await DesignerModel.create(req.body)
                res.json(designer)
            } catch(e) {
                next(AppError.badRequest(e.message))
            }
        }
    

    async updateActiveDesigner(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const designer = await DesignerModel.updateActiveDesigner(req.params.id, req.body)
            res.json(designer)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateDesignerName(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const disegner = await DesignerModel.updateDesignerName(req.params.id, req.body)
            res.json(disegner)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const designer = await DesignerModel.delete(req.params.id)
            res.json(designer)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new DesignerController()
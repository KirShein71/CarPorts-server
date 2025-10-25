import ExaminationModel from '../models/Examination.js'
import AppError from '../errors/AppError.js'

class ExaminationController {
    async getAll(req, res, next) {
        try {
            const examination = await ExaminationModel.getAll()
            res.json(examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пункта')
            }
            const examination = await ExaminationModel.getOne(req.params.id)
            res.json(examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const examination = await ExaminationModel.create(req.body)
            res.json(examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пунка')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const examination = await ExaminationModel.update(req.params.id, req.body,)
            res.json(examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateName(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пункта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const examination = await ExaminationModel.updateName(req.params.id, req.body,)
            res.json(examination)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateNumber(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const examination = await ExaminationModel.updateNumber(req.params.id, req.body,)
            res.json(examination)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const examination = await ExaminationModel.delete(req.params.id)
            res.json(examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new ExaminationController()
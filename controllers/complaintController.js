import  ComplaintModel from '../models/Complaint.js'
import AppError from '../errors/AppError.js'

class complaintController {
    async getAll(req, res, next) {
        try {
            const complaints = await ComplaintModel.getAll()
            res.json(complaints)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const complaint = await ComplaintModel.getOne(req.params.id)
            res.json(complaint)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const complaint = await ComplaintModel.create(req.body)
            res.json(complaint)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createDateFinish(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const complaint = await ComplaintModel.createDateFinish(req.params.id, req.body,)
            res.json(complaint)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteDateFinish(req, res, next) {
        try {
            const id = req.params.date_finish;
            
            const complaint = await ComplaintModel.deleteDateFinish(id);
            res.json(complaint);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async updateNote(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id рекламации')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ComplaintModel.updateNote(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const complaint = await ComplaintModel.delete(req.params.id)
            res.json(complaint)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new complaintController()
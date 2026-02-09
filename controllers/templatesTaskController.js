import TemplatesTaskModel from '../models/TemplatesTask.js'
import AppError from '../errors/AppError.js'

class TamplatesTaskController {
    async getAll(req, res, next) {
        try {
            const templates_tasks = await TemplatesTaskModel.getAll()
            res.json(templates_tasks)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllActiveTemplatesTask(req, res, next) {
        try {
            const templates_tasks = await TemplatesTaskModel.getAllActiveTemplatesTask()
            res.json(templates_tasks)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id шаблона')
            }
            const templates_task = await TemplatesTaskModel.getOne(req.params.id)
            res.json(templates_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const templates_task = await TemplatesTaskModel.create(req.body)
            res.json(templates_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id шаблона')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const templates_task = await TemplatesTaskModel.update(req.params.id, req.body,)
            res.json(templates_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateActiveTemplatesTask(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id шаблона')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const templates_task = await TemplatesTaskModel.updateActiveTemplatesTask(req.params.id, req.body,)
            res.json(templates_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id шаблона')
            }
            const templates_task = await TemplatesTaskModel.delete(req.params.id)
            res.json(templates_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new TamplatesTaskController()
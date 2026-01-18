import NpsProjectModel from '../models/NpsProject.js'
import AppError from '../errors/AppError.js'

class NpsProjectController {
    async getAll(req, res, next) {
        try {
            const nps_project = await NpsProjectModel.getAll()
            res.json(nps_project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id строки')
            }
            const nps_project = await NpsProjectModel.getOne(req.params.id)
            res.json(nps_project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getForProject(req, res, next) {
        try {
            const nps_project = await NpsProjectModel.getForProject(req.params.id)
            res.json(nps_project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const nps_project = await NpsProjectModel.create(req.body)
            res.json(nps_project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async updateScore(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id строки')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const nps_project = await NpsProjectModel.updateScore(req.params.id, req.body,)
            res.json(nps_project)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id строки')
            }
            const nps_project = await NpsProjectModel.delete(req.params.id)
            res.json(nps_project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

     async getNoteForProject(req, res, next) {
        try {
            const nps_project = await NpsProjectModel.getNoteForProject(req.params.id)
            res.json(nps_project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createNote(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const nps_note = await NpsProjectModel.createNote(req.body)
            res.json(nps_note)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async updateNote(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id строки')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const nps_note = await NpsProjectModel.updateNote(req.params.id, req.body,)
            res.json(nps_note)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteNote(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id строки')
            }
            const nps_note = await NpsProjectModel.deleteNote(req.params.id)
            res.json(nps_note)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new NpsProjectController()
import ProjectModel from '../models/Project.js'
import AppError from '../errors/AppError.js'

class ProjectController {
    async getAll(req, res, next) {
        try {
            const project = await ProjectModel.getAll()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllWithNoDetails(req, res, next) {
        try {
            const project = await ProjectModel.getAllWithNoDetails()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllWithNoMaterials(req, res, next) {
        try {
            const project = await ProjectModel.getAllWithNoMaterials()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllWithNoDesing(req, res, next) {
        try {
            const project = await ProjectModel.getAllWithNoDesing()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllWithNoInstallers(req, res, next) {
        try {
            const project = await ProjectModel.getAllWithNoInstallers()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllWithNoShipment(req, res, next) {
        try {
            const project = await ProjectModel.getAllWithNoShipment()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllWithNoAccount(req, res, next) {
        try {
            const project = await ProjectModel.getAllWithNoAccount()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const project = await ProjectModel.getOne(req.params.id)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const project = await ProjectModel.create(req.body)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   


    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.update(req.params.id, req.body,)
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
            const project = await ProjectModel.delete(req.params.id)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new ProjectController()
import ProjectMaterialsModel from '../models/ProjectMaterials.js'
import AppError from '../errors/AppError.js'


class ProjectMaterialsController {
    async getAll(req, res, next) {
        try {
            const projectmaterials = await ProjectMaterialsModel.getAll()
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const projectmaterials = await ProjectMaterialsModel.getOne(req.params.id)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getProject(req, res, next) {
        try {
            if (!req.params.projectId) {
                throw new Error('Не указан id товара')
            }
            const projectmaterials = await ProjectMaterialsModel.getProject(req.params.projectId)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const property = await ProjectMaterialsModel.create( req.body)
            res.json(property)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createCheckProjectMaterials(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectmaterials = await ProjectMaterialsModel.createCheckProjectMaterials(req.params.id, req.body,)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteCheckProjectMaterials(req, res, next) {
        try {
            const id = req.params.check;
            
            const projectmaterials = await ProjectMaterialsModel.deleteCheckProjectMaterials(id);
            res.json(projectmaterials);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    
    async createReadyDateProjectMaterials(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectmaterials = await ProjectMaterialsModel.createReadyDateProjectMaterials(req.params.id, req.body,)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createShippingDateProjectMaterials(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectmaterials = await ProjectMaterialsModel.createShippingDateProjectMaterials(req.params.id, req.body,)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createPaymentDateProjectMaterials(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectmaterials = await ProjectMaterialsModel.createPaymentDateProjectMaterials(req.params.id, req.body,)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deletePaymentDateProjectMaterials(req, res, next) {
        try {
            const id = req.params.date_payment;
            
            const projectmaterials = await ProjectMaterialsModel.deletePaymentDateProjectMaterials(id);
            res.json(projectmaterials);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async createExpirationMaterialDateProjectMaterials(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectmaterials = await ProjectMaterialsModel.createExpirationMaterialDateProjectMaterials(req.params.id, req.body,)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const projectmaterials = await ProjectMaterialsModel.delete(req.params.id)
            res.json(projectmaterials)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

  
}

export default new ProjectMaterialsController()
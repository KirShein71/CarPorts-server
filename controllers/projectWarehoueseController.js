import ProjectWarehouseModel from '../models/ProjectWarehouse.js'
import AppError from '../errors/AppError.js'


class ProjectWarehouseController {
    async getAll(req, res, next) {
        try {
            const project_warehouse = await ProjectWarehouseModel.getAll()
            res.json(project_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const project_warehouse = await ProjectWarehouseModel.getOne(req.params.id)
            res.json(project_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const project_warehouse = await ProjectWarehouseModel.create( req.body)
            res.json(project_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async addToProduction(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const project_warehouse = await ProjectWarehouseModel.addToProduction(req.body)
        
            res.json(project_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project_warehouse = await ProjectWarehouseModel.update(req.params.id, req.body,)
            res.json(project_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createNote(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project_warehouse = await ProjectWarehouseModel.createNote(req.params.id, req.body,)
            res.json(project_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }    
    }
    
    async deleteNote(req, res, next) {
        try {
            const id = req.params.note;
                
            const project_warehouse = await ProjectWarehouseModel.deleteNote(id);
            res.json(project_warehouse);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.projectId) {
                throw new Error('Не найден проект')
            }
            const project_warehouse = await ProjectWarehouseModel.delete(req.params.projectId)
            res.json(project_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteOneWarehouseDetail(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const warehouse_assortment = await ProjectWarehouseModel.deleteOneWarehouseDetail(req.params.id)
            res.json(warehouse_assortment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

  
}

export default new ProjectWarehouseController()
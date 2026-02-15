import ProjectTaskModel from '../models/ProjectTask.js'
import AppError from '../errors/AppError.js'


class ProjectTaskController {
    async getAll(req, res, next) {
        try {
            const project_task = await ProjectTaskModel.getAll()
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllActiveTaskProject(req, res, next) {
        try {
            const project_task = await ProjectTaskModel.getAllActiveTaskProject()
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id задачи')
            }
            const project_task = await ProjectTaskModel.getOne(req.params.id)
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllTaskForProject(req, res, next) {
        try {
            const project_task = await ProjectTaskModel.getAllTaskForProject(req.params.id)
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   
    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const project_task = await ProjectTaskModel.create( req.body)
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createTasksFromTemplates(req, res, next) {
        try {
            const { projectId } = req.params; // получаем projectId из URL
            const createdTasks = await ProjectTaskModel.createTasksFromTemplates(projectId);
            res.json(createdTasks);
        } catch (e) {
            next(AppError.badRequest(e.message));
        }
    }

    async createExecutorProjectTask(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id задачи')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project_task = await ProjectTaskModel.createExecutorProjectTask(req.params.id, req.body,)
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id задачи')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project_task = await ProjectTaskModel.update(req.params.id, req.body,)
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateActiveProjectTask(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id задачи')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project_task = await ProjectTaskModel.updateActiveProjectTask(req.params.id, req.body,)
            res.json(project_task)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async deleteTask(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id задачи')
            }
            const warehouse_assortment = await ProjectTaskModel.deleteTask(req.params.id)
            res.json(warehouse_assortment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

  
}

export default new ProjectTaskController()
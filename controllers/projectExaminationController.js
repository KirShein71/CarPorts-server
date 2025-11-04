import ProjectExaminationModel from '../models/ProjectExamination.js'
import AppError from '../errors/AppError.js'


class ProjectExaminationController {

    async getAll(req, res, next) {
        try {
            const project_examination = await ProjectExaminationModel.getAll()
            res.json(project_examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllGroupByBrigade(req, res, next) {
        try {
            const project_examination = await ProjectExaminationModel.getAllGroupByBrigade()
            res.json(project_examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

     async getAllProjectBrigadeExamination(req, res, next) {
        try {
                    
            const brigadeId = req.params.brigadeId
            const projectId = req.params.projectId
        
            const project_examination = await ProjectExaminationModel.getAllProjectBrigadeExamination(brigadeId, projectId)
            res.json(project_examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllExaminationForProject(req, res, next) {
        try {
            const project_examination = await ProjectExaminationModel.getAllExaminationForProject(req.params.id)
            res.json(project_examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

     async getAllExaminationForBrigade(req, res, next) {
        try {
            const project_examination = await ProjectExaminationModel.getAllExaminationForBrigade(req.params.brigadeId)
            res.json(project_examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   
    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const project_examination = await ProjectExaminationModel.create( req.body)
            res.json(project_examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateResult(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project_examination = await ProjectExaminationModel.updateResult(req.params.id, req.body,)
            res.json(project_examination)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не найден пункт проверки')
            }
            const project_examination = await ProjectExaminationModel.delete(req.params.id)
            res.json(project_examination)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteAllProjectBrigade(req, res, next) {
        try {
            const projectId = req.params.projectId;
            const brigadeId = req.params.brigadeId;
            
            if (!projectId || !brigadeId) {
                throw new Error('Не указаны projectId или brigadeId');
            }
            
            const result = await ProjectExaminationModel.deleteAllProjectBrigade(projectId, brigadeId);
            res.json(result);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }
  
}

export default new ProjectExaminationController()
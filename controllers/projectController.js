import ProjectModel from '../models/Project.js'
import AppError from '../errors/AppError.js'
import bcrypt from 'bcrypt'

class ProjectController {
    async getAll(req, res, next) {
        try {
            const project = await ProjectModel.getAll()
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getFinishProject(req, res, next) {
        try {
            const project = await ProjectModel.getFinishProject()
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

    async getAllProjectsWithNoInBrigadesDate(req, res, next) {
        try {
            const project = await ProjectModel.getAllProjectsWithNoInBrigadesDate()
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

    async getProjectInfo(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            const project = await ProjectModel.getProjectInfo(req.params.id)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getProjectInfoInstallation(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            const project = await ProjectModel.getProjectInfoInstallation(req.params.id)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
    
    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки');
            }

            // Проверяем обязательные поля для аккаунта
            if (!req.body.phone || !req.body.password) {
                throw new Error('Телефон и пароль обязательны для создания аккаунта');
            }

            const result = await ProjectModel.create(req.body, req.files.image);
           
            
            res.json({
                success: true,
                project: result.project,
                account: result.account
            });
        } catch(e) {
            next(AppError.badRequest(e.message));
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
            const project = await ProjectModel.createDateFinish(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

     async updateDateFinish(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.updateDateFinish(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async restoreProject(req, res, next) {
        try {
            const id = req.params.finish;
            
            const project = await ProjectModel.restoreProject(id);
            res.json(project);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async closedProject(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.closedProject(req.params.id, req.body,)
          
            res.json(project)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createRegion(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.createRegion(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createInstallationBilling(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.createInstallationBilling(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   
    async updateNote(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.updateNote(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateDesignPeriod(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.updateDesignPeriod(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateExpirationDate(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.updateExpirationDate(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateInstallationPeriod(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.updateInstallationPeriod(req.params.id, req.body,)
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

    async createLogisticProject(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.createLogisticProject(req.params.id, req.body,)
            res.json(project)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async reviseProjectNameAndNumberAndInstallationBilling(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const project = await ProjectModel.reviseProjectNameAndNumberAndInstallationBilling(req.params.id, req.body,)
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
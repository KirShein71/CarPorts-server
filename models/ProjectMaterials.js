import { ProjectMaterials as ProjectMaterialsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'

import AppError from '../errors/AppError.js'

class ProjectMaterials {
    async getAll() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll()
        return projectsmaterials
    }
    
    async getOne(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) { 
            throw new Error('Товар не найден в БД')
        }
        return projectmaterials
    } 

    async create(data) {
        const { date_payment, expiration_date, ready_date, shipping_date, projectId, materialId, materialName } = data;
        const projectmaterials = await ProjectMaterialsMapping.create({ date_payment, expiration_date, ready_date, shipping_date, projectId, materialId, materialName });
        const created = await ProjectMaterialsMapping.findByPk(projectmaterials.id);
        return created;
    }

    async getProject(projectId) {
        const project = await ProjectMapping.findByPk(projectId);
        if (!project) {
          throw new Error('Проект не найден в БД');
        }
      
        const projectmaterials = await ProjectMaterialsMapping.findAll({
          where: {
            project_id: projectId
          }
        });
      
        if (!projectmaterials) {
          throw new Error('Данные проекта не найдены в БД');
        }
      
        return projectmaterials;
      }

}

export default new ProjectMaterials()
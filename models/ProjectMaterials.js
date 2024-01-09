import { ProjectMaterials as ProjectMaterialsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'

import AppError from '../errors/AppError.js'

class ProjectMaterials {
    async getAll() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date']
                },
              ],
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, date_payment, ready_date, shipping_date, check, project, id } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            if (existingProject) {
              existingProject.props.push({ id: id, materialId: materialId, materialName: materialName, date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check });
            } else {
              acc.push({
                project: {
                  name: project.name,
                  number: project.number,
                  expiration_date: project.expiration_date,
                  agreement_date: project.agreement_date
                },
                projectId: projectId,
                props: [{ id:id, materialId: materialId, materialName: materialName, date_payment: date_payment,  ready_date: ready_date, shipping_date: shipping_date, check: check }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }
    
    async getOne(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) { 
            throw new Error('Товар не найден в БД')
        }
        return projectmaterials
    } 

    async create(data) {
        const { date_payment, expiration_date, ready_date, shipping_date, check, projectId, materialId, materialName } = data;
        const projectmaterials = await ProjectMaterialsMapping.create({ date_payment, expiration_date, ready_date, shipping_date, check, projectId, materialId, materialName });
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


      async createCheckProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            check = projectmaterials.check
        } = data
        await projectmaterials.update({check})
        await projectmaterials.reload()
        return projectmaterials
    }

}

export default new ProjectMaterials()
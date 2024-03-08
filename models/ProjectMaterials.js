import { ProjectMaterials as ProjectMaterialsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Material as MaterialMapping} from './mapping.js'



class ProjectMaterials {
    async getAll() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date', 'design_period', 'id']},
                {
                  model: MaterialMapping,
                        attributes: ['name']}
                  
              ],

              order: [
                ['projectId', 'DESC']
              ]
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, date_payment, ready_date, shipping_date, check, project, id } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            if (existingProject) {
              existingProject.props.push({ id: id, materialId: materialId, materialName: materialName, date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check });
            } else {
              acc.push({
                project: {
                  id: project.id,
                  name: project.name,
                  number: project.number,
                  expiration_date: project.expiration_date,
                  agreement_date: project.agreement_date,
                  design_period: project.design_period
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
        const { date_payment, expirationMaterial_date, ready_date, shipping_date, check, projectId, materialId, materialName } = data;
        const projectmaterials = await ProjectMaterialsMapping.create({ date_payment, expirationMaterial_date, ready_date, shipping_date, check, projectId, materialId, materialName });
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


    async createReadyDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            ready_date = projectmaterials.ready_date
        } = data
        await projectmaterials.update({ready_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createShippingDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            shipping_date = projectmaterials.shipping_date
        } = data
        await projectmaterials.update({shipping_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createPaymentDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            date_payment = projectmaterials.date_payment
        } = data
        await projectmaterials.update({date_payment})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createExpirationMaterialDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            expirationMaterial_date = projectmaterials.expirationMaterial_date
        } = data
        await projectmaterials.update({expirationMaterial_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async delete(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
    
        await projectmaterials.destroy();
        return projectmaterials;
    }

}

export default new ProjectMaterials()
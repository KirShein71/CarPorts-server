import { ProjectMaterials as ProjectMaterialsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Material as MaterialMapping} from './mapping.js'



class ProjectMaterials {
    async getAll() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date', 'design_period', 'id'],
                  where: {
                    finish: null
                }
                },
                 
                {
                  model: MaterialMapping,
                        attributes: ['name']}
                  
              ],

              order: [
                ['projectId', 'DESC']
              ]
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, date_payment, ready_date, shipping_date, check, color, project, id } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            if (existingProject) {
              existingProject.props.push({ id: id, materialId: materialId, materialName: materialName, date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check, color: color });
            } else {
              acc.push({
                id: project.id,
                name: project.name,
                number: project.number,
                expiration_date: project.expiration_date,
                agreement_date: project.agreement_date,
                design_period: project.design_period,
                projectId: projectId,
                props: [{ id:id, materialId: materialId, materialName: materialName, date_payment: date_payment,  ready_date: ready_date, shipping_date: shipping_date, check: check, color: color }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }

    async getAllMaterialProject() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date', 'design_period', 'id'],
                  where: {
                    finish: null
                }
                },
                 
                {
                  model: MaterialMapping,
                        attributes: ['name']}
                  
              ],

              order: [
                ['materialId', 'DESC']
              ]
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { materialId, materialName, date_payment, ready_date, shipping_date, check, color, project, id } = item;
            const existingProject = acc.find((material) => material.materialId === materialId);
            if (existingProject) {
              existingProject.props.push({ id: id, name: project.name, number: project.number, expiration_date: project.expiration_date, agreement_date: project.agreement_date, design_period: project.design_period,  date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check, color: color });
            } else {
              acc.push({
                materialId: materialId,
                materialName: materialName,
                props: [{ id:id, name: project.name, number: project.number, expiration_date: project.expiration_date, agreement_date: project.agreement_date, design_period: project.design_period, date_payment: date_payment,  ready_date: ready_date, shipping_date: shipping_date, check: check, color: color }]
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
        const { date_payment, expirationMaterial_date, ready_date, shipping_date, check, color, projectId, materialId, materialName } = data;
        const projectmaterials = await ProjectMaterialsMapping.create({ date_payment, expirationMaterial_date, ready_date, shipping_date, check, color, projectId, materialId, materialName });
        const created = await ProjectMaterialsMapping.findByPk(projectmaterials.id);
        return created;
    }

   

      async createCheckProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            check = projectmaterials.check
        } = data
        await projectmaterials.update({check})
        await projectmaterials.reload()
        return projectmaterials
    }

    async deleteCheckProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ check: null });
        return projectmaterials;
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

    async deleteReadyDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ ready_date: null });
        return projectmaterials;
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

    async deleteShippingDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ shipping_date: null });
        return projectmaterials;
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


    async deletePaymentDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ date_payment: null });
        return projectmaterials;
    }

    async createColorProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            color = projectmaterials.color
        } = data
        await projectmaterials.update({color})
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
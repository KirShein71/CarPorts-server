import { ProjectBrigades as ProjectBrigadesMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Brigade as BrigadeMapping } from './mapping.js'

import AppError from '../errors/AppError.js'

class ProjectBrigades {
    async getAll() {
        const projectsbrigades = await ProjectBrigadesMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number', 'agreement_date', 'design_period', 'expiration_date', 'installation_period'],
                    where: {
                        date_finish: null
                    }
                },
                {
                    model: BrigadeMapping,
                    attributes: ['name']
                }
              ],
        })
        
        const formattedData = projectsbrigades.reduce((acc, item) => {
            const { projectId, brigadeId, brigade, id, project, plan_start, plan_finish  } = item;
            const existingbrigade = acc.find((brigade) => brigade.brigadeId === brigadeId);
            if (existingbrigade) {
              existingbrigade.props.push({id: id, projectId: projectId, projectName: project.name, projectNumber: project.number, agreementDate: project.agreement_date, designPeriod: project.design_period, expirationDate: project.expiration_date, installationPeriod: project.installation_period, plan_start: plan_start, plan_finish: plan_finish  });
            } else {
              acc.push({
                brigade: {
                  name: brigade.name,
                },
                brigadeId,
                props: [{ id:id, projectId: projectId, projectName: project.name, projectNumber: project.number, agreementDate: project.agreement_date, designPeriod: project.design_period, expirationDate: project.expiration_date, installationPeriod: project.installation_period, plan_start, plan_finish: plan_finish  }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }
    
    async getOne(id) {
        const projectbrigades = await ProjectBrigadesMapping.findByPk(id)
        if (!projectbrigades) { 
            throw new Error('Товар не найден в БД')
        }
        return projectbrigades
    } 


    async create(data) {
        const {  projectId, brigadeId, plan_start, plan_finish } = data;
        const projectbrigades = await ProjectBrigadesMapping.create({projectId, brigadeId, plan_start, plan_finish  });
        const created = await ProjectBrigadesMapping.findByPk(projectbrigades.id);
        return created;
    }

    async createPlanStart(id, data) {
        const projectbrigades = await ProjectBrigadesMapping.findByPk(id)
        if (!projectbrigades) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            plan_start = projectbrigades.plan_start
        } = data
        await projectbrigades.update({plan_start})
        await projectbrigades.reload()
        return projectbrigades
    }

    async createPlanFinish(id, data) {
        const projectbrigades = await ProjectBrigadesMapping.findByPk(id)
        if (!projectbrigades) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            plan_finish = projectbrigades.plan_finish
        } = data
        await projectbrigades.update({plan_finish})
        await projectbrigades.reload()
        return projectbrigades
    }

}

export default new ProjectBrigades()
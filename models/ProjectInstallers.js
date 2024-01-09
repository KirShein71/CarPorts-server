import { ProjectInstallers as ProjectInstallersMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Installer as InstallerMapping } from './mapping.js'

import AppError from '../errors/AppError.js'

class ProjectInstallers {
    async getAll() {
        const projectsinstallers = await ProjectInstallersMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number', 'agreement_date', 'design_period', 'expiration_date', 'installation_period']
                },
                {
                    model: InstallerMapping,
                    attributes: ['name']
                }
              ],
        })
        
        const formattedData = projectsinstallers.reduce((acc, item) => {
            const { projectId, installerId, installer, id, project, plan_start, plan_finish  } = item;
            const existingInstaller = acc.find((installer) => installer.installerId === installerId);
            if (existingInstaller) {
              existingInstaller.props.push({id: id, projectId: projectId, projectName: project.name, projectNumber: project.number, agreementDate: project.agreement_date, designPeriod: project.design_period, expirationDate: project.expiration_date, installationPeriod: project.installation_period, plan_start: plan_start, plan_finish: plan_finish  });
            } else {
              acc.push({
                installer: {
                  name: installer.name,
                },
                installerId,
                props: [{ id:id, projectId: projectId, projectName: project.name, projectNumber: project.number, agreementDate: project.agreement_date, designPeriod: project.design_period, expirationDate: project.expiration_date, installationPeriod: project.installation_period, plan_start, plan_finish: plan_finish  }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }
    
    async getOne(id) {
        const projectinstallers = await ProjectInstallersMapping.findByPk(id)
        if (!projectinstallers) { 
            throw new Error('Товар не найден в БД')
        }
        return projectinstallers
    } 

    async create(data) {
        const {  projectId, installerId, plan_start, plan_finish } = data;
        const projectinstallers = await ProjectInstallersMapping.create({projectId, installerId, plan_start, plan_finish  });
        const created = await ProjectInstallersMapping.findByPk(projectinstallers.id);
        return created;
    }

}

export default new ProjectInstallers()
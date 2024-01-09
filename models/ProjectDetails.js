import { ProjectDetails as ProjectDetailsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'


import AppError from '../errors/AppError.js'

class ProjectDetails {
    async getAll() {
        const projectsdetails = await ProjectDetailsMapping.findAll({
          include: [
            {
              model: ProjectMapping,
              attributes: ['name', 'number']
            },
          ],
        });
      
        const formattedData = projectsdetails.reduce((acc, item) => {
          const { projectId, detailId, quantity, project, id } = item;
          const existingProject = acc.find((project) => project.projectId === projectId);
          if (existingProject) {
            existingProject.props.push({id: id, detailId: detailId, quantity: quantity });
          } else {
            acc.push({
              project: {
                name: project.name,
                number: project.number
              },
              projectId: projectId,
              props: [{ id:id, detailId: detailId, quantity: quantity }]
            });
          }
          return acc;
        }, []);
      
        return formattedData;
      }
      
      
    async getOne(id) {
        const projectdetails = await ProjectDetailsMapping.findByPk(id)
        if (!projectdetails) { 
            throw new Error('Товар не найден в БД')
        }
        return projectdetails
    } 

    async create(data) {
        const { quantity, projectId, detailId } = data;
        const projectdetails = await ProjectDetailsMapping.create({ quantity, projectId, detailId });
        const created = await ProjectDetailsMapping.findByPk(projectdetails.id);
        return created;
    }



    async getProject(projectId) {
        const project = await ProjectMapping.findByPk(projectId);
        if (!project) {
          throw new Error('Проект не найден в БД');
        }
      
        const projectdetails = await ProjectDetailsMapping.findAll({
          where: {
            project_id: projectId
          }
        });
      
        if (!projectdetails) {
          throw new Error('Данные проекта не найдены в БД');
        }
      
        return projectdetails;
      }

}

export default new ProjectDetails()
import {  ProjectDetails as ProjectDetailsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Antypical as AntypicalMapping } from './mapping.js';


class ProjectDetails {
    async getAll() {
        const projectsdetails = await ProjectDetailsMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number'],
                },
                {
                    model: AntypicalMapping, 
                    attributes: ['image', 'id'],
                },
            ],
            order: [
                ['projectId', 'ASC'],
            ],

        });
    
        const formattedData = projectsdetails.reduce((acc, item) => {
            const { projectId, project, id, antypical } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            if (existingProject) {
                existingProject.props.push({ id: id, detailId: item.detailId, quantity: item.quantity });
                if (antypical && antypical.image && !existingProject.antypical.some(img => img.image === antypical.image)) {
                    existingProject.antypical.push({ image: antypical.image, id: antypical.id });
                }
            } else {
                acc.push({
                    projectId: projectId,
                    project: {
                        name: project.name,
                        number: project.number
                    },
                    antypical: antypical && antypical.image ? [{ image: antypical.image, id: antypical.id }] : [],
                    props: [{ id: id, detailId: item.detailId, quantity: item.quantity }]
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

      async update(id, data) {
        const projectdetails = await ProjectDetailsMapping.findByPk(id)
        if (!projectdetails) {
            throw new Error('Товар не найден в БД')
        }
        const {
            quantity = projectdetails.quantity
        } = data
        await projectdetails.update({quantity})
        await projectdetails.reload()
        return projectdetails
    }

}

export default new ProjectDetails()
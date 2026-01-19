import {  ProjectDetails as ProjectDetailsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Antypical as AntypicalMapping } from './mapping.js';


class ProjectDetails {
    async getAll() {
        const projectsdetails = await ProjectDetailsMapping.findAll({
            include: [
            {
                model: ProjectMapping,
                attributes: ['name', 'number', 'finish'],
            },
            {
                model: AntypicalMapping, 
                attributes: ['image', 'id', 'name', 'antypicals_quantity', 'antypicals_welders_quantity', 'antypicals_shipment_quantity', 'antypicals_delivery_quantity','color'], 
            },
            ],
            order: [
                ['projectId', 'DESC'],
            ],
        });

        const formattedData = projectsdetails.reduce((acc, item) => {
            const { projectId, project, id, antypical } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            
            if (existingProject) {
            existingProject.props.push({ 
                id: id, 
                detailId: item.detailId, 
                quantity: item.quantity, 
                color: item.color
            });
            
            if (antypical && antypical.image && !existingProject.antypical.some(img => img.id === antypical.id)) {
                existingProject.antypical.push({ 
                image: antypical.image, 
                id: antypical.id, 
                name: antypical.name, 
                antypicals_quantity: antypical.antypicals_quantity,
                antypicals_welders_quantity: antypical.antypicals_welders_quantity,
                antypicals_shipment_quantity: antypical.antypicals_shipment_quantity,
                antypicals_delivery_quantity: antypical.antypicals_delivery_quantity,
                color: antypical.color 
                });
            }
            } else {
            acc.push({
                projectId: projectId,
                project: {
                name: project.name,
                number: project.number,
                finish: project.finish
                },
                antypical: antypical && antypical.image ? [{ 
                image: antypical.image, 
                id: antypical.id, 
                name: antypical.name, 
                antypicals_quantity: antypical.antypicals_quantity,
                antypicals_welders_quantity: antypical.antypicals_welders_quantity,
                antypicals_shipment_quantity: antypical.antypicals_shipment_quantity,
                antypicals_delivery_quantity: antypical.antypicals_delivery_quantity,
                color: antypical.color 
                }] : [],
                props: [{ 
                id: id, 
                detailId: item.detailId, 
                quantity: item.quantity, 
                color: item.color
                }]
            });
            }
            return acc;
        }, []);

        return formattedData;
    }
      
      
    async getOne(id) {
        const projectdetails = await ProjectDetailsMapping.findByPk(id)
        if (!projectdetails) { 
            throw new Error('Строка не найдена в БД')
        }
        return projectdetails
    } 



    async create(data) {
        const { quantity, projectId, detailId, color } = data;
        const projectdetails = await ProjectDetailsMapping.create({ quantity, projectId, detailId, color });
        const created = await ProjectDetailsMapping.findByPk(projectdetails.id);
        return created;
    }

    async createColor(id, data) {
        const projectdetails = await ProjectDetailsMapping.findByPk(id)
        if (!projectdetails) {
            throw new Error('Товар не найден в БД')
        }
        const {
            color = projectdetails.color
        } = data
        await projectdetails.update({color})
        await projectdetails.reload()
        return projectdetails
    }

    async addToProduction(data) {
        const { projectId } = data;
        const projectdetails = await ProjectDetailsMapping.create({ projectId });
        const created = await ProjectDetailsMapping.findByPk(projectdetails.id);
        return created;
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

    async delete(projectId) {
        const projectdetails = await ProjectDetailsMapping.findAll({ where: { projectId: projectId } });
        if (!projectdetails || projectdetails.length === 0) {
            throw new Error('Проект не найден');
        }
        for (const projectdetail of projectdetails) {
            await projectdetail.destroy();
        }
    
        return projectdetails;
    }

}

export default new ProjectDetails()
import {  ProjectDetails as ProjectDetailsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Antypical as AntypicalMapping } from './mapping.js';
import { ShipmentDetails as ShipmentDetailsMapping} from './mapping.js'
import { Detail as DetailMapping } from './mapping.js';


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

    
    async getAllProjectDetailForProject(projectId) {
        const projectsdetails = await ProjectDetailsMapping.findAll({
            where: { projectId: projectId },
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

    async getAllWeightAndPrice() {
        // 1. Получаем уникальные projectId из ProjectDetailsMapping
        const projectIds = await ProjectDetailsMapping.findAll({
            attributes: ['projectId'],
            group: ['projectId'] // Здесь group нужен только для уникальности
        });

        // 2. Получаем данные проектов из ProjectMapping
        const projectsData = await ProjectMapping.findAll({
            where: {
                id: projectIds.map(p => p.projectId)
            },
            attributes: ['id', 'name', 'number', 'finish']
        });

        // 3. Получаем все shipmentDetails для расчета веса и суммы
        const allShipmentDetails = await ShipmentDetailsMapping.findAll({
            include: [
                {
                    model: DetailMapping,
                    attributes: ['weight', 'price']
                }
            ],
        });

        // 4. Группируем shipmentDetails по projectId
        const weightAndPriceMap = new Map();
        
        allShipmentDetails.forEach(item => {
            const projectId = item.projectId;
            const itemWeight = (item.shipment_quantity || 0) * (item.detail?.weight || 0);
            const itemCost = (item.shipment_quantity || 0) * (item.detail?.price || 0);
            
            if (weightAndPriceMap.has(projectId)) {
                const existing = weightAndPriceMap.get(projectId);
                existing.totalWeight += itemWeight;
                existing.totalCost += itemCost;
            } else {
                weightAndPriceMap.set(projectId, {
                    projectId: projectId,
                    totalWeight: itemWeight,
                    totalCost: itemCost
                });
            }
        });

        // 5. Формируем результат
        const result = projectsData.map(project => {
            const weightData = weightAndPriceMap.get(project.id) || {
                totalWeight: 0,
                totalCost: 0
            };
            
            return {
                projectId: project.id,
                project: {
                    name: project.name || '',
                    number: project.number || '',
                    finish: project.finish || null
                },
                totalWeight: weightData.totalWeight,
                totalCost: weightData.totalCost
            };
        });
        
        return result;
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

    async deleteOneProjectDetail(id) {
        const projectdetails = await ProjectDetailsMapping.findByPk(id)
        if (!projectdetails) {
            throw new Error('Деталь не найдена в БД')
        }
        await projectdetails.destroy()
        return projectdetails
    }

}

export default new ProjectDetails()
import { ProjectWarehouse as ProjectWarehouseMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js'



class ProjectWarehouse {
    async getAll() {
        const project_warehouse = await ProjectWarehouseMapping.findAll({
            include: [
            {
                model: ProjectMapping,
                attributes: ['name', 'number', 'finish'],
            },
            ],
            order: [
                ['projectId', 'DESC'],
            ],
        });

        const formattedData = project_warehouse.reduce((acc, item) => {
            const { projectId, project, id } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            
            if (existingProject) {
            existingProject.props.push({ 
                id: id, 
                warehouse_assortement_id: item.warehouse_assortement_id, 
                quantity: item.quantity, 
                quantity_stat: item.quantity_stat
              
            });
            
            } else {
            acc.push({
                projectId: projectId,
                project: {
                    name: project.name,
                    number: project.number,
                    finish: project.finish
                },
                props: [{ 
                    id: id, 
                    warehouse_assortement_id: item.warehouse_assortement_id, 
                    quantity: item.quantity, 
                    quantity_stat: item.quantity_stat
                }]
            });
            }
            return acc;
        }, []);

        return formattedData;
    }
      
      
    async getOne(id) {
        const project_warehouse = await ProjectWarehouseMapping.findByPk(id)
        if (!project_warehouse) { 
            throw new Error('Строка не найдена в БД')
        }
        return project_warehouse
    } 



    async create(data) {
        const { quantity, quantity_stat, projectId, warehouse_assortement_id } = data;
        const project_warehouse = await ProjectWarehouseMapping.create({ quantity, quantity_stat, projectId, warehouse_assortement_id});
        const created = await ProjectWarehouseMapping.findByPk(project_warehouse.id);
        return created;
    }


    async addToProduction(data) {
        const { projectId } = data;
        const project_warehouse = await ProjectWarehouseMapping.create({ projectId });
        const created = await ProjectWarehouseMapping.findByPk(project_warehouse.id);
        return created;
    }

    async update(id, data) {
        const project_warehouse = await ProjectWarehouseMapping.findByPk(id)
        if (!project_warehouse) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            quantity = project_warehouse.quantity,
            quantity_stat = project_warehouse.quantity
        } = data
        await project_warehouse.update({quantity, quantity_stat})
        await project_warehouse.reload()
        return project_warehouse
    }

    async delete(projectId) {
        const project_warehouses = await ProjectWarehouseMapping.findAll({ where: { projectId: projectId } });
        if (!project_warehouses || project_warehouses.length === 0) {
            throw new Error('Проект не найден');
        }
        for (const project_warehouse of project_warehouses) {
            await project_warehouse.destroy();
        }
    
        return project_warehouses;
    }

    async deleteOneWarehouseDetail(id) {
        const warehouse_assortment = await ProjectWarehouseMapping.findByPk(id)
        if (!warehouse_assortment) {
            throw new Error('Деталь не найдена в БД')
        }
        await warehouse_assortment.destroy()
        return warehouse_assortment
    }

}

export default new ProjectWarehouse()
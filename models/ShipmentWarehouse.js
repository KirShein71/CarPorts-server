import { ShipmentWarehouse as ShipmentWarehouseMapping } from './mapping.js';
import { ProjectWarehouse as ProjectWarehouseMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js'



class ShipmentWarehouse {
    async getAll() {
        const shipment_warehouse = await ShipmentWarehouseMapping.findAll({
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

        // Создаем массив для объединенных данных
        const combinedData = [];

        // Обрабатываем shipment_warehouse данные
        shipment_warehouse.forEach((item) => {
            const { projectId, project, id, warehouse_assortement_id, done } = item;
            
            // Ищем существующий проект в combinedData
            let existingProject = combinedData.find(p => p.projectId === projectId);
            
            if (!existingProject) {
                // Если проект не найден, создаем новый
                existingProject = {
                    projectId: projectId,
                    project: {
                        name: project.name,
                        number: project.number,
                        finish: project.finish
                    },
                    shipments: [],
                    orders: [],
                    exceeded: [] // Добавляем массив для превышений
                };
                combinedData.push(existingProject);
            }
            
            // Добавляем shipment в соответствующий проект
            existingProject.shipments.push({
                id: id,
                warehouse_assortement_id: warehouse_assortement_id,
                done: done
            });
        });

        // Обрабатываем project_warehouse данные
        project_warehouse.forEach((item) => {
            const { projectId, project, id, warehouse_assortement_id, quantity, quantity_stat } = item;
            
            // Ищем существующий проект в combinedData
            let existingProject = combinedData.find(p => p.projectId === projectId);
            
            if (!existingProject) {
                // Если проект не найден, создаем новый
                existingProject = {
                    projectId: projectId,
                    project: {
                        name: project.name,
                        number: project.number,
                        finish: project.finish
                    },
                    shipments: [],
                    orders: [],
                    exceeded: [] // Добавляем массив для превышений
                };
                combinedData.push(existingProject);
            }
            
            // Добавляем order в соответствующий проект
            existingProject.orders.push({
                id: id,
                warehouse_assortement_id: warehouse_assortement_id,
                quantity: quantity,
                quantity_stat: quantity_stat // Добавляем quantity_stat в order
            });
            
            // Проверяем превышение quantity_stat над quantity
            if (quantity_stat > quantity) {
                // Ищем, есть ли уже это превышение в массиве exceeded
                const existingExceeded = existingProject.exceeded.find(
                    e => e.warehouse_assortement_id === warehouse_assortement_id
                );
                
                if (existingExceeded) {
                    // Если превышение уже есть, обновляем разницу
                    existingExceeded.exceeded_quantity = quantity_stat - quantity;
                } else {
                    // Иначе добавляем новое превышение
                    existingProject.exceeded.push({
                        warehouse_assortement_id: warehouse_assortement_id,
                        exceeded_quantity: quantity_stat - quantity
                    });
                }
            } else {
                // Если превышения нет, удаляем запись из exceeded (если она была)
                existingProject.exceeded = existingProject.exceeded.filter(
                    e => e.warehouse_assortement_id !== warehouse_assortement_id
                );
            }
        });

        // Сортируем по projectId DESC (уже отсортировано в запросах, но для надежности)
        combinedData.sort((a, b) => b.projectId - a.projectId);

        return combinedData;
    }
      
      
    async getOne(id) {
        const shipment_warehouse = await ShipmentWarehouseMapping.findByPk(id)
        if (!shipment_warehouse) { 
            throw new Error('Строка не найдена в БД')
        }
        return shipment_warehouse
    } 



    async create(data) {
        const { done, projectId, warehouse_assortement_id } = data;
        const shipment_warehouse = await ShipmentWarehouseMapping.create({ done, projectId, warehouse_assortement_id});
        const created = await ShipmentWarehouseMapping.findByPk(shipment_warehouse.id);
        return created;
    }



    async delete(id) {
        const warehouse_assortment = await ShipmentWarehouseMapping.findByPk(id)
        if (!warehouse_assortment) {
            throw new Error('Деталь не найдена в БД')
        }
        await warehouse_assortment.destroy()
        return warehouse_assortment
    }

}

export default new ShipmentWarehouse()
import { ShipmentWarehouse as ShipmentWarehouseMapping } from './mapping.js';
import { ProjectWarehouse as ProjectWarehouseMapping } from './mapping.js';
import { WarehouseAssortment as WarehouseAssortmentMapping } from "./mapping.js";
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

        const warehouse_assortement = await WarehouseAssortmentMapping.findAll();

        // Создаем Map для быстрого доступа к весу и цене ассортимента по ID
        const assortmentMap = new Map();
        warehouse_assortement.forEach(item => {
            assortmentMap.set(item.id, {
                weight: item.weight || 0,
                cost_price: item.cost_price || 0
            });
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
                    exceeded: [], // Добавляем массив для превышений
                    totalWeight: 0, // Общий вес
                    totalCost: 0    // Общая стоимость
                };
                combinedData.push(existingProject);
            }
            
            // Добавляем shipment в соответствующий проект
            existingProject.shipments.push({
                id: id,
                warehouse_assortement_id: warehouse_assortement_id,
                done: done,
            });
        });

        // Обрабатываем project_warehouse данные
        project_warehouse.forEach((item) => {
            const { projectId, project, id, warehouse_assortement_id, quantity, quantity_stat, note } = item;
            
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
                    exceeded: [], // Добавляем массив для превышений
                    totalWeight: 0, // Общий вес
                    totalCost: 0    // Общая стоимость
                };
                combinedData.push(existingProject);
            }
            
            // Добавляем order в соответствующий проект
            existingProject.orders.push({
                id: id,
                warehouse_assortement_id: warehouse_assortement_id,
                quantity: quantity,
                quantity_stat: quantity_stat,
                note: note
            });
            
            // Получаем вес и стоимость ассортимента из Map
            const assortmentInfo = assortmentMap.get(warehouse_assortement_id);
            const weightPerUnit = assortmentInfo ? assortmentInfo.weight : 0;
            const costPerUnit = assortmentInfo ? assortmentInfo.cost_price : 0;
            
            // Преобразуем quantity в число (на всякий случай)
            const qty = parseFloat(quantity) || 0;
            
            // Рассчитываем и добавляем к общему весу и стоимости
            existingProject.totalWeight += qty * weightPerUnit;
            existingProject.totalCost += qty * costPerUnit;
            
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

        // Для проектов, у которых есть только shipment_warehouse (без project_warehouse)
        // общий вес и стоимость останутся 0
        
        // Сортируем по projectId DESC (уже отсортировано в запросах, но для надежности)
        combinedData.sort((a, b) => b.projectId - a.projectId);

        // Округляем значения для лучшего представления
        combinedData.forEach(project => {
            project.totalWeight = Math.round(project.totalWeight * 100) / 100; // 2 знака после запятой
            project.totalCost = Math.round(project.totalCost * 100) / 100;    // 2 знака после запятой
        });

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
        const shipment_warehouse = await ShipmentWarehouseMapping.findByPk(id)
        if (!shipment_warehouse) {
            throw new Error('Деталь не найдена в БД')
        }
        await shipment_warehouse.destroy()
        return shipment_warehouse
    }

}

export default new ShipmentWarehouse()
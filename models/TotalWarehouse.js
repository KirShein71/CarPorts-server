import { ShipmentWarehouse as ShipmentWarehouseMapping } from './mapping.js'
import { ProjectWarehouse as ProjectWarehouseMapping } from './mapping.js'
import { AddWarehouse as AddWarehouseMapping } from './mapping.js'

class TotalWarehouse {
    async getTotalWarehouseData() {
        // Получаем все данные
        const [addWarehouse, projectWarehouse, shipmentWarehouse] = await Promise.all([
            AddWarehouseMapping.findAll({ attributes: ['warehouse_assortement_id', 'quantity'], raw: true }),
            ProjectWarehouseMapping.findAll({ attributes: ['warehouse_assortement_id', 'quantity', 'quantity_stat', 'project_id'], raw: true }),
            ShipmentWarehouseMapping.findAll({ attributes: ['warehouse_assortement_id', 'done', 'project_id'], raw: true })
        ]);

        // 1. Суммируем add_warehouse (складываем все quantity по каждому warehouse_assortement_id)
        const addMap = new Map();
        addWarehouse.forEach(item => {
            const id = item.warehouse_assortement_id;
            const current = addMap.get(id) || 0;
            addMap.set(id, current + (Number(item.quantity) || 0));
        });

        // 2. Создаем Set для отгруженных комбинаций
        const shippedSet = new Set();
        shipmentWarehouse.forEach(item => {
            const isDone = item.done === true || item.done === 1 || item.done === 'true';
            if (isDone) {
                shippedSet.add(`${item.warehouse_assortement_id}_${item.project_id}`);
            }
        });

        // 3. Собираем данные по каждой детали
        const resultMap = new Map();

        projectWarehouse.forEach(projectItem => {
            const id = projectItem.warehouse_assortement_id;
            const isShipped = shippedSet.has(`${id}_${projectItem.project_id}`);
            
            if (!resultMap.has(id)) {
                resultMap.set(id, {
                    warehouse_assortement_id: id,
                    add_warehouse: 0,           // Добавлено поле add_warehouse
                    order_warehouse: 0,
                    shipment_warehouse: 0,
                    remainder_warehouse: 0
                });
            }
            
            const entry = resultMap.get(id);
            
            // Суммируем order_warehouse (все quantity_stat)
            entry.order_warehouse += Number(projectItem.quantity_stat) || 0;
            
            // Если деталь отгружена, суммируем quantity
            if (isShipped) {
                entry.shipment_warehouse += Number(projectItem.quantity) || 0;
            }
        });

        // 4. Добавляем детали, которые есть только в add_warehouse
        addMap.forEach((quantity, id) => {
            if (!resultMap.has(id)) {
                resultMap.set(id, {
                    warehouse_assortement_id: id,
                    add_warehouse: 0,
                    order_warehouse: 0,
                    shipment_warehouse: 0,
                    remainder_warehouse: 0
                });
            }
        });

        // 5. Заполняем add_warehouse для всех деталей и вычисляем remainder_warehouse
        for (const [id, entry] of resultMap) {
            const addQuantity = addMap.get(id) || 0;
            entry.add_warehouse = addQuantity;
            entry.remainder_warehouse = addQuantity - entry.shipment_warehouse;
        }

        // Сортируем результат
        const result = Array.from(resultMap.values()).sort((a, b) => 
            a.warehouse_assortement_id - b.warehouse_assortement_id
        );

        return result;
    }
}

export default new TotalWarehouse()
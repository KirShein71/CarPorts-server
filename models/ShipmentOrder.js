import { and } from "sequelize";
import { ShipmentOrder as ShipmentOrderMapping } from "./mapping.js";
import { ShipmentDetails as ShipmentDetailsMapping } from "./mapping.js";
import { Project as ProjectMapping } from "./mapping.js";
import { ProjectDetails as ProjectDetailsMapping } from "./mapping.js";
import { Antypical as AntypicalMapping } from "./mapping.js";

class ShipmentOrder {
    async getAll() {
        const shipment_orders = await ShipmentOrderMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['number', 'name', 'finish'],
                },
            ],
        });

        // Группируем по ключу "projectId_shipment_date"
        const grouped = {};
        shipment_orders.forEach(item => {
            const { projectId, detailId, shipment_quantity, antypical_name, shipment_date, id, project } = item;
            // Если shipment_date нет, используем 'null' для группировки
            const key = `${projectId}_${shipment_date || 'null'}`;

            if (!grouped[key]) {
                grouped[key] = {
                    shipment_date,
                    projectId,
                    project: project ? {
                        number: project.number,
                        name: project.name,
                        finish: project.finish,
                    } : null,
                    props: [],
                };
            }

            grouped[key].props.push({
                id,
                detailId,
                shipment_quantity,
                antypical_name
            });
        });

        // Преобразуем объект в массив
        const formattedData = Object.values(grouped);
        return formattedData;
    }

    async getAllShipmentOrderForProject(projectId) {
        const shipment_orders = await ShipmentOrderMapping.findAll({
            where: { projectId: projectId },
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['number', 'name', 'finish'],
                },
            ],
        });

        // Группируем по ключу "projectId_shipment_date"
        const grouped = {};
        shipment_orders.forEach(item => {
            const { projectId, detailId, shipment_quantity, antypical_name, shipment_date, id, project } = item;
            // Если shipment_date нет, используем 'null' для группировки
            const key = `${projectId}_${shipment_date || 'null'}`;

            if (!grouped[key]) {
                grouped[key] = {
                    shipment_date,
                    projectId,
                    project: project ? {
                        number: project.number,
                        name: project.name,
                        finish: project.finish,
                    } : null,
                    props: [],
                };
            }

            grouped[key].props.push({
                id,
                detailId,
                shipment_quantity,
                antypical_name
            });
        });

        // Преобразуем объект в массив
        const formattedData = Object.values(grouped);
        return formattedData;
    }

    async getAllForShipmentOrderProject(projectId, date) {
        const shipment_orders = await ShipmentOrderMapping.findAll({
            where: { 
                project_id: projectId, 
                shipment_date: date
            }, 
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['number', 'name'],
                },
            ],
        });

        
        const grouped = {};
        shipment_orders.forEach(item => {
            const { 
                project_id, 
                detailId, 
                shipment_quantity, 
                antypical_name, 
                shipment_date, 
                color,
                image,
                id, 
                project 
            } = item;
            
            const key = `${project_id}_${shipment_date || 'null'}`;

            if (!grouped[key]) {
                grouped[key] = {
                    shipment_date,
                    projectName: project.name,
                    projectNumber: project.number,
                    projectId: project.id, 
                    props: [],
                };
            }

            grouped[key].props.push({
                id,
                detailId,
                shipment_quantity,
                antypical_name, 
                color,
                image
            });
        });

        // Преобразуем объект в массив
        const formattedData = Object.values(grouped);
        return formattedData;
    }

    async createShipmentOrder(date, projectId, options = {}) {
        // Получаем данные из ShipmentDetailsMapping (типовые детали)
        const shipment_details = await ShipmentDetailsMapping.findAll({
            where: { project_id: projectId }, 
            attributes: ['shipment_quantity', 'detail_id'],
            raw: true,
            transaction: options.transaction 
        });

        // Получаем цвета из ProjectDetailsMapping (для типовых деталей)
        const project_details = await ProjectDetailsMapping.findAll({
            where: { project_id: projectId }, 
            attributes: ['detail_id', 'color'],
            raw: true,
            transaction: options.transaction 
        });

        // Получаем данные из AntypicalMapping (нетиповые детали)
        const antypical_details = await AntypicalMapping.findAll({
            where: { project_id: projectId }, 
            attributes: ['id', 'name', 'color', 'image', 'antypicals_shipment_quantity'],
            raw: true,
            transaction: options.transaction 
        });

        // Создаем map для быстрого доступа к цветам по detail_id (для типовых)
        const colorMap = {};
        project_details.forEach(item => {
            colorMap[item.detail_id] = item.color;
        });

        // Формируем данные для типовых деталей
        const shipmentOrderData = shipment_details.map(shipDetail => ({
            shipment_date: date,
            shipment_quantity: shipDetail.shipment_quantity,
            projectId: projectId,
            detailId: shipDetail.detail_id,
            antypical_name: null, // для типовых - null
            antypical_id: null,   // для типовых - null
            color: colorMap[shipDetail.detail_id] || null,
            image: null,           // для типовых - null
        }));

        // Формируем данные для нетиповых деталей
        const antypicalOrderData = antypical_details.map(antypical => ({
            shipment_date: date,
            shipment_quantity: antypical.antypicals_shipment_quantity,
            projectId: projectId,
            detailId: null,        // для нетиповых - null
            antypical_name: antypical.name,
            antypical_id: antypical.id,
            color: antypical.color || null,
            image: antypical.image || null,
        }));

        // Объединяем оба массива
        const allOrderData = [...shipmentOrderData, ...antypicalOrderData];

        // Если нет данных - возвращаем пустой массив
        if (allOrderData.length === 0) {
            return [];
        }

        // Создаем все записи одним запросом
        const createdShipmentOrder = await ShipmentOrderMapping.bulkCreate(allOrderData, {
            returning: true,
            transaction: options.transaction
        });

        return createdShipmentOrder;
    }

    async getOne(id) {
        const shipment_details = await ShipmentOrderMapping.findByPk(id)
        if (!shipment_details) { 
            throw new Error('Деталь не найдена в БД')
        }
        return shipment_details
    } 

    async create(data) {
        const { shipment_quantity, shipment_date, projectId, detailId, color } = data;
        
        // Проверяем, является ли shipment_date валидной датой или null
        let dateToSave = null;
        
        if (shipment_date) {
            // Пробуем создать дату из переданного значения
            const parsedDate = new Date(shipment_date);
            // Проверяем, что дата валидная
            if (!isNaN(parsedDate.getTime())) {
                dateToSave = parsedDate;
            }
            // Если дата невалидная, оставляем null
        }
        
        const shipment_details = await ShipmentOrderMapping.create({ 
            shipment_quantity, 
            shipment_date: dateToSave, // будет либо null, либо валидная дата
            projectId, 
            detailId, 
            color 
        });
        
        const created = await ShipmentOrderMapping.findByPk(shipment_details.id);
        return created;
    }

    async createAntypical(data, img) {
        const { shipment_quantity, shipment_date, projectId, antypical_name, image, color} = data;
        
        // Проверяем, является ли shipment_date валидной датой или null
        let dateToSave = null;
        
        if (shipment_date) {
            // Пробуем создать дату из переданного значения
            const parsedDate = new Date(shipment_date);
            // Проверяем, что дата валидная
            if (!isNaN(parsedDate.getTime())) {
                dateToSave = parsedDate;
            }
            // Если дата невалидная, оставляем null
        }
        
        const shipment_details = await ShipmentOrderMapping.create({ 
            shipment_quantity, 
            shipment_date: dateToSave, // будет либо null, либо валидная дата
            projectId, 
            antypical_name, 
            color, 
            image 
        });
        
        const created = await ShipmentOrderMapping.findByPk(shipment_details.id);
        return created;
    }

    async createDateInShipmentOrderWithNoDate(projectId, data) {
        const { shipment_date } = data;
        
        // Находим все записи с null датой для этого проекта
        const shipmentDetails = await ShipmentOrderMapping.findAll({
            where: { 
                projectId: projectId,  // обратите внимание: projectId, не project_id
                shipment_date: null 
            },
        });
        
        if (!shipmentDetails || shipmentDetails.length === 0) {
            throw new Error('Записи с пустой датой не найдены');
        }
        
        // Вариант 1: Обновляем каждую запись в цикле
        for (const detail of shipmentDetails) {
            detail.shipment_date = shipment_date;
            await detail.save();
        }
        
        // Вариант 2: Используем bulk update (более эффективно)
        await ShipmentOrderMapping.update(
            { shipment_date: shipment_date },
            { 
                where: { 
                    projectId: projectId, 
                    shipment_date: null 
                } 
            }
        );
        
        // Получаем обновленные записи
        const updatedDetails = await ShipmentOrderMapping.findAll({
            where: { 
                projectId: projectId, 
                shipment_date: shipment_date 
            },
        });
        
        return updatedDetails;
    }

    async update(id, data) {
        const shipment_details = await ShipmentOrderMapping.findByPk(id)
        if (!shipment_details) {
            throw new Error('Деталь не найден в БД')
        }
        const {
            shipment_quantity = shipment_details.shipment_quantity
        } = data
        await shipment_details.update({shipment_quantity})
        await shipment_details.reload()
        return shipment_details
    }

   
    async deleteOneShipmentOrderDetail(id) {
        const shipment_details = await ShipmentOrderMapping.findByPk(id)
        if (!shipment_details) {
            throw new Error('Деталь не найдена в БД')
        }
        await shipment_details.destroy()
        return shipment_details
    }
}

export default new ShipmentOrder()


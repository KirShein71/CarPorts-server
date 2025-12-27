import { Antypical as AntypicalMapping} from './mapping.js'
import { Project as ProjectMapping } from './mapping.js';
import FileService from '../services/File.js'
import sequelize from '../sequelize.js';

class Antypical {

    async getAll() {
        const antypicals = await AntypicalMapping.findAll({
            include: [
            {
                model: ProjectMapping,
                attributes: ['name', 'number', 'id'],
                where: {
                finish: null
                }
            },
            ],
            order: [

                [sequelize.literal('CASE WHEN "antypicals_welders_quantity" IS NULL THEN 0 ELSE 1 END'), 'ASC'],

                [sequelize.literal('project_id'), 'DESC'],
            
            ],
        });
        
        return antypicals;
    }

    async getAllAntypiclasForProject(id) {
        const antypicals = await AntypicalMapping.findAll({
            where: {
                projectId: id
            },
            order: [
                ['id', 'DESC']
            ]
        });
        
        return antypicals;
    }

    async getAllForAntypicalsShipment() {
        const antypicals = await AntypicalMapping.findAll({
            include: [
            {
                model: ProjectMapping,
                attributes: ['name', 'number', 'id'],
                where: {
                finish: null
                }
            },
            ],
            order: [
                [sequelize.literal('CASE WHEN "antypicals_shipment_quantity" IS NULL THEN 0 ELSE 1 END'), 'ASC'],
                
                [sequelize.literal('project_id'), 'DESC'],
            ],
        });
        
        return antypicals;
    }
    
    async getOne(id) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) { 
            throw new Error('Товар не найден в БД')
        }
        return antypical
    }

    async create(data, img) {
        const image = FileService.save(img) || ''
        const {projectId, antypicals_quantity, color, name} = data
        const antypical = await AntypicalMapping.create({projectId, image, antypicals_quantity, color, name})
        
        const created = await AntypicalMapping.findByPk(antypical.id) 
        return created
    }

    async createColor(id, data) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Деталь не найден в БД')
        }
        const {
            color = antypical.color
        } = data
        await antypical.update({color})
        await antypical.reload()
        return antypical
    }

    async createName(id, data) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Деталь не найден в БД')
        }
        const {
            name = antypical.name
        } = data
        await antypical.update({name})
        await antypical.reload()
        return antypical
    }

    async createAntypicalsQuantity(id, data) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Деталь не найден в БД')
        }
        const {
            antypicals_quantity = antypical.antypicals_quantity
        } = data
        await antypical.update({antypicals_quantity})
        await antypical.reload()
        return antypical
    }

    async createAntypicalsShipmentQuantity(id, data) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Деталь не найден в БД')
        }
        const {
            antypicals_shipment_quantity = antypical.antypicals_shipment_quantity
        } = data
        await antypical.update({antypicals_shipment_quantity})
        await antypical.reload()
        return antypical
    }

    async createAntypicalsDeliveryQuantity(id, data) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Деталь не найден в БД')
        }
        const {
            antypicals_delivery_quantity = antypical.antypicals_delivery_quantity
        } = data
        await antypical.update({antypicals_delivery_quantity})
        await antypical.reload()
        return antypical
    }

    async createAntypicalsWeldersQuantity(id, data) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Деталь не найден в БД')
        }
        const {
            antypicals_welders_quantity = antypical.antypicals_welders_quantity
        } = data
        await antypical.update({antypicals_welders_quantity})
        await antypical.reload()
        return antypical
    }

    async update(id, data, img) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Товар не найден в БД')
        }
        const file = FileService.save(img)
        if (file && antypical.image) {
            FileService.delete(antypical.image)
        }
        const {
            image = file ? file : antypical.image
        } = data
        await antypical.update({image})
        // обновим объект товара, чтобы вернуть свежие данные
        await antypical.reload()
        return antypical
    }

    async delete(id) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) {
            throw new Error('Изображение не найден в БД')
        }
        if (antypical.image) { 
            FileService.delete(antypical.image)
        }
        await antypical.destroy()
        return antypical
    }
}

export default new Antypical()
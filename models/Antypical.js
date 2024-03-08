import { Antypical as AntypicalMapping} from './mapping.js'
import { Project as ProjectMapping } from './mapping.js';
import FileService from '../services/File.js'

class Antypical {

    async getAll() {
        const antypicals = await AntypicalMapping.findAll({
            include: [
              {
                model: ProjectMapping,
                attributes: ['name', 'number']
              },
            ],
          })
        return antypicals
    }
    
    async getOne(id) {
        const antypical = await AntypicalMapping.findByPk(id)
        if (!antypical) { 
            throw new Error('Товар не найден в БД')
        }
        return antypical
    }

    async create(data, img) {
        const image = FileService.save(img) ?? ''
        const {projectId} = data
        const antypical = await AntypicalMapping.create({projectId, image})
        
        const created = await AntypicalMapping.findByPk(antypical.id) 
        return created
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
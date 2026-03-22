import { Detail as DetailMapping } from "./mapping.js";
import FileService from '../services/File.js'



class Detail {
    async getAll() {
        const details = await DetailMapping.findAll()
        return details
    }

    async getOne(id) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        return detail
    }

    async create(data, img) {
        const { number, name, price, weight } = data;
        
        const detail = await DetailMapping.create({ 
            number, 
            name, 
            price, 
            weight,
            image: img ? (FileService.save(img) || '') : '' 
        });
        
        const created = await DetailMapping.findByPk(detail.id);
        return created;
    }

    async createPrice(id, data) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        const {

            price = detail.price
            
        } = data
        await detail.update({ price})
        await detail.reload()
        return detail
    }

    async createNumber(id, data) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        const {

            number = detail.number
            
        } = data
        await detail.update({ number})
        await detail.reload()
        return detail
    }

    async createWeight(id, data) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        const {

            weight = detail.weight
            
        } = data
        await detail.update({ weight})
        await detail.reload()
        return detail
    }

    async update(id, data, img) {
        const detail = await DetailMapping.findByPk(id);
        if (!detail) {
            throw new Error('Деталь не найдена в БД');
        }
        
        const { name, price, removeImage } = data; // removeImage - флаг для удаления изображения
        
        // Обработка изображения
        let image = detail.image;
        
        // Если передан флаг удаления изображения
        if (removeImage === 'true' && detail.image) {
            FileService.delete(detail.image);
            image = '';
        }
        
        // Если передано новое изображение
        if (img) {
            const file = FileService.save(img);
            if (file) {
                // Удаляем старое изображение, если оно было
                if (detail.image) {
                    FileService.delete(detail.image);
                }
                image = file;
            }
        }
        
        await detail.update({
            name: name || detail.name,
            price: price || detail.price,
            image: image
        });
        
        await detail.reload();
        return detail;
    }

   
    async delete(id) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        if (detail.image) { 
            FileService.delete(detail.image)
        }
        await detail.destroy()
        return detail
    }

    async deleteImage(id) {
        const detail = await DetailMapping.findByPk(id);
        if (!detail) {
            throw new Error('Деталь не найдена в БД');
        }
        
        // Если есть изображение - удаляем файл
        if (detail.image) {
            FileService.delete(detail.image);
            
            // Очищаем поле image в базе данных
            detail.image = null;
            await detail.save();
        }
        
        return detail;
    }

}

export default new Detail()
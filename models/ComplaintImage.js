import { ComplaintImage as ComplaintImageMapping } from './mapping.js'
import FileService from '../services/File.js'

class ComplaintImage {
    async getAll() {
        const complaintimages = await ComplaintImageMapping .findAll()
        return complaintimages
    }

 
    async getAllByComplaintId(complaintId) {
        const complaintimages = await ComplaintImageMapping.findAll({
            where: {
                complaintId: complaintId
            },
        })
        return complaintimages
    }

    
    async getOne(id) {
        const complaintimage = await ComplaintImageMapping .findByPk(id)
        if (!complaintimage) {
            throw new Error('Фотография не найдена в БД')
        }
        return complaintimage
    }

    async create(data, file) {
        const {complaintId} = data
        const image = FileService.save(file) || ''
        const complaintimage = await ComplaintImageMapping .create({complaintId, image})
        
        const created = await ComplaintImageMapping .findByPk(complaintimage.id) 
        return created
    }

    async update(id, data, img) {
        const complaintimage = await ComplaintImageMapping .findByPk(id)
        if (!complaintimage) {
            throw new Error('Строка не найдена в БД')
        }
        const file = FileService.save(img)
        if (file && complaintimage.image) {
            FileService.delete(complaintimage.image)
        }
        const {
            image = file ? file : complaintimage.image
            
        } = data
        await complaintimage.update({date, image})
        await complaintimage.reload()
        return complaintimage
    }



    async delete(id) {
        const complaintimage = await ComplaintImageMapping .findByPk(id)
        if (!complaintimage) {
            throw new Error('Фотография не найдена в БД')
        }
        await complaintimage.destroy()
        
        const image = complaintimage.image 
        FileService.delete(image)

        return complaintimage
    }
}

export default new ComplaintImage()
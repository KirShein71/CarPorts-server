import { UserImage as UserImageMapping } from './mapping.js'
import FileService from '../services/File.js'

class UserImage {
    async getAll() {
        const userimages = await UserImageMapping.findAll()
        return userimages
    }

    async getAllByUserId(userId) {
        const userimages = await UserImageMapping.findAll({
            where: {
                userId: userId
            },
        })
        return userimages
    }

    async getOne(id) {
        const userimage = await UserImageMapping.findByPk(id)
        if (!userimage) {
            throw new Error('Категория не найдена в БД')
        }
        return userimage
    }

    async create(data, file) {
        const {date, userId} = data
        const image = FileService.save(file) || ''
        const userimage = await UserImageMapping.create({date, userId, image})
        
        const created = await UserImageMapping.findByPk(userimage.id) 
        return created
    }

    async update(id, data, img) {
        const userimage = await UserImageMapping.findByPk(id)
        if (!userimage) {
            throw new Error('Деталь не найдена в БД')
        }
        const file = FileService.save(img)
        if (file && userimage.image) {
            FileService.delete(userimage.image)
        }
        const {
            date = userimage.date,
            image = file ? file : userimage.image
            
        } = data
        await userimage.update({date, image})
        await userimage.reload()
        return userimage
    }



    async delete(id) {
        const userimage = await UserImageMapping.findByPk(id)
        if (!userimage) {
            throw new Error('Деталь не найдена в БД')
        }
        await userimage.destroy()
        
        const image = userimage.image // предположим, что имя файла хранится в поле fileName
        FileService.delete(image)

        return userimage
    }
}

export default new UserImage()
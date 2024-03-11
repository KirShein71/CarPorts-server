import { UserFile as UserFileMapping } from './mapping.js'
import FileService from '../services/File.js'

class UserFile {
    async getAll() {
        const userfiles = await UserFileMapping.findAll()
        return userfiles
    }

    async getOne(id) {
        const userfile = await UserFileMapping.findByPk(id)
        if (!userfile) {
            throw new Error('Категория не найдена в БД')
        }
        return userfile
    }

    async getAllByUserId(userId) {
        const userfiles = await UserFileMapping.findAll({
            where: {
                userId: userId
            },
        })
        return userfiles
    }

    async create(data, img) {
        const {userId, name} = data
        const file = FileService.save(img) || ''
        const userfile = await UserFileMapping.create({userId, name, file})
        
        const created = await UserFileMapping.findByPk(userfile.id) 
        return created
    }

    async update(id, data, newFile) {
        const userfile = await UserFile.findByPk(id)
        if (!userfile) {
            throw new Error('Файл не найден в БД')
        }
        const fileName = FileService.save(newFile)
        if (fileName && userfile.file) {
            FileService.delete(userfile.file)
        }
        const {
            name = userfile.name,
            file: updatedFile = fileName ? fileName : userfile.file
            
        } = data
        await userfile.update({ name, file: updatedFile })
        await userfile.reload()
        return userfile
    }

    async delete(id) {
        const userfile = await UserFileMapping.findByPk(id)
        if (!userfile) {
            throw new Error('Файл не найдена в БД')
        }
        await userfile.destroy()
        const file = userfile.file // предположим, что имя файла хранится в поле fileName
        FileService.delete(file)
        return userfile
    }
}

export default new UserFile()
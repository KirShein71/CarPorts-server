import { Installer as InstallerMapping } from "./mapping.js";

import AppError from "../errors/AppError.js";

class Installer {
    async getAll() {
        const installers = await InstallerMapping.findAll()
        return installers
    }

    async getOne(id) {
        const installer = await InstallerMapping.findByPk(id)
        if (!installer) {
            throw new Error('Категория не найдена в БД')
        }
        return installer
    }

    async create(data) {
        const {name} = data
        const installer = await InstallerMapping.create({name})
        const created = await InstallerMapping.findByPk(installer.id) 
        return created
    }


    async update(id, data) {
        const installer = await InstallerMapping.findByPk(id)
        if (!installer) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            name = installer.name,
            
        } = data
        await installer.update({name})
        await installer.reload()
        return installer
    }

    async delete(id) {
        const installer = await InstallerMapping.findByPk(id)
        if (!installer) {
            throw new Error('Деталь не найдена в БД')
        }
        await installer.destroy()
        return installer
    }

}

export default new Installer()
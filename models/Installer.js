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

}

export default new Installer()
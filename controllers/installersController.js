import InstallerModel from '../models/Installer.js'
import AppError from '../errors/AppError.js'

class InstallersController {
    async getAll(req, res, next) {
        try {
            const installers = await InstallerModel.getAll()
            res.json(installers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const installer = await InstallerModel.getOne(req.params.id)
            res.json(installer)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new InstallersController()
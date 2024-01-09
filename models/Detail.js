import { Detail as DetailMapping } from "./mapping.js";
import { ProjectDetails as ProjectDetailsMapping } from "./mapping.js";
import AppError from "../errors/AppError.js";

class Detail {
    async getAll() {
        const details = await DetailMapping.findAll()
        return details
    }

    async getOne(id) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Категория не найдена в БД')
        }
        return detail
    }

}

export default new Detail()
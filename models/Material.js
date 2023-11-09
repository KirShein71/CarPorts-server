import { Material as MaterialMapping } from "./mapping.js";
import AppError from "../errors/AppError.js";

class Material {
    async getAll() {
        const materials = await MaterialMapping.findAll()
        return materials
    }

    async getOne(id) {
        const material = await MaterialMapping.findByPk(id)
        if (!material) {
            throw new Error('Категория не найдена в БД')
        }
        return material
    }

}

export default new Material()
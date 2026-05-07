import { PortfolioImage as PortfolioImageMapping } from './mapping.js'
import FileService from '../services/File.js'

class PortfolioImage {
    
    async getAllByProjectId(projectId) {
        const portfolio_images = await PortfolioImageMapping.findAll({
            where: {
                userId: projectId
            },
        })
        return portfolio_images
    }

    
    async create(data, file) {
        const {projectId} = data
        const image = FileService.save(file) || ''
        const portfolio_image = await PortfolioImageMapping.create({projectId, image})
        
        const created = await PortfolioImageMapping.findByPk(portfolio_image.id) 
        return created
    }

    
    async delete(id) {
        const portfolio_image = await PortfolioImageMapping.findByPk(id)
        if (!portfolio_image) {
            throw new Error('Изображение не найдено в БД')
        }
        await portfolio_image.destroy()
        
        const image = portfolio_image.image 
        FileService.delete(image)

        return portfolio_image
    }
}

export default new PortfolioImage()
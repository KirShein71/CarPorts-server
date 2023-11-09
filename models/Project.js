import { Project as ProjectMapping } from "./mapping.js";



class Project {
    async getAll() {
        const projects = await ProjectMapping.findAll()
        return projects
    }
    
    async getOne(id) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) { 
            throw new Error('Товар не найден в БД')
        }
        return project
    }

    async create(data) {
        const {name, agreement_date, design_period, expiration_date, installation_period, note, designer, design_start, project_delivery, status} = data
        const project = await ProjectMapping.create({name, agreement_date, design_period, expiration_date, installation_period, note, designer, design_start, project_delivery, status})
        
        const created = await ProjectMapping.findByPk(project.id) 
        return created
    }

    async update(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Товар не найден в БД')
        }
        const {
            name = project.name,
            agreement_date = project.agreement_date,
            design_period = project.design_period,
            expiration_date = project.expiration_date,
            installation_period = project.installation_period,
            note = project.note,
            designer = project.designer,
            design_start = project.design_start,
            project_delivery = project.project_delivery,
            status = project.status
        } = data
        await project.update({name, agreement_date, design_period, expiration_date, installation_period, note, designer, design_start, project_delivery, status})
        await project.reload()
        return project
    }

    async delete(id) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        await project.destroy()
        return project
    }

}

export default new Project()
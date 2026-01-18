import {NpsProject as NpsProjectMapping} from './mapping.js'
import {NpsNote as NpsNoteMapping} from './mapping.js'


class NpsProject {
    async getAll() {
        const nps_project = await NpsProjectMapping.findAll({
            
        })
        return nps_project
    }

    async getOne(id) {
        const nps_project = await NpsProjectMapping.findByPk(id)
        if (!nps_project) {
            throw new Error('Строка не найдена в БД')
        }
        return nps_project
    }

    async getForProject(projectId) {
        const nps_project = await NpsProjectMapping.findAll({
            where: {
                project_id: projectId
            },
        })
        return nps_project
    }

    async create(data) {
        const {score, nps_chapter_id, nps_question_id, projectId} = data
        const nps_project = await NpsProjectMapping.create({score, nps_chapter_id, nps_question_id, projectId})
        
        const created = await NpsProjectMapping.findByPk(nps_project.id) 
        return created
    }

   
    async updateScore(id, data) {
        const nps_project = await NpsProjectMapping.findByPk(id)
        if (!nps_project) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            score = nps_project.score,
          
            
        } = data
        await nps_project.update({score})
        await nps_project.reload()
        return nps_project
    }

    async delete(id) {
        const nps_project = await NpsProjectMapping.findByPk(id)
        if (!nps_project) {
            throw new Error('Строка не найдена в БД')
        }
        await nps_project.destroy()
        return nps_project
    }

    async getNoteForProject(projectId) {
        const nps_project = await NpsNoteMapping.findAll({
            where: {
                project_id: projectId
            },
        })
        return nps_project
    }

    async createNote(data) {
        const {note, projectId} = data
        const nps_note = await NpsNoteMapping.create({note, projectId})
        
        const created = await NpsNoteMapping.findByPk(nps_note.id) 
        return created
    }

   
    async updateNote(id, data) {
        const nps_note = await NpsNoteMapping.findByPk(id)
        if (!nps_note) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            note = nps_note.note,
          
            
        } = data
        await nps_note.update({note})
        await nps_note.reload()
        return nps_note
    }

    async deleteNote(id) {
        const nps_note = await NpsNoteMapping.findByPk(id)
        if (!nps_note) {
            throw new Error('Строка не найдена в БД')
        }
        await nps_note.destroy()
        return nps_note
    }

}

export default new NpsProject()
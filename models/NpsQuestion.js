import { NpsQuestion as NpsQuestionMapping } from "./mapping.js"
import { NpsChapter as NpsChapterMapping } from './mapping.js'


class NpsQuestion {
    async getAll() {
        const nps_question = await NpsQuestionMapping.findAll({
            include: [
                {
                    model: NpsChapterMapping,
                    attributes: ['name']
                },
            ]
        })
        return nps_question
    }

    async getOne(id) {
        const nps_question = await NpsQuestionMapping.findByPk(id)
        if (!nps_question) {
            throw new Error('Вопрос не найден в БД')
        }
        return nps_question
    }

    async create(data) {
        const {name, nps_chapter_id} = data
        console.log(data)
        const nps_question = await NpsQuestionMapping.create({name, nps_chapter_id})
        
        const created = await NpsQuestionMapping.findByPk(nps_question.id) 
        return created
    }

    async updateName(id, data) {
        const nps_question = await NpsQuestionMapping.findByPk(id)
        if (!nps_question) {
            throw new Error('Вопрос не найден в БД')
        }
        const {
            name = nps_question.name,
          
            
        } = data
        await nps_question.update({name})
        await nps_question.reload()
        return nps_question
    }

    async updateChapter(id, data) {
        const nps_question = await NpsQuestionMapping.findByPk(id)
        if (!nps_question) {
            throw new Error('Вопрос не найден в БД')
        }
        const {
            nps_chapter_id = nps_question.nps_chapter_id,
          
            
        } = data
        await nps_question.update({nps_chapter_id})
        await nps_question.reload()
        return nps_question
    }

    async delete(id) {
        const nps_question = await NpsQuestionMapping.findByPk(id)
        if (!nps_question) {
            throw new Error('Вопрос не найден в БД')
        }
        await nps_question.destroy()
        return nps_question
    }

}

export default new NpsQuestion()
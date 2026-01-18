import { NpsChapter as NpsChapterMapping } from "./mapping.js"


class NpsChapter {
    async getAll() {
        const nps_chapter = await NpsChapterMapping.findAll({
            
        })
        return nps_chapter
    }

    async getOne(id) {
        const nps_chapter = await NpsChapterMapping.findByPk(id)
        if (!nps_chapter) {
            throw new Error('Раздел не найден в БД')
        }
        return nps_chapter
    }

    async create(data) {
        const {name, number} = data
        const nps_chapter = await NpsChapterMapping.create({name, number})
        
        const created = await NpsChapterMapping.findByPk(nps_chapter.id) 
        return created
    }

    async updateName(id, data) {
        const nps_chapter = await NpsChapterMapping.findByPk(id)
        if (!nps_chapter) {
            throw new Error('Раздел не найден в БД')
        }
        const {
            name = nps_chapter.name,
          
            
        } = data
        await nps_chapter.update({name})
        await nps_chapter.reload()
        return nps_chapter
    }

    async updateNumber(id, data) {
        const nps_chapter = await NpsChapterMapping.findByPk(id)
        if (!nps_chapter) {
            throw new Error('Раздел не найден в БД')
        }
        const {
            number = nps_chapter.number,
            
        } = data
        await nps_chapter.update({number})
        await nps_chapter.reload()
        return nps_chapter
    }

    async delete(id) {
        const nps_chapter = await NpsChapterMapping.findByPk(id)
        if (!nps_chapter) {
            throw new Error('Раздел не найден в БД')
        }
        await nps_chapter.destroy()
        return nps_chapter
    }

}

export default new NpsChapter()
import { Complaint as ComplaintMapping } from "./mapping.js"
import { ComplaintImage as ComplaintImageMapping } from "./mapping.js"
import { ComplaintEstimate as ComplaintEstimateMapping } from "./mapping.js"
import { Project as ProjectMapping} from './mapping.js'
import { User as UserMapping} from './mapping.js'


class Complaint {
    async getAll() {
        const complaints = await ComplaintMapping.findAll({
            include: [
                {   
                    model: ProjectMapping,
                    attributes: ['number', 'name', 'regionId']
                },
                {   
                    model: ComplaintEstimateMapping,
                    attributes: ['brigadeId']
                }
               
            ],
            order: [['date', 'ASC']]
        })
        return complaints
    }

    async getOne(id) {
        const complaint = await ComplaintMapping.findByPk(id)

        const project = await ProjectMapping.findAll({
            where: {
              id: complaint.projectId
            }
          });
          const complaintProject = project.map(project => {
            return {
                number: project.number,
                name: project.name,
                regionId: project.regionId
            }
          }) 

          const user = await UserMapping.findAll({
            where: {
              project_id: complaint.projectId
            }
          });
          const complaintUser = user.map(user => {
            return {
                image: user.image,

            }
          })

          const images = await ComplaintImageMapping.findAll({
            where: {
              complaint_id: complaint.id
            }
          });
          const complaintImages = images.map(image => {
            return {
                image: image.image,
                id: image.id

            }
          })

        return {complaint, complaintProject, complaintUser, complaintImages}
    }

   

    async create(data) {
        const {date, note, projectId} = data
        const complaint = await ComplaintMapping.create({date, note, projectId})
        
        const created = await ComplaintMapping.findByPk(complaint.id) 
        return created
    }


    async createDateFinish(id, data) {
        const complaint = await ComplaintMapping.findByPk(id)
        if (!complaint) {
            throw new Error('Рекламационная заявка не найдена в БД')
        }
        const {
            date_finish = complaint.date_finish,
        } = data
        await complaint.update({date_finish})
        await complaint.reload()
        return complaint
    }

    async deleteDateFinish(id) {
        const complaint = await ComplaintMapping.findByPk(id)
        if (!complaint) {
            throw new Error('Рекламационная заявка не найдена в БД')
        }
        await complaint.update({date_finish: null})
        await complaint.reload()
        return complaint
    }

    async updateNote(id, data) {
        const complaint = await ComplaintMapping.findByPk(id)
        if (!complaint) {
            throw new Error('Рекламационная заявка не найдена в БД')
        }
        const {
            note = complaint.note,
        } = data
        await complaint.update({note})
        await complaint.reload()
        return complaint
    }

  
    async delete(id) {
        const complaint = await ComplaintMapping.findByPk(id)
        if (!complaint) {
            throw new Error('Рекламационная заявка не найдена в БД')
        }
        await complaint.destroy()
        return complaint
    }

}

export default new Complaint()
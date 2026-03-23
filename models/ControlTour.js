import { ControlTour as ControlTourMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Set as SetMapping } from './mapping.js'
import { Complaint as ComplaintMapping } from './mapping.js'
import { Op} from 'sequelize'



class ControlTour {
    async getAll() {
        const control_tour = await ControlTourMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'regionId', 'id'],
                },
                
                {
                    model: ComplaintMapping,
                    attributes: ['id'],
                    include: [
                        {model: ProjectMapping,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: SetMapping,
                    attributes: ['name', 'number'],
                }
              ],
        })
        
          return control_tour;
    }

    
    async getOne(id) {
        const control_tour = await ControlTourMapping.findByPk(id)
        if (!control_tour) { 
            throw new Error('Контроль тур не найден в БД')
        }
        return control_tour
    } 



    async create(data) {
        const { projectId, complaintId, setId, regionId, warehouse } = data;
        const control_tour = await ControlTourMapping.create({projectId, complaintId, setId, regionId, warehouse});
        const created = await ControlTourMapping.findByPk(control_tour.id);
        return created;
    }



    async updateControlTour(id, data) {
        const control_tour = await ControlTourMapping.findByPk(id)
        if (!control_tour) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            projectId = control_tour.projectId,
            complaintId = control_tour.complaintId,
            warehouse = control_tour.warehouse,
        } = data
        await control_tour.update({projectId, complaintId, warehouse})
        await control_tour.reload()
        return control_tour
    }

    
    async delete(id) {
        const control_tour = await ControlTourMapping.findByPk(id);
        if (!control_tour) {
            throw new Error('Строка не найдена в БД');
        }
    
        await control_tour.destroy();
        return control_tour;
    }
 
}

export default new ControlTour()
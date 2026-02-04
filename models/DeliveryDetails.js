import { DeliverytDetails as DeliverytDetailsMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js'



class DeliveryDetails {
    async getAll() {
        const deliverydetails = await DeliverytDetailsMapping.findAll({
          include: [
            {
              model: ProjectMapping,
              attributes: ['number', 'name', 'finish'],
            },
          ],
        });
      
        const formattedData = deliverydetails.reduce((acc, item) => {
          const { projectId, detailId, delivery_quantity, project, id } = item;
          const existingProject = acc.find((project) => project.projectId === projectId);
          if (existingProject) {
            existingProject.props.push({id: id, detailId: detailId, delivery_quantity: delivery_quantity });
          } else {
            acc.push({
              project: {
                number: project.number,
                name: project.name,
                finish: project.finish,
              },
              projectId: projectId,
              props: [{ id:id, detailId: detailId, delivery_quantity: delivery_quantity }]
            });
          }
          return acc;
        }, []);
      
        return formattedData;
      }
      
      
    async getOne(id) {
        const deliverydetails = await DeliverytDetailsMapping.findByPk(id)
        if (!deliverydetails) { 
            throw new Error('Товар не найден в БД')
        }
        return deliverydetails
    } 

    // получние суммы количества отгруженной отдельной детали
    async getSumOneDeliveryDetail() {
        const deliverydetails = await DeliverytDetailsMapping.findAll()
        const result = deliverydetails.reduce((acc, item)=> {
            const {detailId, delivery_quantity} = item
            const deliverySum = acc.get(detailId) || 0;
            acc.set(detailId, deliverySum + delivery_quantity);
            return acc;
        }, new Map())

        const formattedResult = Array.from(result.entries()).map(([detailId, deliverySum]) => ({ detailId, deliverySum }));
        return [{ props: formattedResult }]
    }


    async create(data) {
        const { delivery_quantity, projectId, detailId } = data;
        const deliverydetails = await DeliverytDetailsMapping.create({ delivery_quantity, projectId, detailId });
        const created = await DeliverytDetailsMapping.findByPk(deliverydetails.id);
        return created;
    }


      async update(id, data) {
        const deliverydetails = await DeliverytDetailsMapping.findByPk(id)
        if (!deliverydetails) {
            throw new Error('Товар не найден в БД')
        }
        const {
            delivery_quantity = deliverydetails.delivery_quantity
        } = data
        await deliverydetails.update({delivery_quantity})
        await deliverydetails.reload()
        return deliverydetails
    }

    async delete(projectId) {
        const deliverydetails = await DeliverytDetailsMapping.findAll({ where: { projectId: projectId } });
        if (!deliverydetails || deliverydetails.length === 0) {
            throw new Error('Проект не найден');
        }
        for (const deliverydetail of deliverydetails) {
            await deliverydetail.destroy();
        }
    
        return deliverydetails;
    }

    async deleteOneDeliveryDetail(id) {
        const deliverydetails = await DeliverytDetailsMapping.findByPk(id)
        if (!deliverydetails) {
            throw new Error('Деталь не найдена в БД')
        }
        await deliverydetails.destroy()
        return deliverydetails
    }

}

export default new DeliveryDetails()
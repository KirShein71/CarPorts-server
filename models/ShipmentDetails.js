import { ShipmentDetails as ShipmentDetailsMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'



class ShipmentDetails {
    async getAll() {
        const shipmentdetails = await ShipmentDetailsMapping.findAll({
          include: [
            {
              model: ProjectMapping,
              attributes: ['number', 'name'],
              where: {
                date_finish: null
            }
            },
          ],
        });
      
        const formattedData = shipmentdetails.reduce((acc, item) => {
          const { projectId, detailId, shipment_quantity, shipment_date, project, id } = item;
          const existingProject = acc.find((project) => project.projectId === projectId);
          if (existingProject) {
            existingProject.props.push({id: id, detailId: detailId, shipment_quantity: shipment_quantity });
          } else {
            acc.push({
              project: {
                number: project.number,
                name: project.name,
              },
              shipment_date: shipment_date,
              projectId: projectId,
              props: [{ id:id, detailId: detailId, shipment_quantity: shipment_quantity }]
            });
          }
          return acc;
        }, []);
      
        return formattedData;
      }
      
      
    async getOne(id) {
        const shipmentdetails = await ShipmentDetailsMapping.findByPk(id)
        if (!shipmentdetails) { 
            throw new Error('Товар не найден в БД')
        }
        return shipmentdetails
    } 

    // получние суммы количества отгруженной отдельной детали
    async getSumOneShipmentDetail() {
        const shipmentdetails = await ShipmentDetailsMapping.findAll()
        const result = shipmentdetails.reduce((acc, item)=> {
            const {detailId, shipment_quantity} = item
            const shipmentSum = acc.get(detailId) || 0;
            acc.set(detailId, shipmentSum + shipment_quantity);
            return acc;
        }, new Map())

        const formattedResult = Array.from(result.entries()).map(([detailId, shipmentSum]) => ({ detailId, shipmentSum }));
        return [{ props: formattedResult }]
    }


    async create(data) {
        const { shipment_quantity, shipment_date, projectId, detailId } = data;
        const shipmentdetails = await ShipmentDetailsMapping.create({ shipment_quantity, shipment_date, projectId, detailId });
        const created = await ShipmentDetailsMapping.findByPk(shipmentdetails.id);
        return created;
    }


      async update(id, data) {
        const shipmentdetails = await ShipmentDetailsMapping.findByPk(id)
        if (!shipmentdetails) {
            throw new Error('Товар не найден в БД')
        }
        const {
            shipment_quantity = shipmentdetails.shipment_quantity
        } = data
        await shipmentdetails.update({shipment_quantity})
        await shipmentdetails.reload()
        return shipmentdetails
    }

    async delete(projectId) {
        const shipmentdetails = await ShipmentDetailsMapping.findAll({ where: { projectId: projectId } });
        if (!shipmentdetails || shipmentdetails.length === 0) {
            throw new Error('Проект не найден');
        }
        for (const shipmentdetail of shipmentdetails) {
            await shipmentdetail.destroy();
        }
    
        return shipmentdetails;
    }

}

export default new ShipmentDetails()
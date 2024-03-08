import { StockDetails as StockDetailsMapping } from "./mapping.js";
import { ShipmentDetails as ShipmentDetailsMapping } from "./mapping.js";
import { ProjectDetails as ProjectDetailsMapping } from "./mapping.js";
import { Project as ProjectMapping } from "./mapping.js";
import { Antypical as AntypicalMapping} from './mapping.js'

class RemainderDetails  {
// запрос детали на остатке
    async getAllRemainderOneDetail() {
        const stockdetails = await StockDetailsMapping.findAll();
        const shipmentdetails = await ShipmentDetailsMapping.findAll();
      
        const resultStock = stockdetails.reduce((acc, item) => {
          const { detailId, stock_quantity } = item;
          const stockSum = acc.get(detailId) || 0;
          acc.set(detailId, stockSum + stock_quantity);
          return acc;
        }, new Map());
      
        const resultShipment = shipmentdetails.reduce((acc, item) => {
          const { detailId, shipment_quantity } = item;
          const shipmentSum = acc.get(detailId) || 0;
          acc.set(detailId, shipmentSum + shipment_quantity);
          return acc;
        }, new Map());
      
        const formattedRemainderResult = Array.from(resultStock.entries()).map(([detailId, stockSum]) => {
          const shipmentSum = resultShipment.get(detailId) || 0;
          const remainderDifference = stockSum - shipmentSum;
          return { detailId, remainderDifference };
        });
      
        return [{ props: formattedRemainderResult }];
      }
// запрос детали перепроизводство
     async getOverproductionOneDetail() {
        const stockdetails = await StockDetailsMapping.findAll();
        const projectdetails = await ProjectDetailsMapping.findAll()

        const resultStock = stockdetails.reduce((acc, item) => {
            const { detailId, stock_quantity } = item;
            const stockSum = acc.get(detailId) || 0;
            acc.set(detailId, stockSum + stock_quantity);
            return acc;
          }, new Map());

          const resultProject = projectdetails.reduce((acc, item) => {
            const { detailId, quantity} = item;
            const projectSum = acc.get(detailId) || 0;
            acc.set(detailId, projectSum + quantity);
            return acc;
          }, new Map());

          const formattedOverproductionResult = Array.from(resultStock.entries()).map(([detailId, stockSum]) => {
            const projectSum = resultProject.get(detailId) || 0;
            const overproductionDifference = stockSum - projectSum;
            return { detailId, overproductionDifference}
          })
          return [{props: formattedOverproductionResult}]
      }

    //   к производству
    async getProduceOneDetail() {
        const stockdetails = await StockDetailsMapping.findAll();
        const projectdetails = await ProjectDetailsMapping.findAll();
    
        const resultStock = stockdetails.reduce((acc, item) => {
            const { detailId, stock_quantity } = item;
            const stockSum = acc.get(detailId) || 0;
            acc.set(detailId, stockSum + stock_quantity);
            return acc;
        }, new Map());
    
        const resultProject = projectdetails.reduce((acc, item) => {
            const { detailId, quantity} = item;
            const projectSum = acc.get(detailId) || 0;
            acc.set(detailId, projectSum + quantity);
            return acc;
        }, new Map());
    
        const formattedProduceResult = Array.from(resultStock.entries()).map(([detailId, stockSum]) => {
            const projectSum = resultProject.get(detailId) || 0;
            const produceDifference = stockSum === 0 ? projectSum : projectSum - stockSum;
            return { detailId, produceDifference };
        });
    
        // Add data for details that are not present in stockdetails but are in projectdetails
        projectdetails.forEach(item => {
            const { detailId } = item;
            if (!resultStock.has(detailId)) {
                const projectSum = resultProject.get(detailId) || 0;
                formattedProduceResult.push({ detailId, produceDifference: projectSum });
            }
        });
    
        return [{ props: formattedProduceResult }];
    }

// остаток отгрузки по каждой детале по каждому проекту
async getWaitShipmentProjectOneDetail() {
    const projectsdetails = await ProjectDetailsMapping.findAll({
      include: [
        {
          model: ProjectMapping,
          attributes: ['name', 'number']
        },
        {
          model: AntypicalMapping,
          attributes: ['image'],
        }
      ],
    });
    const shipmentdetails = await ShipmentDetailsMapping.findAll({
      include: [
        {
          model: ProjectMapping,
          attributes: ['name', 'number']
        },
      ],
    });
  
    const groupedAntypicals = projectsdetails.reduce((acc, item) => {
        const { projectId, antypical } = item;
        if (antypical && antypical.image) {
          if (!acc[projectId]) {
            acc[projectId] = [];
          }
          // Проверяем, что изображение не задублировано
          if (!acc[projectId].some(img => img.image === antypical.image)) {
            acc[projectId].push({ image: antypical.image });
          }
        }
        return acc;
    }, {});
  
    const arrResult = projectsdetails.reduce((acc, item) => {
      const { projectId, detailId, quantity, project } = item;
      const existingProject = acc.find((project) => project.projectId === projectId);
      if (existingProject) {
        if (!existingProject.antypical || existingProject.antypical.length === 0) {
            existingProject.antypical = groupedAntypicals[projectId] ? [...groupedAntypicals[projectId]] : [];
          }
        const existingDetail = existingProject.props.find((detail) => detail.detailId === detailId);
        if (existingDetail) {
          existingDetail.quantity = quantity;
        } else {
          existingProject.props.push({ detailId, quantity });
        }
      } else {
        acc.push({
          project: {
            name: project.name,
            number: project.number
          },
          projectId,
          antypical: groupedAntypicals[projectId] || [],
          props: [{ detailId, quantity }]
        });
      }
      return acc;
    }, shipmentdetails.reduce((acc, item) => {
      const { projectId, detailId, shipment_quantity, project } = item;
      const existingProject = acc.find((project) => project.projectId === projectId);
      if (existingProject) {
        const existingDetail = existingProject.props.find((detail) => detail.detailId === detailId);
        if (existingDetail) {
          existingDetail.shipment_quantity = shipment_quantity;
        } else {
          existingProject.props.push({ detailId, shipment_quantity });
        }
      } else {
        acc.push({
          project: {
            name: project.name,
            number: project.number
          },
          projectId,
          props: [{ detailId, shipment_quantity }]
        });
      }
      return acc;
    }, []));
  
    return arrResult.map(({ project, projectId, props, antypical }) => ({
      projectId,
      antypical,
      project,
      props: props.map(({ detailId, quantity, shipment_quantity }) => ({
        detailId,
        quantity,
        shipment_quantity,
        dif_quantity: quantity - shipment_quantity
      }))
    }));
  }
// общий остаток отгрузки по каждой детали
      async getWaitShipment() {
        const projectdetails = await ProjectDetailsMapping.findAll()
        const shipmentdetails = await ShipmentDetailsMapping.findAll() 

        const resultShipment = shipmentdetails.reduce((acc, item) => {
            const { detailId, shipment_quantity } = item;
            const shipmentSum = acc.get(detailId) || 0;
            acc.set(detailId, shipmentSum + shipment_quantity);
            return acc;
          }, new Map());

          const resultProject = projectdetails.reduce((acc, item) => {
            const { detailId, quantity} = item;
            const projectSum = acc.get(detailId) || 0;
            acc.set(detailId, projectSum + quantity);
            return acc;
          }, new Map());

          const formattedWaitShipmentResult = Array.from(resultShipment.entries()).map(([detailId, shipmentSum]) => {
            const projectSum = resultProject.get(detailId) || 0;
            const waitShipmentDifference = shipmentSum === 0 ? projectSum: projectSum - shipmentSum ;
            return { detailId, waitShipmentDifference}
          })

          projectdetails.forEach(item => {
            const { detailId } = item;
            if (!resultShipment.has(detailId)) {
                const projectSum = resultProject.get(detailId) || 0;
                formattedWaitShipmentResult.push({ detailId, waitShipmentDifference: projectSum });
            }
        });

          return [{props: formattedWaitShipmentResult}]
      }

}
export default new RemainderDetails()


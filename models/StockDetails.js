import { StockDetails as StockDetailsMapping } from './mapping.js'




class StockDetails {

    async getAll() {
        const stockdetails = await StockDetailsMapping.findAll({
            order: [
                ['stock_date', 'ASC'],
            ],
        })
        const formattedData = stockdetails.reduce((acc, item) => {
            const { stock_date, detailId, stock_quantity, id } = item;
            const existingProject = acc.find((el) => el.stock_date ===stock_date);
            if (existingProject) {
              existingProject.props.push({id: id, detailId: detailId, stock_quantity: stock_quantity });
            } else {
              acc.push({
                stock_date: stock_date,
                props: [{ id:id, detailId: detailId, stock_quantity: stock_quantity }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }

    async getOne(id) {
        const stockdetails = await StockDetailsMapping.findByPk(id)
        if (!stockdetails) { 
            throw new Error('Товар не найден в БД')
        }
        return stockdetails
    } 


    
    // получние суммы количества отдельной детали
    async getSumOneDetail() {
        const stockdetails = await StockDetailsMapping.findAll()
        const result = stockdetails.reduce((acc, item)=> {
            const {detailId, stock_quantity} = item
            const totalSum = acc.get(detailId) || 0;
            acc.set(detailId, totalSum + stock_quantity);
            return acc;
        }, new Map())

        const formattedResult = Array.from(result.entries()).map(([detailId, totalSum]) => ({ detailId, totalSum }));
        return [{ props: formattedResult }]
    }
  

    async create(data) {
        const { stock_quantity, detailId, stock_date } = data;
        const stockdetails = await StockDetailsMapping.create({ stock_quantity, detailId, stock_date });
        const created = await StockDetailsMapping.findByPk(stockdetails.id);
        return created;
    }


    async update(id, data) {
        const stockdetails = await StockDetailsMapping.findByPk(id)
        if (!stockdetails) {
            throw new Error('Товар не найден в БД')
        }
        const {
            stock_quantity = stockdetails.stock_quantity
        } = data
        await stockdetails.update({stock_quantity})
        await stockdetails.reload()
        return stockdetails
    }

  

}

export default new StockDetails()
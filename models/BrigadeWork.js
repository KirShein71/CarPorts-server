import { BrigadeWork as BrigadeWorkMapping } from "./mapping.js";

class BrigadeWork {

    async getAll() {
        const brigadework = await BrigadeWorkMapping.findAll()

        return brigadework
    }

    async getOne(id) {
        const brigadework = await BrigadeWorkMapping.findByPk(id)
        if (!brigadework) { 
            throw new Error('Товар не найден в БД')
        }
        return brigadework
    } 

    async getOneBrigadeWorkRegionId(id) {
        const brigadework = await BrigadeWorkMapping.findAll({
            where: {
                region_id: id
            }
        }
        )
        if (!brigadework) { 
            throw new Error('Товар не найден в БД')
        }
        return brigadework
    } 

    async create(data) {
        const { regionId, count } = data;
        const brigadework = await BrigadeWorkMapping.create({regionId, count  });
        const created = await BrigadeWorkMapping.findByPk(brigadework.id);
        return created;
    }

    async updateCount(id, data) {
        // Находим ВСЕ записи с указанным region_id (возвращается массив)
        const brigadeWorks = await BrigadeWorkMapping.findAll({
          where: {
            region_id: id
          }
        });
      
        // Если массив пустой - ошибка
        if (!brigadeWorks || brigadeWorks.length === 0) {
          throw new Error('Строки не найдены в БД');
        }
      
        // Берём ПЕРВУЮ запись (если нужно обновить все - см. вариант ниже)
        const brigadework = brigadeWorks[0];
        
        // Обновляем count (используем значение из data или текущее)
        const { count = brigadework.count } = data;
        
        // Обновляем конкретную запись
        await brigadework.update({ count });
        await brigadework.reload();
        
        return brigadework;
      }

}

export default new BrigadeWork;
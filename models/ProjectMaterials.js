import { ProjectMaterials as ProjectMaterialsMapping, Supplier } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Material as MaterialMapping} from './mapping.js'
import {Supplier as SupplierMapping} from './mapping.js'
import { Op } from 'sequelize'
import bot from '../TelegramBot.js'
import sequelize from "../sequelize.js";
import cron from 'node-cron';


class ProjectMaterials {
    async getAll() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date', 'design_period', 'id'],
                  where: {
                    finish: null
                }
                },
                 
                {
                  model: MaterialMapping,
                        attributes: ['name']}
                  
              ],

              order: [
                ['projectId', 'DESC']
              ]
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, date_payment, ready_date, shipping_date, check, color, project, id } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            if (existingProject) {
              existingProject.props.push({ id: id, materialId: materialId, materialName: materialName, date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check, color: color });
            } else {
              acc.push({
                id: project.id,
                name: project.name,
                number: project.number,
                expiration_date: project.expiration_date,
                agreement_date: project.agreement_date,
                design_period: project.design_period,
                projectId: projectId,
                props: [{ id:id, materialId: materialId, materialName: materialName, date_payment: date_payment,  ready_date: ready_date, shipping_date: shipping_date, check: check, color: color }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }

    async getAllMaterialProject() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date', 'design_period', 'id'],
                  where: {
                    finish: null
                }
                },
                 
                {
                  model: MaterialMapping,
                        attributes: ['name']}
                  
              ],

              order: [
                ['materialId', 'DESC']
              ]
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { materialId, materialName, date_payment, ready_date, shipping_date, check, color, project, id } = item;
            const existingProject = acc.find((material) => material.materialId === materialId);
            if (existingProject) {
              existingProject.props.push({ id: id, name: project.name, number: project.number, expiration_date: project.expiration_date, agreement_date: project.agreement_date, design_period: project.design_period,  date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check, color: color });
            } else {
              acc.push({
                materialId: materialId,
                materialName: materialName,
                props: [{ id:id, name: project.name, number: project.number, expiration_date: project.expiration_date, agreement_date: project.agreement_date, design_period: project.design_period, date_payment: date_payment,  ready_date: ready_date, shipping_date: shipping_date, check: check, color: color }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }

    async getAllProjectMaterialForLogistic() {
        // Получаем текущую дату и устанавливаем время на 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Создаем диапазон дат (вчера, сегодня, +2 дня)
        const dateRange = {
            start: new Date(today),
            end: new Date(today)
        };
        dateRange.start.setDate(dateRange.start.getDate() - 1); // Вчера
        dateRange.end.setDate(dateRange.end.getDate() + 2);     // +2 дня от сегодня
        
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number', 'id', 'regionId'],
                    where: {
                        finish: null
                    }
                },
            ],
            where: {
                [Op.and]: [
                    { 
                        shipping_date: {
                            [Op.ne]: null,
                            [Op.between]: [dateRange.start, dateRange.end]
                        }
                    },
                    {
                        supplierId: {
                            [Op.and]: [
                                { [Op.ne]: 0 },
                                { [Op.ne]: null }
                            ]
                        }
                    }
                ]
            }
        });
    
        // Создаем структуру для группировки: проект -> дата -> материалы
        const groupedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, shipping_date, check, weight, dimensions, project, id } = item;
            
            // Проверяем, что дата отгрузки попадает в нужный диапазон
            const shippingDate = new Date(shipping_date);
            shippingDate.setHours(0, 0, 0, 0); // Нормализуем дату
            
            if (shippingDate >= dateRange.start && shippingDate <= dateRange.end) {
                const dateStr = shippingDate.toISOString().split('T')[0]; // Формат YYYY-MM-DD
                
                // Находим или создаем проект
                let projectEntry = acc.find(p => p.projectId === projectId);
                if (!projectEntry) {
                    projectEntry = {
                        id: project.id,
                        name: project.name,
                        number: project.number,
                        regionId: project.regionId,
                        projectId: projectId,
                        dates: {} // Объект для хранения данных по датам
                    };
                    acc.push(projectEntry);
                }
                
                // Находим или создаем запись для даты
                if (!projectEntry.dates[dateStr]) {
                    projectEntry.dates[dateStr] = {
                        date: dateStr,
                        displayDate: this.getDisplayDate(shippingDate),
                        props: []
                    };
                }
                
                // Добавляем материал
                projectEntry.dates[dateStr].props.push({ 
                    id: id, 
                    materialId: materialId, 
                    materialName: materialName, 
                    shipping_date: shipping_date,
                    check: check,
                    weight: weight,
                    dimensions: dimensions,
                    projectId: projectId
                   

                });
            }
            return acc;
        }, []);
        
        // Преобразуем объект dates в массив и сортируем даты в нужном порядке
        const formattedData = groupedData.map(project => {
            // Преобразуем объект dates в массив
            const datesArray = Object.values(project.dates);
            
            // Сортируем даты в порядке: сегодня+2, сегодня+1, сегодня, вчера
            datesArray.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA; // Сортировка от новых к старым
            });
            
            return {
                ...project,
                dates: datesArray
            };
        });
        
        return formattedData;
    }

    async getAllMaterialProjectForLogistic() {
        // Получаем текущую дату и устанавливаем время на 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Создаем диапазон дат (вчера, сегодня, +2 дня)
        const dateRange = {
            start: new Date(today),
            end: new Date(today)
        };
        dateRange.start.setDate(dateRange.start.getDate() - 1); // Вчера
        dateRange.end.setDate(dateRange.end.getDate() + 2);     // +2 дня от сегодня
        
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number', 'id', 'regionId'],
                    where: {
                        finish: null
                    }
                },
            ],
            where: {
                [Op.and]: [
                    { 
                        shipping_date: {
                            [Op.ne]: null,
                            [Op.between]: [dateRange.start, dateRange.end]
                        }
                    },
                    {
                        supplierId: {
                            [Op.and]: [
                                { [Op.ne]: 0 },
                                { [Op.ne]: null }
                            ]
                        }
                    }
                ]
            }
        });

   
 
        // Создаем структуру для группировки: проект -> дата -> материалы
        const groupedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, shipping_date, check, weight, dimensions, project, id } = item;
            
            // Проверяем, что дата отгрузки попадает в нужный диапазон
            const shippingDate = new Date(shipping_date);
            shippingDate.setHours(0, 0, 0, 0); // Нормализуем дату
            
            if (shippingDate >= dateRange.start && shippingDate <= dateRange.end) {
                const dateStr = shippingDate.toISOString().split('T')[0]; // Формат YYYY-MM-DD
                
                // Находим или создаем проект
                let materialEntry = acc.find(p => p.materialId === materialId);
                if (!materialEntry) {
                    materialEntry = {
                        materialId: materialId, 
                        materialName: materialName,
                        dates: {} // Объект для хранения данных по датам
                    };
                    acc.push(materialEntry);
                }
                
                // Находим или создаем запись для даты
                if (!materialEntry.dates[dateStr]) {
                    materialEntry.dates[dateStr] = {
                        date: dateStr,
                        displayDate: this.getDisplayDate(shippingDate),
                        props: []
                    };
                }
                
                // Добавляем материал
                materialEntry.dates[dateStr].props.push({ 
                    id: id, 
                    name: project.name,
                    number: project.number,
                    regionId: project.regionId,
                    projectId: projectId,
                    shipping_date: shipping_date,
                    check: check,
                    weight: weight,
                    dimensions: dimensions,
                    
                });
            }
            return acc;
        }, []);
        
        // Преобразуем объект dates в массив и сортируем даты в нужном порядке
        const formattedData = groupedData.map(project => {
            // Преобразуем объект dates в массив
            const datesArray = Object.values(project.dates);
            
            // Сортируем даты в порядке: сегодня+2, сегодня+1, сегодня, вчера
            datesArray.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA; // Сортировка от новых к старым
            });
            
            return {
                ...project,
                dates: datesArray
            };
        });
        
        return formattedData;
    }
    //запрос на забор материалов у поставщиков
    async getPickupMaterialsForLogistic(date, selectedIds = []) { 
        const projectmaterials = await ProjectMaterialsMapping.findAll({
          where: {
            [Op.and]: [
              { 
                shipping_date: date
              },
              {
                supplierId: {
                  [Op.and]: [
                    { [Op.ne]: 0 },
                    { [Op.ne]: null }
                  ]
                }
              },
              {
                id: {
                  [Op.in]: selectedIds // Добавляем фильтр по выбранным ID
                }
              }
            ]
          },
          include: [
            {
              model: SupplierMapping
            },
            {
              model: ProjectMapping, 
              attributes: ['id','name', 'regionId', 'contact', 'address', 'navigator', 'coordinates']
            }
          ]
        });
    
        if (!projectmaterials || projectmaterials.length === 0) { 
            throw new Error('Товар не найден в БД');
        }
    
        const formattedData = projectmaterials.reduce((acc, item) => {
            const { supplierId, materialId, materialName, id, supplier, project, weight, dimensions } = item;
            const existingSupplier = acc.find((supplier) => supplier.supplierId === supplierId);
            
            if (existingSupplier) {
                existingSupplier.props.push({ id: id, materialId: materialId, materialName: materialName });
                existingSupplier.projects.push({id: project.id, name: project.name, region: project.regionId, contact: project.contact, address: project.address, navigator: project.navigator, coordinates: project.coordinates, materialName: materialName });
                existingSupplier.weight += weight; // Суммируем вес
                existingSupplier.dimensions = Math.max(existingSupplier.dimensions, dimensions); // Находим максимальное значение размеров
            } else {
                acc.push({
                    id: supplier.id,
                    name: supplier.name,
                    contact: supplier.contact,
                    address: supplier.address,
                    shipment: supplier.shipment,
                    note: supplier.note,
                    navigator: supplier.navigator,
                    coordinates: supplier.coordinates,
                    supplierId: supplierId, 
                    weight: weight, // Инициализируем вес
                    dimensions: dimensions, // Инициализируем размеры
                    props: [{ id: id, materialId: materialId, materialName: materialName }],
                    projects: [{ id: project.id, name: project.name, region: project.regionId, contact: project.contact, address: project.address, navigator: project.navigator, coordinates: project.coordinates, materialName: materialName }]
                });
            }
            return acc;
        }, []);
        
        return formattedData;
    }
    //запрос на выгрузку материалов на проекте (заказчиков)
    async getUnloadingForProject( selectedIds = []) { 
        const projects = await ProjectMapping.findAll({
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.in]: selectedIds // Добавляем фильтр по выбранным ID
                }
              },
              
            ]
          },
          attributes: ['id', 'name', 'contact', 'regionId', 'address', 'navigator', 'coordinates'],
        });
    
        if (!projects || projects.length === 0) { 
            throw new Error('Товар не найден в БД');
        }
        
        return projects;
    }



    // Вспомогательная функция для получения отображаемого названия даты
    getDisplayDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        
        switch(diffDays) {
            case 0: return 'Сегодня';
            case 1: return 'Завтра';
            case 2: return 'Послезавтра';
            case -1: return 'Вчера';
            default: return date.toLocaleDateString('ru-RU');
        }
    }
    
    async getOne(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) { 
            throw new Error('Товар не найден в БД')
        }
        return projectmaterials
    } 

    async create(data) {

        const { date_payment, expirationMaterial_date, ready_date, shipping_date, check, color, projectId, materialId, materialName, supplierId } = data;
       
        const projectmaterials = await ProjectMaterialsMapping.create({ date_payment, expirationMaterial_date, ready_date, shipping_date, check, color, projectId, materialId, materialName, supplierId });
        const created = await ProjectMaterialsMapping.findByPk(projectmaterials.id);
        return created;
    }

    async updateMaterialIdInOrderMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            materialId = projectmaterials.materialId,
            supplierId = projectmaterials.supplierId,
            materialName = projectmaterials.materialName
        } = data
        await projectmaterials.update({materialId, supplierId, materialName})
        await projectmaterials.reload()
        return projectmaterials
    }

   

      async createCheckProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            check = projectmaterials.check
        } = data
        await projectmaterials.update({check})
        await projectmaterials.reload()
        return projectmaterials
    }

    async deleteCheckProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ check: null });
        return projectmaterials;
    }
    


    async createReadyDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            ready_date = projectmaterials.ready_date
        } = data
        await projectmaterials.update({ready_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async deleteReadyDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ ready_date: null });
        return projectmaterials;
    }

   constructor() {
        this.notificationTimers = new Map(); // Инициализация хранилища таймеров
        this.initCronJobs(); // Автоматически инициализируем cron задачи
    }

    async createShippingDateProjectMaterials(id, data) {
        try {
            const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
            if (!projectmaterials) {
                throw new Error('Товар не найден в БД');
            }

            const oldShippingDate = projectmaterials.shipping_date;
            const { shipping_date = projectmaterials.shipping_date } = data;

            // Обновляем дату отгрузки
            await projectmaterials.update({ shipping_date, notification_sent: false });
            await projectmaterials.reload();

            // Планируем уведомление на дату отгрузки
            if (shipping_date) {
                await this.scheduleShippingNotification(
                    projectmaterials.projectId, 
                    projectmaterials.materialName, 
                    shipping_date,
                    projectmaterials.id
                );
            }

            return projectmaterials;
        } catch (error) {
            console.error('Ошибка при обновлении даты отгрузки:', error);
            throw error;
        }
    }

    async scheduleShippingNotification(projectId, materialName, shippingDate, materialId) {
        try {
            // Отменяем предыдущее планирование
            await this.cancelScheduledNotification(materialId);
            
            const notificationTime = new Date(shippingDate).getTime() - Date.now();
            
            if (notificationTime > 0) {
                const timer = setTimeout(async () => {
                    try {
                        await this.notifyShippingDateChange(projectId, materialName);
                        await ProjectMaterialsMapping.update(
                            { notification_sent: true },
                            { where: { id: materialId } }
                        );
                        this.notificationTimers.delete(materialId);
                    } catch (error) {
                        console.error('Ошибка при отправке уведомления:', error);
                    }
                }, notificationTime);
                
                this.notificationTimers.set(materialId, timer);
                console.log(`Уведомление запланировано на ${shippingDate}`);
            } else {
                console.log(`Дата ${shippingDate} уже прошла, уведомление не планируется`);
            }
        } catch (error) {
            console.error('Ошибка планирования уведомления:', error);
        }
    }

    async cancelScheduledNotification(materialId) {
        if (this.notificationTimers.has(materialId)) {
            clearTimeout(this.notificationTimers.get(materialId));
            this.notificationTimers.delete(materialId);
        }
    }

    async notifyShippingDateChange(projectId, materialName) {
        try {
            const users = await sequelize.query(`
                SELECT DISTINCT u.telegram_chat_id 
                FROM users u
                JOIN projects p ON u.project_id = p.id
                WHERE p.id = :projectId
                AND u.telegram_chat_id IS NOT NULL
                AND u.telegram_chat_id != ''
            `, {
                replacements: { projectId },
                type: sequelize.QueryTypes.SELECT
            });

            if (users.length > 0) {
                const message = `🚚 Материал "${materialName}" отгружен сегодня!`;
                
                for (const user of users) {
                    try {
                        await bot.telegram.sendMessage(user.telegram_chat_id, message);
                        console.log(`Уведомление отправлено пользователю ${user.telegram_chat_id}`);
                    } catch (error) {
                        console.error(`Ошибка отправки пользователю ${user.telegram_chat_id}:`, error);
                    }
                }
            } else {
                console.log(`Не найдено пользователей для проекта ${projectId}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомлений:', error);
        }
    }

    async initCronJobs() {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('Запуск ежедневной проверки дат отгрузки...', new Date().toISOString());
            
            // Используем начало и конец дня для сравнения
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            
            const materialsToShip = await ProjectMaterialsMapping.findAll({
                where: {
                    shipping_date: {
                        [Op.between]: [todayStart, todayEnd]
                    },
                    notification_sent: false
                }
            });
            
            console.log(`Найдено материалов для отгрузки сегодня: ${materialsToShip.length}`);
            
            for (const material of materialsToShip) {
                try {
                    await this.notifyShippingDateChange(
                        material.projectId, 
                        material.materialName
                    );
                    await material.update({ notification_sent: true });
                    console.log(`Уведомление отправлено для материала: ${material.materialName}`);
                } catch (error) {
                    console.error(`Ошибка при обработке материала ${material.id}:`, error);
                }
            }
        } catch (error) {
            console.error('Ошибка в cron-задаче:', error);
        }
    });
    
    // Дополнительная проверка при старте сервера
    this.checkMissedNotifications();
    
    console.log('Cron задачи инициализированы');
}

async checkMissedNotifications() {
    try {
        console.log('Проверка пропущенных уведомлений...');
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        const missedMaterials = await ProjectMaterialsMapping.findAll({
            where: {
                shipping_date: {
                    [Op.lt]: new Date() // Все прошедшие даты
                },
                notification_sent: false
            }
        });
        
        console.log(`Найдено пропущенных уведомлений: ${missedMaterials.length}`);
        
        for (const material of missedMaterials) {
            try {
                await this.notifyShippingDateChange(
                    material.projectId, 
                    material.materialName
                );
                await material.update({ notification_sent: true });
                console.log(`Отправлено пропущенное уведомление для: ${material.materialName}`);
            } catch (error) {
                console.error(`Ошибка при обработке пропущенного материала ${material.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Ошибка при проверке пропущенных уведомлений:', error);
    }
}




    async deleteShippingDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ shipping_date: null });
        return projectmaterials;
    }

    async createPaymentDateProjectMaterials(id, data) {
        try {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД');
        }

        const oldPaymentDate = projectmaterials.date_payment;
        const { date_payment = projectmaterials.date_payment } = data;

        // Обновляем дату отгрузки
        await projectmaterials.update({ date_payment });
        await projectmaterials.reload();

        // Если дата изменилась - отправляем уведомление
        if (oldPaymentDate !== date_payment) {
            await this.notifyPaymentDateChange(projectmaterials.projectId, projectmaterials.materialName, date_payment);
            
        }

        return projectmaterials;
        } catch (error) {
            console.error('Ошибка при обновлении даты отгрузки:', error);
            throw error;
        }
    }

    async notifyPaymentDateChange(projectId, materialName) {
    
    try {
        // Находим всех пользователей, связанных с этим проектом
        const users = await sequelize.query(`
            SELECT u.telegram_chat_id 
            FROM users u
            WHERE u.project_id = :projectId
            AND u.telegram_chat_id IS NOT NULL
        `, {
            replacements: { projectId },
            type: sequelize.QueryTypes.SELECT
        });

        if (users.length > 0) {
        
            const message = `📅 Материал ${materialName} заказан`;

            // Отправляем сообщение каждому пользователю
            for (const user of users) {
                try {
                    await bot.telegram.sendMessage(user.telegram_chat_id, message);
                    console.log(`Уведомление отправлено пользователю ${user.telegram_chat_id}`);
                } catch (error) {
                    console.error(`Ошибка при отправке уведомления пользователю ${user.telegram_chat_id}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Ошибка при отправке уведомлений:', error);
    }
}


    async deletePaymentDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ date_payment: null });
        return projectmaterials;
    }

    async createColorProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            color = projectmaterials.color
        } = data
        await projectmaterials.update({color})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createExpirationMaterialDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            expirationMaterial_date = projectmaterials.expirationMaterial_date
        } = data
        await projectmaterials.update({expirationMaterial_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createWeightMaterial(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            weight = projectmaterials.weight
        } = data
        await projectmaterials.update({weight})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createDimensionsMaterial(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            dimensions = projectmaterials.dimensions
        } = data
        await projectmaterials.update({dimensions})
        await projectmaterials.reload()
        return projectmaterials
    }

    async delete(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
    
        await projectmaterials.destroy();
        return projectmaterials;
    }

}

export default new ProjectMaterials()





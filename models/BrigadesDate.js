import {BrigadesDate as BrigadesDateMapping} from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Brigade as BrigadeMapping } from './mapping.js'
import { Date as DateMapping} from './mapping.js'
import { Estimate as EstimateMapping } from './mapping.js'
import { BrigadeWork as BrigadeWorkMapping} from './mapping.js'
import { Complaint as ComplaintMapping } from './mapping.js'
import { ComplaintEstimate as ComplaintEstimateMapping } from './mapping.js'
import { Op} from 'sequelize'


class BrigadesDate {
    async getAll() {
        const brigadesdate = await BrigadesDateMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'regionId'],
                },
                {
                    model: BrigadeMapping,
                    attributes: ['name', 'regionId', 'active']
                },
                {
                    model: DateMapping,
                    attributes: ['date']
                },
                {
                    model: ComplaintMapping,
                    attributes: ['id'],
                    include: [
                        {model: ProjectMapping,
                            attributes: ['name']
                        }
                    ]
                }
              ],
        })
        
          return brigadesdate;
    }


    async getDaysInstallerForProjects() {
        const brigadesdate = await BrigadesDateMapping.findAll();
        const daysMapping = await DateMapping.findAll(); // Получаем все даты из DaysMapping
    
        // Создаем объект для хранения дат по их идентификаторам
        const dateMap = {};
        daysMapping.forEach(dateRecord => {
            const { id, date } = dateRecord; // Предполагаем, что у вас есть поля id и date
            dateMap[id] = new Date(date); // Преобразуем дату в объект Date для удобства
        });
    
        // Создаем объект для хранения результатов
        const result = {};
    
        // Получаем текущую дату и завтрашнюю дату
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Убираем время, чтобы сравнивать только даты
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Завтрашняя дата
    
        // Проходим по всем записям
        brigadesdate.forEach(record => {
            const { projectId, dateId } = record;
    
            // Если проект уже есть в результате, добавляем date_id
            if (!result[projectId]) {
                result[projectId] = {
                    projectId: Number(projectId),
                    factDays: new Set(), // Используем Set для уникальных фактических дней
                    planDays: new Set(), // Используем Set для уникальных планируемых дней
                };
            }
    
            const date = dateMap[dateId];
    
            // Проверяем, сколько уникальных дней до сегодняшнего дня (factDay)
            if (date < today) {
                result[projectId].factDays.add(date.toISOString().split('T')[0]); // Добавляем только уникальные даты
            }
    
            // Проверяем, сколько уникальных дней с завтрашнего дня (planDay)
            if (date >= tomorrow) {
                result[projectId].planDays.add(date.toISOString().split('T')[0]); // Добавляем только уникальные даты
            }
        });
    
        // Преобразуем результат в массив с подсчетом уникальных дней
        const formattedResult = Object.values(result).map(({ projectId, factDays, planDays }) => ({
            projectId,
            factDay: factDays.size, // Количество уникальных фактических дней
            planDay: planDays.size, // Количество уникальных планируемых дней
        }));
    
        return formattedResult;
    }

    async getAllForOneBrigade(brigadeId) {
        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                brigade_id: brigadeId
            },
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name'], 
                    include: {
                        model: EstimateMapping, attributes: ['price', 'done']
                    }
                },
                {
                    model: ComplaintMapping,
                    include: {
                        model: ComplaintEstimateMapping, attributes: ['price', 'done']
                    }
                },
                {
                    model: DateMapping,
                    attributes: ['date']
                }
              ],
        })
        
          return brigadesdate;
    }

    async getAllCertainDays() {
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 1);
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);
    
        const brigadesdate = await BrigadesDateMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name'],
                },
                {
                    model: BrigadeMapping,
                    attributes: ['name']
                },
                {
                    model: DateMapping,
                    attributes: ['date'],
                    where: {
                        date: {
                            [Op.between]: [threeDaysAgo, threeDaysLater]
                        }
                    }
                },
                {
                    model: ComplaintMapping,
                    attributes: ['id'],
                    include: [
                        {model: ProjectMapping,
                            attributes: ['name']
                        }
                    ]
                }
            ],
        });
    
        return brigadesdate;
    }
    
    async getOne(id) {
        const brigadesdate = await BrigadesDateMapping.findByPk(id)
        if (!brigadesdate) { 
            throw new Error('Товар не найден в БД')
        }
        return brigadesdate
    } 



    async create(data) {
        const {  projectId, complaintId, brigadeId, dateId, regionId, weekend, warranty, downtime } = data;
        const brigadesdate = await BrigadesDateMapping.create({projectId, complaintId, brigadeId, dateId, regionId, weekend, warranty, downtime  });
        const created = await BrigadesDateMapping.findByPk(brigadesdate.id);
        return created;
    }



    async updateBrigadesDate(id, data) {
        const brigadesdate = await BrigadesDateMapping.findByPk(id)
        if (!brigadesdate) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            projectId = brigadesdate.projectId,
            complaintId = brigadesdate.complaintId,
            weekend = brigadesdate.weekend,
            warranty = brigadesdate.warranty,
            downtime = brigadesdate.downtime
        } = data
        await brigadesdate.update({projectId, complaintId, weekend, warranty, downtime})
        await brigadesdate.reload()
        return brigadesdate
    }

    async refreshDataBrigadesDate(id) {
        const brigadesdate = await BrigadesDateMapping.findByPk(id)
        if (!brigadesdate) {
            throw new Error('Проект не найден в БД')
        }
        await brigadesdate.update({projectId: 0, complaintId: 0, weekend: '', warranty: '', downtime: ''})
        await brigadesdate.reload()
        return brigadesdate
    } 

    async delete(id) {
        const brigadesdate = await BrigadesDateMapping.findByPk(id);
        if (!brigadesdate) {
            throw new Error('Строка не найдена в БД');
        }
    
        await brigadesdate.destroy();
        return brigadesdate;
    }

    async getAllDate() {
        const date = await DateMapping.findAll({
            order: [['id', 'ASC']]
        })
          return date;
    }

    async getAllNumberOfDaysBrigade(brigadeId, projectId) {
        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                brigade_id: brigadeId,
                project_id: projectId
            }
        })

        if(!brigadesdate) {
            throw new Error('Не проставлены дни в календарь')
        }

        const days = brigadesdate.length

        return days
    }

    async getAllNumberOfDaysBrigadeForRegion() {
        const brigadesdate = await BrigadesDateMapping.findAll()

        if(!brigadesdate) {
            throw new Error('Не проставлены дни в календарь')
        }

        const spbRegion = brigadesdate.filter((spbNum) => spbNum.regionId === 1 && spbNum.projectId !== null)
        const mskRegion = brigadesdate.filter((mskNum) => mskNum.regionId === 2 && mskNum.projectId !== null)

        const project = await ProjectMapping.findAll();
   
        const spbProjects = project.filter(region => region.regionId === 1 && region.finish === null);
        const mskProjects = project.filter(region => region.regionId === 2 && region.finish === null);
       
        const sumSpb = spbProjects.reduce((total, spbNum) => {
            return total + (spbNum.installation_billing || 0); 
        }, 0);
    

        const sumMsk = mskProjects.reduce((total, mskNum) => {
            return total + (mskNum.installation_billing || 0); 
        }, 0);

        // Рассчет последнего дедлайна по каждому региону
        const holidays = [
            '2024-01-01',
            '2024-01-02',
            '2024-01-03',
            '2024-01-04',
            '2024-01-05',
            '2024-01-08',
            '2024-02-23',
            '2024-03-08',
            '2024-04-29',
            '2024-04-30',
            '2024-05-01',
            '2024-05-09',
            '2024-05-10',
            '2024-06-12',
            '2024-11-04',
            '2025-01-01',
            '2025-01-02',
            '2025-01-03',
            '2025-01-06',
            '2025-01-07',
            '2025-01-08',
            '2025-05-01',
            '2025-05-02',
            '2025-05-08',
            '2025-05-09',
            '2025-06-12',
            '2025-06-13',
            '2025-11-03',
            '2025-11-04',
        ].map((date) => new Date(date));
    
        // Функция для проверки, является ли дата выходным или праздничным днем
        function isWorkingDay(date) {
            const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
            const isHoliday = holidays.some((holiday) => {
                const holidayString = holiday.toDateString();
                const dateString = date.toDateString();
                return holidayString === dateString;
            });
    
            return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday; // Не выходной и не праздник
        }
    
        // Функция для добавления рабочих дней к дате
        function addWorkingDays(startDate, daysToAdd) {
            let currentDate = new Date(startDate);
            let addedDays = 0;
    
            while (addedDays < daysToAdd) {
                currentDate.setDate(currentDate.getDate() + 1); // Переходим на следующий день
                if (isWorkingDay(currentDate)) {
                    addedDays++;
                }
            }
    
            return currentDate;
        }
    
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
            const year = date.getFullYear();
    
            return `${day}.${month}.${year}`; 
        }
    
        const spbDeadlines = [];
        const mskDeadlines = []
        // Проектирование
        // Обработка проектов для СПБ
        spbProjects.forEach((spbProject) => {
            const endDate = addWorkingDays(spbProject.agreement_date, spbProject.design_period);
            const formattedEndDate = formatDate(endDate);
            spbDeadlines.push(formattedEndDate);
        });
    
        // Обработка проектов для Москвы
        mskProjects.forEach((mskProject) => {
            const endDate = addWorkingDays(mskProject.agreement_date, mskProject.design_period);
            const formattedEndDate = formatDate(endDate);
            mskDeadlines.push(formattedEndDate);
        });

        // Производство
        // Обработка проектов для СПБ
        spbProjects.forEach((spbProject) => {
            const sumDays = spbProject.design_period + spbProject.expiration_date;
            const endDate = addWorkingDays(spbProject.agreement_date, sumDays);
            const formattedEndDate = formatDate(endDate);
            spbDeadlines.push(formattedEndDate);
        });
    
        // Обработка проектов для Москвы
        spbProjects.forEach((mskProject) => {
            const sumDays = mskProject.design_period + mskProject.expiration_date;
            const endDate = addWorkingDays(mskProject.agreement_date, sumDays);
            const formattedEndDate = formatDate(endDate);
            mskDeadlines.push(formattedEndDate);
        });

         // Монтаж
        // Обработка проектов для СПБ
        spbProjects.forEach((spbProject) => {
            const sumDays = spbProject.design_period + spbProject.expiration_date + spbProject.installation_period;
            const endDate = addWorkingDays(spbProject.agreement_date, sumDays);
            const formattedEndDate = formatDate(endDate);
            spbDeadlines.push(formattedEndDate);
        });
    
        // Обработка проектов для Москвы
        mskProjects.forEach((mskProject) => {
            const sumDays = mskProject.design_period + mskProject.expiration_date + mskProject.installation_period;
            const endDate = addWorkingDays(mskProject.agreement_date, sumDays);
            const formattedEndDate = formatDate(endDate);
            mskDeadlines.push(formattedEndDate);
        });

        const sortedDeadlinesSpb = spbDeadlines.sort((a, b) => {
            const dateA = new Date(a.split('.').reverse().join('-')); 
            const dateB = new Date(b.split('.').reverse().join('-'));
            return dateB - dateA; // Сравнение дат
          });
          
          // Получение самой ранней даты
        const deadlineDateSpb = sortedDeadlinesSpb[0];

        const sortedDeadlinesMsk = mskDeadlines.sort((a, b) => {
            const dateA = new Date(a.split('.').reverse().join('-')); 
            const dateB = new Date(b.split('.').reverse().join('-'));
            return dateB - dateA; // Сравнение дат
          });
          
          // Получение самой ранней даты
        const deadlineDateMsk = sortedDeadlinesMsk[0];

        return [{regionId: 1, workingDay: spbRegion.length, billingDay: sumSpb, deadline: deadlineDateSpb }, {regionId: 2, workingDay: mskRegion.length, billingDay: sumMsk, deadline: deadlineDateMsk}]
    }

    async getDataInstallerWorksForRegion() {
        const brigadesdate = await BrigadesDateMapping.findAll()

        const spbWorks = brigadesdate.filter(region => region.regionId === 1 && region.projectId !== null)
        const mskWorks = brigadesdate.filter(region => region.regionId === 2 && region.projectId !== null)

        const projects = await ProjectMapping.findAll();
   
        const spbProject = projects.filter(region => region.regionId === 1 && region.finish === null);
        const mskProject = projects.filter(region => region.regionId === 2 && region.finish === null);

        const filteredSpbWorks = spbWorks.filter(work => 
            spbProject.some(project => project.id === work.projectId)
        );
        
      
        const filteredMskWorks = mskWorks.filter(work => 
            mskProject.some(project => project.id === work.projectId)
        );

        const uniqueSpbKeys = new Set();
        const uniqueMskKeys = new Set();
        
        // Фильтруем filteredSpbWorks, удаляя дубликаты
        const uniqueFilteredSpbWorks = filteredSpbWorks.filter(work => {
            const key = `${work.projectId}-${work.dateId}`; // Создаем уникальный ключ
            if (uniqueSpbKeys.has(key)) {
                return false; // Если ключ уже существует, пропускаем элемент
            }
            uniqueSpbKeys.add(key); // Добавляем ключ в множество
            return true; // В противном случае включаем элемент
        });
        
        // Фильтруем filteredMskWorks, удаляя дубликаты
        const uniqueFilteredMskWorks = filteredMskWorks.filter(work => {
            const key = `${work.projectId}-${work.dateId}`; // Создаем уникальный ключ
            if (uniqueMskKeys.has(key)) {
                return false; // Если ключ уже существует, пропускаем элемент
            }
            uniqueMskKeys.add(key); // Добавляем ключ в множество
            return true; // В противном случае включаем элемент
        });

        const dates = await DateMapping.findAll()

        const dateMap = new Map(dates.map(mapping => [mapping.id, mapping.date]));

        // Функция для замены dateId на date
        const replaceDateIdsWithDates = (works) => {
            return works.map(work => {
                return {
                    ...work,
                    date: dateMap.get(work.dateId) || work.dateId // Если dateId не найден, оставляем его как есть
                };
            });
        };

        const updatedUniqueSpbWorks = replaceDateIdsWithDates(uniqueFilteredSpbWorks);
        const updatedUniqueMskWorks = replaceDateIdsWithDates(uniqueFilteredMskWorks);

        // Получаем сегодняшнюю дату
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Устанавливаем время на начало дня для корректного сравнения

        // Функция для подсчета объектов с датой до сегодня включительно
        const countWorksUpToToday = (works) => {
            return works.filter(work => {
                const workDate = new Date(work.date);
                return workDate <= today; // Сравниваем даты
            }).length;
        };

        // Подсчитываем количество работ для каждого массива
        const countSpbWorksUpToToday = countWorksUpToToday(updatedUniqueSpbWorks);
        const countMskWorksUpToToday = countWorksUpToToday(updatedUniqueMskWorks);

        const project = await ProjectMapping.findAll();
   
        const spbProjects = project.filter(region => region.regionId === 1 && region.finish === null);
        const mskProjects = project.filter(region => region.regionId === 2 && region.finish === null);
       
        const sumSpb = spbProjects.reduce((total, spbNum) => {
            return total + (spbNum.installation_billing || 0); 
        }, 0);
    

        const sumMsk = mskProjects.reduce((total, mskNum) => {
            return total + (mskNum.installation_billing || 0); 
        }, 0);

        const remainderSpb = sumSpb - countSpbWorksUpToToday
        const remainderMsk = sumMsk - countMskWorksUpToToday

        const brigedeWorks = await BrigadeWorkMapping.findAll()

        const brigadeWorksSpb = brigedeWorks.filter(regionWork => regionWork.regionId === 1 )
        const brigadeWorksMsk = brigedeWorks.filter(regionWork => regionWork.regionId === 2 )

       // количество бригад
        const countWorkSpb = brigadeWorksSpb.length > 0 ? brigadeWorksSpb[0].count : '';
        const countWorkMsk = brigadeWorksMsk.length > 0 ? brigadeWorksMsk[0].count : '';
        //остаток/количество бригад
        const workPerBrigadeSpb = Math.round(remainderSpb/countWorkSpb)
        const workPerBrigadeMsk = Math.round(remainderMsk/countWorkMsk)

        //загрузка в процентах
        const LoadProcentSpb = Math.round(workPerBrigadeSpb/(workPerBrigadeSpb + workPerBrigadeMsk) * 100);
        const LoadProcentMsk = Math.round(workPerBrigadeMsk/(workPerBrigadeSpb + workPerBrigadeMsk) * 100);

        return [{regionSpb: 1, regionMsk: 2, workingSpbDay: countSpbWorksUpToToday, billingSpbDay: sumSpb, remainderSpb: remainderSpb, workingMskDay: countMskWorksUpToToday, billingMskDay: sumMsk, remainderMsk: remainderMsk, workPerBrigadeSpb: workPerBrigadeSpb, workPerBrigadeMsk: workPerBrigadeMsk, LoadProcentSpb: LoadProcentSpb, LoadProcentMsk: LoadProcentMsk, countWorkSpb: countWorkSpb, countWorkMsk : countWorkMsk }]
    }

    async getAllNumberOfDaysBrigadeForProject(brigadeId) {
        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                brigade_id: brigadeId,
            }
        });
    
        if (!brigadesdate || brigadesdate.length === 0) {
            throw new Error('Не проставлены дни в календарь');
        }
    
        // Создаем объекты для хранения количества дней
        const projectDaysCount = {};
        const complaintDaysCount = {};
    
        // Подсчитываем количество дней
        brigadesdate.forEach((brigdate) => {
            if (brigdate.projectId && brigdate.projectId !== 0) {
                projectDaysCount[brigdate.projectId] = (projectDaysCount[brigdate.projectId] || 0) + 1;
            }
            
            if (brigdate.complaintId && brigdate.complaintId !== 0) {
                // Исправлена опечатка: было complaintId, стало complaintId
                complaintDaysCount[brigdate.complaintId] = (complaintDaysCount[brigdate.complaintId] || 0) + 1;
            }
        });
    
        // Преобразуем в массивы
        const projects = Object.entries(projectDaysCount).map(([id, days]) => ({
            projectId: Number(id),
            days,
            
        }));
    
        const complaints = Object.entries(complaintDaysCount).map(([id, days]) => ({
            complaintId: Number(id),
            days,
           
        }));
    
        // Объединяем результаты
        const resultAll = [...projects, ...complaints];
        
        return resultAll;
    }
    
}

export default new BrigadesDate()
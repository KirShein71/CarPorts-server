import { Project as ProjectMapping } from "./mapping.js";
import { Region as RegionMapping } from "./mapping.js";
import { Date as DateMapping } from "./mapping.js";
import { Brigade as BrigadeMapping } from "./mapping.js";
import { BrigadesDate as BrigadesDateMapping } from "./mapping.js";

class Gant {
    async getAllGanttData() {
        try {
            // Параллельная загрузка проектов, дат и бригад
            const [projects, allDates, brigadesData] = await Promise.all([
                ProjectMapping.findAll({
                    where: {
                        date_finish: null,
                        finish: null
                    },
                    attributes: ['id', 'name', 'number', 'regionId', 'designer', 'agreement_date', 'design_period', 'design_start', 'project_delivery', 'expiration_date', 'installation_period', 'price'],
                    include: [{
                        model: RegionMapping,
                        attributes: ['region']
                    }],
                    order: [['agreement_date', 'DESC']],
                    raw: true,
                    nest: true
                }),
                DateMapping.findAll({
                    order: [['date', 'ASC']],
                    raw: true,
                    attributes: ['id', 'date']
                }),
                // Упрощенный запрос бригад - только нужные поля без сложных include
                BrigadesDateMapping.findAll({
                    attributes: ['id', 'project_id', 'date_id', 'brigade_id'],
                    raw: true
                })
            ]);

            // Дополнительно загружаем данные о бригадах
            const brigadeIds = [...new Set(brigadesData.map(b => b.brigade_id).filter(Boolean))];
            const brigadesInfo = await BrigadeMapping.findAll({
                where: {
                    id: brigadeIds
                },
                attributes: ['id', 'name'],
                raw: true
            });

            // Создаем мапу для быстрого доступа к именам бригад
            const brigadeMap = new Map();
            brigadesInfo.forEach(brigade => {
                brigadeMap.set(brigade.id, brigade.name);
            });

            // Создаем обратную мапу: имя бригады -> ID
            const brigadeNameToIdMap = new Map();
            brigadesInfo.forEach(brigade => {
                brigadeNameToIdMap.set(brigade.name, brigade.id);
            });

            // Дополнительно загружаем даты бригад
            const dateIds = [...new Set(brigadesData.map(b => b.date_id).filter(Boolean))];
            const brigadeDatesInfo = await DateMapping.findAll({
                where: {
                    id: dateIds
                },
                attributes: ['id', 'date'],
                raw: true
            });

            // Создаем мапу для быстрого доступа к датам
            const dateMap = new Map();
            brigadeDatesInfo.forEach(date => {
                dateMap.set(date.id, date.date);
            });

            // Оптимизированная группировка недель
            const weekStarts = new Map();
            
            allDates.forEach(dateObj => {
                const date = new Date(dateObj.date);
                const dayOfWeek = date.getDay();
                const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(date);
                monday.setDate(date.getDate() + diff);
                const weekStart = monday.toISOString().split('T')[0];
                
                if (!weekStarts.has(weekStart)) {
                    weekStarts.set(weekStart, {
                        id: dateObj.id,
                        date: weekStart,
                        week_start: weekStart
                    });
                }
            });

            const weeks = Array.from(weekStarts.values());

            // Кэш праздничных дней для быстрого доступа
            const holidaySet = new Set([
                '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-08',
                '2024-02-23', '2024-03-08', '2024-04-29', '2024-04-30', '2024-05-01', '2024-05-09',
                '2024-05-10', '2024-06-12', '2024-11-04', '2025-01-01', '2025-01-02', '2025-01-03',
                '2025-01-06', '2025-01-07', '2025-01-08', '2025-05-01', '2025-05-02', '2025-05-08',
                '2025-05-09', '2025-06-12', '2025-06-13', '2025-11-03', '2025-11-04',
            ]);

            // Оптимизированная функция проверки рабочего дня
            function isWorkingDay(date) {
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) return false;
                
                const dateString = date.toISOString().split('T')[0];
                return !holidaySet.has(dateString);
            }

            // Оптимизированная функция добавления рабочих дней
            function addWorkingDays(startDate, daysToAdd) {
                let currentDate = new Date(startDate);
                let addedDays = 0;
                
                while (addedDays < daysToAdd) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    if (isWorkingDay(currentDate)) {
                        addedDays++;
                    }
                }
                return currentDate;
            }

            // Предварительно вычисляем даты для каждого проекта
            const projectsWithDates = projects.map(project => {
                const agreementDate = new Date(project.agreement_date);
                const designStart = project.design_start ? new Date(project.design_start) : null;
                const projectDelivery = project.project_delivery ? new Date(project.project_delivery) : null;
                
                let designEndDate, productionEndDate, installationEndDate;
                
                if (agreementDate && !isNaN(agreementDate.getTime())) {
                    const designPeriod = project.design_period || 0;
                    const expirationDate = project.expiration_date || 0;
                    const installationPeriod = project.installation_period || 0;

                    designEndDate = addWorkingDays(agreementDate, designPeriod);
                    productionEndDate = addWorkingDays(agreementDate, designPeriod + expirationDate);
                    installationEndDate = addWorkingDays(agreementDate, designPeriod + expirationDate + installationPeriod);
                }

                return {
                    ...project,
                    _agreementDate: agreementDate,
                    _designStart: designStart,
                    _projectDelivery: projectDelivery,
                    _designEndDate: designEndDate,
                    _productionEndDate: productionEndDate,
                    _installationEndDate: installationEndDate
                };
            });

            // Группируем бригады по проектам и бригадам для быстрого доступа
            // Структура: { projectId: { brigadeId: [dates], brigadeId2: [dates] } }
            const brigadesByProjectAndBrigade = {};
            
            brigadesData.forEach(brigade => {
                const projectId = brigade.project_id;
                const brigadeId = brigade.brigade_id;
                const date = dateMap.get(brigade.date_id);
                
                if (projectId && brigadeId && date) {
                    if (!brigadesByProjectAndBrigade[projectId]) {
                        brigadesByProjectAndBrigade[projectId] = {};
                    }
                    
                    if (!brigadesByProjectAndBrigade[projectId][brigadeId]) {
                        brigadesByProjectAndBrigade[projectId][brigadeId] = [];
                    }
                    
                    brigadesByProjectAndBrigade[projectId][brigadeId].push(date);
                }
            });

            // Функция для проверки работы конкретной бригады на неделе
            function isBrigadeWorkingOnWeek(brigadeDates, weekStartDate) {
                if (!brigadeDates || brigadeDates.length === 0) {
                    return false;
                }

                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                return brigadeDates.some(brigadeDateStr => {
                    if (!brigadeDateStr) return false;
                    const brigadeDate = new Date(brigadeDateStr);
                    return brigadeDate >= currentWeek && brigadeDate <= weekEnd;
                });
            }

            // Функция для определения цвета ячейки проекта (БЕЗ учета проектировщика и бригад)
            function getWeekColor(project, weekStartDate) {
                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                // Только стандартные фазы проекта (БЕЗ проектировщика и бригад)
                if (project._agreementDate && !isNaN(project._agreementDate.getTime()) &&
                    currentWeek <= project._installationEndDate && weekEnd >= project._agreementDate) {
                    
                    if (currentWeek <= project._designEndDate && weekEnd >= project._agreementDate) {
                        return '#DFEDFF'; // Проектирование
                    } else if (currentWeek <= project._productionEndDate && weekEnd > project._designEndDate) {
                        return '#E2EFDC'; // Снабжение
                    } else if (currentWeek <= project._installationEndDate && weekEnd > project._productionEndDate) {
                        return '#EFDDDD'; // Монтаж
                    }
                }

                return 'transparent';
            }

            // Функция для определения цвета проектировщика
            function getDesignerColor(project, weekStartDate) {
                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                // Если проектировщик работает на этой неделе - темно-синий
                if (project._designStart && project._projectDelivery && 
                    currentWeek <= project._projectDelivery && weekEnd >= project._designStart) {
                    return '#3b83bd'; // Темно-синий для работы проектировщика
                }

                // Если проектировщик не работает, показываем цвет этапа проекта
                if (project._agreementDate && !isNaN(project._agreementDate.getTime()) &&
                    currentWeek <= project._installationEndDate && weekEnd >= project._agreementDate) {
                    
                    if (currentWeek <= project._designEndDate && weekEnd >= project._agreementDate) {
                        return '#DFEDFF'; // Проектирование
                    } else if (currentWeek <= project._productionEndDate && weekEnd > project._designEndDate) {
                        return '#E2EFDC'; // Снабжение
                    } else if (currentWeek <= project._installationEndDate && weekEnd > project._productionEndDate) {
                        return '#EFDDDD'; // Монтаж
                    }
                }

                return 'transparent';
            }

            // Функция для определения цвета конкретной бригады
            function getBrigadeColor(project, brigadeId, weekStartDate) {
                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                // Получаем даты для конкретной бригады
                const brigadeDates = brigadesByProjectAndBrigade[project.id]?.[brigadeId];
                
                // Если бригада работает на этой неделе - темно-розовый
                if (brigadeDates && isBrigadeWorkingOnWeek(brigadeDates, weekStartDate)) {
                    return '#AD1457'; // Темно-розовый/красный для работы бригады
                }

                // Если бригада не работает, показываем цвет этапа проекта
                if (project._agreementDate && !isNaN(project._agreementDate.getTime()) &&
                    currentWeek <= project._installationEndDate && weekEnd >= project._agreementDate) {
                    
                    if (currentWeek <= project._designEndDate && weekEnd >= project._agreementDate) {
                        return '#DFEDFF'; // Проектирование
                    } else if (currentWeek <= project._productionEndDate && weekEnd > project._designEndDate) {
                        return '#E2EFDC'; // Снабжение
                    } else if (currentWeek <= project._installationEndDate && weekEnd > project._productionEndDate) {
                        return '#EFDDDD'; // Монтаж
                    }
                }

                return 'transparent';
            }

            // Параллельная обработка проектов
            const processedProjects = await Promise.all(
                projectsWithDates.map(async (project) => {
                    const projectBrigadesData = brigadesByProjectAndBrigade[project.id] || {};
                    
                    // Создаем массив бригад с их ID и именами
                    const brigades = Object.keys(projectBrigadesData).map(brigadeId => {
                        const brigadeName = brigadeMap.get(Number(brigadeId));
                        return brigadeName ? {
                            id: brigadeId,
                            name: brigadeName,
                            dates: projectBrigadesData[brigadeId] || []
                        } : null;
                    }).filter(Boolean);

                    // Цвета для проекта (БЕЗ проектировщика и бригад)
                    const projectColors = weeks.map(week => ({
                        week_start: week.week_start,
                        color: getWeekColor(project, week.week_start)
                    }));

                    // Цвета для проектировщика (работа + этапы проекта)
                    const designerColors = weeks.map(week => ({
                        week_start: week.week_start,
                        color: getDesignerColor(project, week.week_start)
                    }));

                    // Цвета для каждой бригады отдельно
                    const brigadeColorsMap = {};
                    
                    brigades.forEach(brigade => {
                        brigadeColorsMap[brigade.id] = weeks.map(week => ({
                            week_start: week.week_start,
                            color: getBrigadeColor(project, brigade.id, week.week_start)
                        }));
                    });

                    return {
                        id: project.id,
                        name: project.name,
                        number: project.number,
                        regionId: project.regionId,
                        designer: project.designer,
                        design_start: project.design_start,
                        project_delivery: project.project_delivery,
                        region: project.RegionMapping?.region,
                        brigades: brigades.map(b => b.name), // только имена для обратной совместимости
                        brigadesDetails: brigades, // полная информация о бригадах
                        colors: projectColors,
                        designerColors: designerColors,
                        brigadeColors: brigadeColorsMap // цвета по ID бригады
                    };
                })
            );

            // Собираем список всех бригад для легенды
            const allBrigades = [...new Set(brigadesInfo.map(b => b.name).filter(Boolean))];

            return {
                weeks: weeks,
                projects: processedProjects,
                brigades: allBrigades
            };

        } catch (error) {
            console.error('Error in getAllGanttData:', error);
            throw error;
        }
    }
}

export default new Gant();
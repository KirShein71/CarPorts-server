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
                    raw: true,
                    nest: true
                }),
                DateMapping.findAll({
                    order: [['date', 'ASC']],
                    raw: true,
                    attributes: ['id', 'date']
                }),
                BrigadesDateMapping.findAll({
                    include: [
                        {
                            model: ProjectMapping,
                            attributes: ['id']
                        },
                        {
                            model: BrigadeMapping,
                            attributes: ['id', 'name']
                        },
                        {
                            model: DateMapping,
                            attributes: ['id', 'date']
                        }
                    ],
                    raw: true,
                    nest: true
                })
            ]);

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

            // Группируем бригады по проектам для быстрого доступа
            const brigadesByProject = {};
            brigadesData.forEach(brigade => {
                const projectId = brigade.ProjectMapping?.id;
                if (projectId) {
                    if (!brigadesByProject[projectId]) {
                        brigadesByProject[projectId] = [];
                    }
                    brigadesByProject[projectId].push({
                        brigadeName: brigade.BrigadeMapping?.name,
                        date: brigade.DateMapping?.date,
                        brigadeId: brigade.BrigadeMapping?.id
                    });
                }
            });

            // Функция для проверки работы бригады на неделе
            function isBrigadeWorking(projectId, weekStartDate) {
                const projectBrigades = brigadesByProject[projectId];
                if (!projectBrigades || projectBrigades.length === 0) {
                    return false;
                }

                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                return projectBrigades.some(brigade => {
                    if (!brigade.date) return false;
                    const brigadeDate = new Date(brigade.date);
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
                    return '#1E3A8A'; // Темно-синий для работы проектировщика
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

            // Функция для определения цвета бригады
            function getBrigadeColor(project, weekStartDate) {
                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                // Если бригада работает на этой неделе - темно-розовый
                if (isBrigadeWorking(project.id, weekStartDate)) {
                    return '#8B0000'; // Темно-розовый/красный для работы бригады
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
                    const projectBrigades = brigadesByProject[project.id] || [];
                    const brigadeNames = [...new Set(projectBrigades.map(b => b.brigadeName).filter(Boolean))];
                    
                    return {
                        id: project.id,
                        name: project.name,
                        number: project.number,
                        regionId: project.regionId,
                        designer: project.designer,
                        design_start: project.design_start,
                        project_delivery: project.project_delivery,
                        region: project.RegionMapping?.region,
                        brigades: brigadeNames,
                        // Цвета для проекта (БЕЗ проектировщика и бригад)
                        colors: weeks.map(week => ({
                            week_start: week.week_start,
                            color: getWeekColor(project, week.week_start)
                        })),
                        // Цвета для проектировщика (работа + этапы проекта)
                        designerColors: weeks.map(week => ({
                            week_start: week.week_start,
                            color: getDesignerColor(project, week.week_start)
                        })),
                        // Цвета для бригады (работа + этапы проекта)
                        brigadeColors: weeks.map(week => ({
                            week_start: week.week_start,
                            color: getBrigadeColor(project, week.week_start)
                        }))
                    };
                })
            );

            // Собираем список всех бригад для легенды
            const allBrigades = [...new Set(brigadesData.map(b => b.BrigadeMapping?.name).filter(Boolean))];

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
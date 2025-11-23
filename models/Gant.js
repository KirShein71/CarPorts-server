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
                    raw: true
                }),
                BrigadesDateMapping.findAll({
                    include: [
                        {
                            model: ProjectMapping,
                            attributes: ['id', 'name']
                        },
                        {
                            model: BrigadeMapping,
                            attributes: ['id', 'name', 'regionId', 'active']
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
            const weekSet = new Set();
            
            allDates.forEach(dateObj => {
                const date = new Date(dateObj.date);
                const dayOfWeek = date.getDay();
                const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(date);
                monday.setDate(date.getDate() + diff);
                const weekStart = monday.toISOString().split('T')[0];
                
                if (!weekSet.has(weekStart)) {
                    weekSet.add(weekStart);
                    weekStarts.set(weekStart, {
                        id: dateObj.id,
                        date: weekStart,
                        week_start: weekStart
                    });
                }
            });

            const weeks = Array.from(weekStarts.values());

            // Кэш праздничных дней
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

            // Функция для проверки периода проектировщика
            function isDesignerWorking(project, weekStartDate) {
                const designStart = project.design_start ? new Date(project.design_start) : null;
                const projectDelivery = project.project_delivery ? new Date(project.project_delivery) : null;

                if (!designStart || isNaN(designStart.getTime()) || !projectDelivery || isNaN(projectDelivery.getTime())) {
                    return false;
                }

                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                return currentWeek <= projectDelivery && weekEnd >= designStart;
            }

            // Функция для проверки работы бригады
            function isBrigadeWorking(projectId, weekStartDate, brigadesData) {
                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                return brigadesData.some(brigade => {
                    if (brigade.Project.id !== projectId) return false;
                    
                    const brigadeDate = new Date(brigade.Date.date);
                    return brigadeDate >= currentWeek && brigadeDate <= weekEnd;
                });
            }

            // Оптимизированная функция определения цвета с приоритетами
            function getWeekColor(project, weekStartDate, brigadesData) {
                const projectId = project.id;
                
                // Приоритет 1: Бригада работает (самый высокий приоритет)
                if (isBrigadeWorking(projectId, weekStartDate, brigadesData)) {
                    return '#FF0000'; // Красный цвет для бригад
                }
                
                // Приоритет 2: Проектировщик работает
                if (isDesignerWorking(project, weekStartDate)) {
                    return '#1E3A8A'; // Темно-синий цвет для проектировщика
                }

                // Приоритет 3: Стандартные фазы проекта
                const agreementDate = new Date(project.agreement_date);
                if (!agreementDate || isNaN(agreementDate.getTime())) {
                    return 'transparent';
                }

                const designPeriod = project.design_period || 0;
                const expirationDate = project.expiration_date || 0;
                const installationPeriod = project.installation_period || 0;

                const designEndDate = addWorkingDays(agreementDate, designPeriod);
                const productionEndDate = addWorkingDays(agreementDate, designPeriod + expirationDate);
                const installationEndDate = addWorkingDays(agreementDate, designPeriod + expirationDate + installationPeriod);

                const currentWeek = new Date(weekStartDate);
                const weekEnd = new Date(currentWeek);
                weekEnd.setDate(weekEnd.getDate() + 6);

                // Быстрая проверка границ
                if (currentWeek > installationEndDate || weekEnd < agreementDate) {
                    return 'transparent';
                }

                if (currentWeek <= designEndDate && weekEnd >= agreementDate) {
                    return '#DFEDFF'; // Светло-синий для проектирования
                } else if (currentWeek <= productionEndDate && weekEnd > designEndDate) {
                    return '#E2EFDC'; // Светло-зеленый для производства
                } else if (currentWeek <= installationEndDate && weekEnd > productionEndDate) {
                    return '#EFDDDD'; // Светло-красный для монтажа
                }

                return 'transparent';
            }

            // Группируем бригады по проектам для удобства
            const brigadesByProject = {};
            brigadesData.forEach(brigade => {
                const projectId = brigade.Project.id;
                if (!brigadesByProject[projectId]) {
                    brigadesByProject[projectId] = [];
                }
                brigadesByProject[projectId].push({
                    brigadeName: brigade.Brigade.name,
                    date: brigade.Date.date,
                    brigadeId: brigade.Brigade.id
                });
            });

            // Параллельная обработка проектов
            const processedProjects = await Promise.all(
                projects.map(async (project) => {
                    const projectBrigades = brigadesByProject[project.id] || [];
                    
                    return {
                        id: project.id,
                        name: project.name,
                        number: project.number,
                        regionId: project.regionId,
                        designer: project.designer,
                        design_start: project.design_start,
                        project_delivery: project.project_delivery,
                        region: project.RegionMapping?.region,
                        brigades: projectBrigades,
                        colors: weeks.map(week => ({
                            week_start: week.week_start,
                            color: getWeekColor(project, week.week_start, brigadesData)
                        }))
                    };
                })
            );

            // Собираем уникальных проектировщиков и бригады для легенды
            const designers = [...new Set(projects.map(p => p.designer).filter(Boolean))];
            const brigadesList = [...new Set(brigadesData.map(b => b.Brigade.name).filter(Boolean))];

            return {
                weeks: weeks,
                projects: processedProjects,
                designers: designers,
                brigades: brigadesList,
                brigadesData: brigadesData
            };

        } catch (error) {
            console.error('Error in getAllGanttData:', error);
            throw error;
        }
    }
}

export default new Gant();


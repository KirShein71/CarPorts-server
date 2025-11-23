import { Project as ProjectMapping } from "./mapping.js";
import { Region as RegionMapping } from "./mapping.js";
import {Date as DateMapping} from "./mapping.js";

class Gant {
    async getAllGanttData() {
    // Получаем активные проекты
    const projects = await ProjectMapping.findAll({
        where: {
            date_finish: null,
            finish: null
        },
        attributes: ['id', 'name', 'number', 'regionId', 'designer', 'agreement_date', 'design_period', 'design_start', 'project_delivery', 'expiration_date', 'installation_period', 'price'],
        include: [
            {
                model: RegionMapping,
                attributes: ['region']
            }
        ],
    });

    // Получаем все недели
    const allDates = await DateMapping.findAll({
        order: [['date', 'ASC']]
    });
    
    // Группируем даты по неделям
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

    // Праздничные дни
    const holidays = [
        '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-08',
        '2024-02-23', '2024-03-08', '2024-04-29', '2024-04-30', '2024-05-01', '2024-05-09',
        '2024-05-10', '2024-06-12', '2024-11-04', '2025-01-01', '2025-01-02', '2025-01-03',
        '2025-01-06', '2025-01-07', '2025-01-08', '2025-05-01', '2025-05-02', '2025-05-08',
        '2025-05-09', '2025-06-12', '2025-06-13', '2025-11-03', '2025-11-04',
    ].map(date => new Date(date));

    // Функция для проверки рабочего дня
    function isWorkingDay(date) {
        const dayOfWeek = date.getDay();
        const isHoliday = holidays.some(holiday => 
            holiday.toDateString() === date.toDateString()
        );
        return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday;
    }

    // Функция для добавления рабочих дней
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

    // Функция для проверки работы проектировщика на неделе
    function isDesignerWorking(project, weekStartDate) {
        const designStart = project.design_start ? new Date(project.design_start) : null;
        const projectDelivery = project.project_delivery ? new Date(project.project_delivery) : null;

        // Проверяем, что даты валидны
        if (!designStart || isNaN(designStart.getTime()) || !projectDelivery || isNaN(projectDelivery.getTime())) {
            return false;
        }

        const currentWeek = new Date(weekStartDate);
        const weekEnd = new Date(currentWeek);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Проверяем, пересекается ли неделя с периодом работы проектировщика
        return currentWeek <= projectDelivery && weekEnd >= designStart;
    }

    // Функция для определения цвета ячейки проекта
    function getWeekColor(project, weekStartDate) {
        const currentWeek = new Date(weekStartDate);
        const weekEnd = new Date(currentWeek);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const agreementDate = new Date(project.agreement_date);
        if (!agreementDate || isNaN(agreementDate)) return 'transparent';

        const designPeriod = project.design_period || 0;
        const designEndDate = addWorkingDays(agreementDate, designPeriod);

        const expirationDate = project.expiration_date || 0;
        const productionEndDate = addWorkingDays(agreementDate, designPeriod + expirationDate);

        const installationPeriod = project.installation_period || 0;
        const installationEndDate = addWorkingDays(
            agreementDate,
            designPeriod + expirationDate + installationPeriod
        );

        // ПРИОРИТЕТ 1: Проектировщик работает (самый высокий приоритет)
        if (isDesignerWorking(project, weekStartDate)) {
            return '#1E3A8A'; // Темно-синий для работы проектировщика
        }

        // ПРИОРИТЕТ 2: Стандартные фазы проекта
        if (currentWeek <= installationEndDate && weekEnd >= agreementDate) {
            if (currentWeek <= designEndDate && weekEnd >= agreementDate) {
                return '#DFEDFF'; // Проектирование
            } else if (currentWeek <= productionEndDate && weekEnd > designEndDate) {
                return '#E2EFDC'; // Снабжение
            } else if (currentWeek <= installationEndDate && weekEnd > productionEndDate) {
                return '#EFDDDD'; // Монтаж
            }
        }

        return 'transparent';
    }

    // Функция для определения цвета проектировщика (отдельно)
    function getDesignerColor(project, weekStartDate) {
        const currentWeek = new Date(weekStartDate);
        const weekEnd = new Date(currentWeek);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const designStart = project.design_start ? new Date(project.design_start) : null;
        const projectDelivery = project.project_delivery ? new Date(project.project_delivery) : null;

        // Проверяем, что даты валидны
        if (!designStart || isNaN(designStart.getTime()) || !projectDelivery || isNaN(projectDelivery.getTime())) {
            return 'transparent';
        }

        // Проверяем, пересекается ли неделя с периодом работы проектировщика
        if (currentWeek <= projectDelivery && weekEnd >= designStart) {
            return '#1E3A8A'; // Темно-синий для работы проектировщика
        }

        return 'transparent';
    }

    // Формируем данные для клиента
    const ganttData = {
        weeks: weeks,
        projects: projects.map(project => ({
            id: project.id,
            name: project.name,
            number: project.number,
            regionId: project.regionId,
            designer: project.designer,
            design_start: project.design_start,
            project_delivery: project.project_delivery,
            region: project.RegionMapping?.region,
            // Цвета для проекта (с приоритетом проектировщика)
            colors: weeks.map(week => ({
                week_start: week.week_start,
                color: getWeekColor(project, week.week_start)
            })),
            // Отдельные цвета для проектировщика
            designerColors: weeks.map(week => ({
                week_start: week.week_start,
                color: getDesignerColor(project, week.week_start)
            }))
        }))
    };

    return ganttData;
}
}

export default new Gant()


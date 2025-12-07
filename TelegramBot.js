import { Telegraf } from 'telegraf';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { Sequelize, Op } from 'sequelize';

dotenv.config();

// Проверка обязательных переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Ошибка: TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID обязательны в .env файле');
  process.exit(1);
}

// Инициализация бота
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Инициализация базы данных
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

// Импортируем модели
import {Project as ProjectMapping} from './models/mapping.js';
import { BrigadesDate as BrigadesDateMapping } from './models/mapping.js';
import { Complaint as ComplaintMapping } from './models/mapping.js';
import { ProjectExamination as ProjectExaminationMapping } from './models/mapping.js';
import { Brigade as BrigadeMapping } from './models/mapping.js';
import { Examination as ExaminationMapping } from './models/mapping.js';
import { Date as DateMapping } from './models/mapping.js';

class Counter {
  async getProjectStatistics() {
    try {
      // Текущая дата
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const lastYear = currentYear - 1;
      
      // Начало и конец текущего месяца
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
      const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
      
      // Начало и конец того же месяца прошлого года
      const startOfMonthLastYear = new Date(lastYear, currentMonth - 1, 1);
      const endOfMonthLastYear = new Date(lastYear, currentMonth, 0, 23, 59, 59, 999);
      
      // Даты для последних 14 дней
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
      const startOf14Days = new Date(fourteenDaysAgo.setHours(0, 0, 0, 0));
      const endOf14Days = new Date(now.setHours(23, 59, 59, 999));
      
      // Всего проектов
      const countProject = await ProjectMapping.findAndCountAll();
      
      // Проекты на монтаже
      const projects = await ProjectMapping.findAll();
      const activeProject = projects.filter(project => project.finish === null);
      const brigadeProject = await BrigadesDateMapping.findAll();

      const uniqueProjects = brigadeProject.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.projectId === value.projectId
        ))
      );

      const countInstallers = activeProject.filter(active => 
        uniqueProjects.some(unique => unique.projectId === active.id)
      ).length;

      // Завершенные проекты
      const finishProject = projects.filter(project => project.date_finish !== null);
      const countFinish = finishProject.length;

      // Завершенные в этом году
      const countFinishThisYear = await ProjectMapping.findAndCountAll({
        where: {
          date_finish: {
            [Op.gte]: new Date(`${currentYear}-01-01`),
            [Op.lt]: new Date(`${currentYear + 1}-01-01`)
          }
        }
      });

      // Подписано в этом месяце
      const signedThisMonth = await ProjectMapping.findAll({
        where: {
          agreement_date: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth
          }
        },
        attributes: ['id', 'name', 'number', 'agreement_date'],
        order: [['agreement_date', 'DESC']]
      });

      // Сдано в этом месяце
      const deliveredThisMonth = await ProjectMapping.findAll({
        where: {
          date_finish: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth
          }
        },
        attributes: ['id', 'name', 'number', 'date_finish'],
        order: [['date_finish', 'DESC']]
      });

      // Подписано в том же месяце прошлого года
      const signedLastYearSameMonth = await ProjectMapping.findAndCountAll({
        where: {
          agreement_date: {
            [Op.gte]: startOfMonthLastYear,
            [Op.lte]: endOfMonthLastYear
          }
        }
      });

      // Сдано в том же месяце прошлого года
      const deliveredLastYearSameMonth = await ProjectMapping.findAndCountAll({
        where: {
          date_finish: {
            [Op.gte]: startOfMonthLastYear,
            [Op.lte]: endOfMonthLastYear
          }
        }
      });

      // Среднее количество рабочих дней по МО и ЛО
      const workingDaysStats = await this.getWorkingDaysStats(startOf14Days, endOf14Days);
      
      // Очередь на проектирование
      const designQueue = await ProjectMapping.findAll({
        where: {
          designer: null,
          finish: null,
          agreement_date: {
            [Op.ne]: null
          }
        },
        attributes: ['id', 'name', 'number'],
        order: [['agreement_date', 'ASC']]
      });

      // Очередь на снабжение
      const supplyQueue = await sequelize.query(
        `SELECT p.id, p.name, p.number
        FROM projects p
        WHERE p.id NOT IN (
          SELECT project_id
          FROM project_materials
        ) 
        AND p.finish IS NULL
        AND p.designer IS NOT NULL
        ORDER BY p.agreement_date ASC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      // Очередь на монтаж
      const installationQueue = await sequelize.query(
        `SELECT p.id, p.name, p.number
        FROM projects p
        WHERE p.id NOT IN (
          SELECT project_id
          FROM brigades_dates
        ) 
        AND p.finish IS NULL
        AND p.designer IS NOT NULL
        AND p.id IN (
          SELECT project_id
          FROM project_materials
        )
        ORDER BY p.agreement_date ASC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      // Незаполненные сметы
      const unfilledEstimates = await sequelize.query(
        `SELECT p.id, p.name, p.number
        FROM projects p
        WHERE p.date_finish IS NULL
        AND p.id NOT IN (
          SELECT project_id
          FROM estimates
        )
        ORDER BY p.agreement_date ASC`,
        { type: sequelize.QueryTypes.SELECT }
      );

      const unfilledEstimatesCount = unfilledEstimates.length;

      // Незакрытые рекламации
      const openComplaints = await ComplaintMapping.findAll({
        where: {
          date_finish: null
        },
        include: [
          {
            model: ProjectMapping,
            attributes: ['id', 'name', 'number', 'regionId']
          }
        ],
        order: [['date', 'ASC']]
      });

      // Рекламации МО
      const complaintsMO = openComplaints.filter(complaint => 
        complaint.project && complaint.project.regionId === 2
      );

      // Рекламации ЛО
      const complaintsLO = openComplaints.filter(complaint => 
        complaint.project && complaint.project.regionId === 1
      );

      // Формируем списки проектов с рекламациями
      const complaintsMOProjects = complaintsMO.map(complaint => ({
        name: complaint.project?.name || 'Без названия',
      }));

      const complaintsLOProjects = complaintsLO.map(complaint => ({
        name: complaint.project?.name || 'Без названия',
      }));

      // Технадзор в этом месяце
      const technicalSupervisionThisMonth = await this.getTechnicalSupervisionThisMonth(startOfMonth, endOfMonth);
      
      return {
        countProject: countProject.count,
        countInstallers: countInstallers,
        countFinish: countFinish,
        countFinishThisYear: countFinishThisYear.count,
        signedThisMonth: signedThisMonth,
        signedThisMonthCount: signedThisMonth.length,
        deliveredThisMonth: deliveredThisMonth,
        deliveredThisMonthCount: deliveredThisMonth.length,
        signedLastYearSameMonth: signedLastYearSameMonth.count,
        deliveredLastYearSameMonth: deliveredLastYearSameMonth.count,
        // Добавляем недостающие свойства:
        designQueue: designQueue,
        designQueueCount: designQueue.length,
        supplyQueue: supplyQueue,
        supplyQueueCount: supplyQueue.length,
        installationQueue: installationQueue,
        installationQueueCount: installationQueue.length,
        unfilledEstimates: unfilledEstimates,
        unfilledEstimatesCount: unfilledEstimatesCount,
        openComplaintsCount: openComplaints.length,
        complaintsMOCount: complaintsMO.length,
        complaintsLOCount: complaintsLO.length,
        complaintsMOProjects: complaintsMOProjects,
        complaintsLOProjects: complaintsLOProjects,
        workingDaysMO: workingDaysStats.moAverage,
        workingDaysLO: workingDaysStats.loAverage,
        workingDaysMOCount: workingDaysStats.moCount,
        workingDaysLOCount: workingDaysStats.loCount,
        technicalSupervision: technicalSupervisionThisMonth,
      };
    } catch (error) {
      console.error('Error getting project statistics:', error);
      throw error;
    }
  }

  async getTechnicalSupervisionThisMonth(startOfMonth, endOfMonth) {
    try {
      const projectExaminations = await ProjectExaminationMapping.findAll({
        where: {
          created_at: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth
          }
        },
        include: [
          {
            model: ProjectMapping,
            attributes: ['name', 'number'], 
          },
          {
            model: BrigadeMapping, 
            attributes: ['name'],
          },
          {
            model: ExaminationMapping, 
            attributes: ['name']
          }
        ],
        order: [
          ['brigadeId', 'ASC'],
          ['projectId', 'ASC'],
        ],
      });

      if (projectExaminations.length === 0) {
        return [];
      }

      const groupedByBrigade = projectExaminations.reduce((acc, item) => {
        const { brigadeId, Brigade, projectId, Project, result } = item;
        
        if (!acc[brigadeId]) {
          acc[brigadeId] = {
            brigadeId: brigadeId,
            brigadeName: Brigade.name,
            projects: {},
          };
        }
        
        if (!acc[brigadeId].projects[projectId]) {
          acc[brigadeId].projects[projectId] = {
            projectId: projectId,
            projectName: Project.name,
            projectNumber: Project.number,
            results: []
          };
        }
        
        acc[brigadeId].projects[projectId].results.push(result);
        
        return acc;
      }, {});

      const result = Object.values(groupedByBrigade).map(brigadeGroup => {
        const projects = Object.values(brigadeGroup.projects).map(project => {
          const total = project.results.length;
          const sum = project.results.reduce((acc, result) => acc + result, 0);
          const averagePercentage = total > 0 ? Math.round((sum / total) * 100) : 0;
          
          return {
            project: project.projectName,
            number: project.projectNumber,
            result: averagePercentage,
          };
        });

        const projectAverages = projects.map(p => p.result);
        const brigadeAverageFromProjects = projectAverages.length > 0 ? 
          Math.round(projectAverages.reduce((acc, avg) => acc + avg, 0) / projectAverages.length) : 0;

        return {
          brigade: brigadeGroup.brigadeName,
          brigadeAverage: brigadeAverageFromProjects,
          projects: projects,
        };
      });

      return result;
    } catch (error) {
      console.error('Error getting technical supervision:', error);
      return [];
    }
  }

  async getWorkingDaysStats(startDate, endDate) {
    try {
      const brigadeDates = await BrigadesDateMapping.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.or]: [
            { projectId: { [Op.ne]: null } },
            { complaintId: { [Op.ne]: null } }
          ]
        },
      });

      if (brigadeDates.length === 0) {
        return {
          moCount: 0,
          loCount: 0,
          moAverage: 0,
          loAverage: 0
        };
      }

      let moCount = 0;
      let loCount = 0;

      brigadeDates.forEach(record => {
        if (record.regionId === 2) {
          moCount++;
        } else if (record.regionId === 1) {
          loCount++;
        }
      });

      const daysInPeriod = 14;
      const moAverage = parseFloat((moCount / daysInPeriod).toFixed(1));
      const loAverage = parseFloat((loCount / daysInPeriod).toFixed(1));

      return {
        moCount,
        loCount,
        moAverage,
        loAverage
      };
    } catch (error) {
      console.error('Error getting working days stats:', error);
      return {
        moCount: 0,
        loCount: 0,
        moAverage: 0,
        loAverage: 0
      };
    }
  }
}

// Функция для форматирования списка проектов в простом формате
function formatSimpleProjectList(projects, maxLength = 10) {
  if (projects.length === 0) {
    return '';
  }
  
  let list = '';
  const displayCount = Math.min(projects.length, maxLength);
  
  for (let i = 0; i < displayCount; i++) {
    const project = projects[i];
    const projectName = project.name || `Проект ${project.number}`;
    list += `${projectName}\n`;
  }
  
  if (projects.length > maxLength) {
    list += `... и еще ${projects.length - maxLength} проектов\n`;
  }
  
  return list;
}

// Функция для форматирования технадзора в простом формате
function formatSimpleTechnicalSupervision(technicalSupervision) {
  if (technicalSupervision.length === 0) {
    return '';
  }
  
  let list = '';
  
  for (let i = 0; i < technicalSupervision.length; i++) {
    const brigade = technicalSupervision[i];
    
    list += `${brigade.brigade}\n`;
    
    if (brigade.projects && brigade.projects.length > 0) {
      for (let j = 0; j < brigade.projects.length; j++) {
        const project = brigade.projects[j];
        list += `${project.result}\n`;
        list += `${project.project}\n`;
      }
    }
  }
  
  return list;
}

// Функция для разделения длинных сообщений
function splitMessage(message) {
  const maxLength = 4000;
  if (message.length <= maxLength) {
    return [message];
  }
  
  const parts = [];
  let currentPart = '';
  const lines = message.split('\n');
  
  for (const line of lines) {
    if (currentPart.length + line.length + 1 > maxLength) {
      parts.push(currentPart);
      currentPart = line + '\n';
    } else {
      currentPart += line + '\n';
    }
  }
  
  if (currentPart) {
    parts.push(currentPart);
  }
  
  return parts;
}

// Функция для отправки статистики
async function sendStatisticsMessage() {
  try {
    console.log(`[${new Date().toLocaleString()}] Формирование и отправка статистики...`);
    
    const counter = new Counter();
    const stats = await counter.getProjectStatistics();
    
    // Форматируем дату
    const currentDate = new Date().toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric'
    });

    // Формируем сообщение
    const message = `Отчет за ${currentDate}\n\n` +
                   `Всего проектов: ${stats.countProject}\n\n` +
                   `На монтаже: ${stats.countInstallers}\n` +
                   `Завершено всего: ${stats.countFinish}\n` +
                   `Завершено в этом году: ${stats.countFinishThisYear}\n\n` +
                   
                   `Очередь на проектирование: ${stats.designQueueCount}\n` +
                   `${formatSimpleProjectList(stats.designQueue)}\n` +
                   
                   `Очередь на снабжение: ${stats.supplyQueueCount}\n` +
                   `${formatSimpleProjectList(stats.supplyQueue)}\n` +
                   
                   `Очередь на монтаж: ${stats.installationQueueCount}\n` +
                   `${formatSimpleProjectList(stats.installationQueue)}\n` +
                   
                   `Подписано в этом месяце: ${stats.signedThisMonthCount}\n` +
                   `${formatSimpleProjectList(stats.signedThisMonth)}\n` +
                   
                   `Сдано в этом месяце: ${stats.deliveredThisMonthCount}\n` +
                   `${formatSimpleProjectList(stats.deliveredThisMonth)}\n` +
                   
                   `Подписано в прошлом году: ${stats.signedLastYearSameMonth}\n` +
                   `Сдано в прошлом году: ${stats.deliveredLastYearSameMonth}\n\n` +
                   
                   `Среднее кол-во раб.дней по МО: ${stats.workingDaysMO?.toFixed(1).replace('.', ',')}    (${stats.workingDaysMOCount}/14)\n` +
                   `Среднее кол-во раб.дней по ЛО: ${stats.workingDaysLO?.toFixed(1).replace('.', ',')}    (${stats.workingDaysLOCount}/14)\n\n` +
                   
                   `Технадзор в этом месяце:\n` +
                   `${formatSimpleTechnicalSupervision(stats.technicalSupervision)}\n` +
                   
                   `Незакрытые рекламации: ${stats.openComplaintsCount}\n` +
                   `МО: ${stats.complaintsMOCount}\n` +
                   `${formatSimpleProjectList(stats.complaintsMOProjects)}\n` +
                   
                   `ЛО: ${stats.complaintsLOCount}\n` +
                   `${formatSimpleProjectList(stats.complaintsLOProjects)}\n` +
                   
                   `Сметы\n` +
                   `Незаполнены: ${stats.unfilledEstimatesCount}`;
    
    // Разделяем сообщение если оно слишком длинное
    const messageParts = splitMessage(message);
    
    if (messageParts.length > 1) {
      console.log(`Сообщение разделено на ${messageParts.length} части(ей)`);
    }
    
    // Отправляем все части сообщения
    for (let i = 0; i < messageParts.length; i++) {
      await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, messageParts[i]);
      console.log(`Часть ${i + 1}/${messageParts.length} отправлена`);
    }
    
    console.log(`Статистика успешно отправлена в группу ${TELEGRAM_CHAT_ID}`);
    
  } catch (error) {
    console.error('Ошибка при отправке статистики:', error.message);
  }
}

// Настройка cron задачи
cron.schedule('00 13 * * *', () => {
  console.log(`[${new Date().toLocaleString()}] Запуск задачи на отправку статистики`);
  sendStatisticsMessage();
});

console.log('Бот настроен на отправку статистики каждый день в 11:35');

// Тестовая отправка при запуске
setTimeout(async () => {
  console.log('Тестовая отправка статистики...');
  await sendStatisticsMessage();
}, 3000);

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('Выключение бота (SIGINT)...');
  bot.stop();
});

process.once('SIGTERM', () => {
  console.log('Выключение бота (SIGTERM)...');
  bot.stop();
});

// Экспортируем бота
export default bot;
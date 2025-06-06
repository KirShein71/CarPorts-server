import { Project as ProjectMapping } from "./mapping.js";
import { ProjectBrigades as ProjectBrigadeMapping } from "./mapping.js";
import { BrigadesDate as BrigadesDateMapping } from "./mapping.js";
import sequelize from "../sequelize.js";
import {Op}  from 'sequelize'



class Counter {
    async getProjectStatistics() {
        try {
            const countProject = await ProjectMapping.findAndCountAll();
            
            const countNoDesigner = await ProjectMapping.findAndCountAll({
                where: {
                    designer: null,
                    finish: null
                }
            });
    
            const countNoMaterialsResult = await sequelize.query(
                `SELECT COUNT(*)
                FROM projects
                WHERE id NOT IN (
                    SELECT project_id
                    FROM project_materials
                ) AND finish IS NULL`,
                { plain: true }
            );
            const countNoMaterials = Object.values(countNoMaterialsResult)[0];
    
            const countNoInstallersResult = await sequelize.query(
                `SELECT COUNT(*)
                FROM projects
                WHERE id NOT IN (
                    SELECT project_id
                    FROM brigades_dates
                ) AND finish IS NULL`,
                { plain: true }
            );
            const countNoInstallers = Object.values(countNoInstallersResult)[0];
            // Проекты на монтаже
            const projects = await ProjectMapping.findAll()

            const activeProject = projects.filter(project => project.finish === null)

            const brigadeProject = await BrigadesDateMapping.findAll()

            const uniqueProjects = brigadeProject.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.projectId === value.projectId
                ))
            );

            const countInstallers = activeProject.filter(active => 
                uniqueProjects.some(unique => unique.projectId === active.id)
            ).length;

            // const countInstallers = await ProjectBrigadeMapping.findAndCountAll({
            //     where: {
            //         project_id: {
            //             [Op.not]: null
            //         }
            //         }
            // });

            const finishProject = projects.filter(project => project.date_finish !== null)

            const countFinish = finishProject.length

            
            const currentYear = new Date().getFullYear();

            const countFinishThisYear = await ProjectMapping.findAndCountAll({
                where: {
                    date_finish: {
                        [Op.gte]: new Date(`${currentYear}-01-01`),
                        [Op.lt]: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            });
            
            return [{ countProject: countProject.count, countNoDesigner: countNoDesigner.count, countNoMaterials: countNoMaterials, countNoInstallers: countNoInstallers, countInstallers: countInstallers, countFinish: countFinish, countFinishThisYear: countFinishThisYear.count }];
        } catch (error) {
            console.error('Error getting project statistics:', error);
            throw error;
        }
    }

}



export default new Counter()

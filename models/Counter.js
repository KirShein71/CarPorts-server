import { Project as ProjectMapping } from "./mapping.js";
import { ProjectBrigades as ProjectBrigadeMapping } from "./mapping.js";
import sequelize from "../sequelize.js";
import {Op}  from 'sequelize'



class Counter {
    async getProjectStatistics() {
        try {
            const countProject = await ProjectMapping.findAndCountAll();
            
            const countNoDesigner = await ProjectMapping.findAndCountAll({
                where: {
                    designer: null
                }
            });
    
            const countNoMaterialsResult = await sequelize.query(
                `SELECT COUNT(*)
                FROM projects
                WHERE id NOT IN (
                    SELECT project_id
                    FROM project_materials
                )`,
                { plain: true }
            );
            const countNoMaterials = Object.values(countNoMaterialsResult)[0];
    
            const countNoInstallersResult = await sequelize.query(
                `SELECT COUNT(*)
                FROM projects
                WHERE id NOT IN (
                    SELECT project_id
                    FROM project_brigades
                )`,
                { plain: true }
            );
            const countNoInstallers = Object.values(countNoInstallersResult)[0];

            const countInstallers = await ProjectBrigadeMapping.findAndCountAll({
                where: {
                    project_id: {
                        [Op.not]: null
                    }
                    }
            });

            const countFinish = await ProjectMapping.findAndCountAll({
                where: {
                    date_finish: {
                        [Op.not]: null
                    }
                }
            });

            
            const currentYear = new Date().getFullYear();

            const countFinishThisYear = await ProjectMapping.findAndCountAll({
                where: {
                    date_finish: {
                        [Op.gte]: new Date(`${currentYear}-01-01`),
                        [Op.lt]: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            });
            
            return [{ countProject: countProject.count, countNoDesigner: countNoDesigner.count, countNoMaterials: countNoMaterials, countNoInstallers: countNoInstallers, countInstallers: countInstallers.count, countFinish: countFinish.count, countFinishThisYear: countFinishThisYear.count }];
        } catch (error) {
            console.error('Error getting project statistics:', error);
            throw error;
        }
    }

}



export default new Counter()

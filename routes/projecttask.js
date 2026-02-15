import express from 'express'
import ProjectTaskController from '../controllers/projectTaskController.js'

const router = new express.Router()


router.post('/create',  ProjectTaskController .create)
router.post('/createTasksFromTemplates/:projectId', ProjectTaskController.createTasksFromTemplates);
router.put('/createExecutorProjectTask/:id([0-9]+)', ProjectTaskController .createExecutorProjectTask)
router.put('/update/:id([0-9]+)', ProjectTaskController .update)
router.patch('/updateActiveProjectTask/:id([0-9]+)', ProjectTaskController .updateActiveProjectTask)
router.get('/getall', ProjectTaskController .getAll)
router.get('/getAllActiveTaskProject', ProjectTaskController .getAllActiveTaskProject)
router.get('/getAllTaskForProject/:id([0-9]+)', ProjectTaskController.getAllTaskForProject)
router.get('/getone/:id([0-9]+)', ProjectTaskController .getOne)
router.delete('/deleteTask/:id([0-9]+)',  ProjectTaskController .deleteTask)


export default router
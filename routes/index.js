import express from 'express'

import user from './user.js'
import admin from './admin.js'
import employee from './employee.js'
import project from './project.js'
import projectmaterials from './projectmaterials.js'
import materials from './materials.js'
import details from './details.js'
import projectdetails from './projectdetails.js'
import stockdetails from './stockdetails.js'
import stockantypical from './stockantypical.js'
import shipmentdetails from './shipmentdetails.js'
import remainderdetails from './remainderdetails.js'
import brigade from './brigade.js'
import projectbrigades from './projectbrigades.js'
import antypical from './antypical.js'
import userimage from './userimage.js'
import userfile from './userfile.js'
import counter from './counter.js'




const router = new express.Router()

router.use('/user', user)
router.use('/admin', admin)
router.use('/employee', employee)
router.use('/project', project)
router.use('/projectmaterials', projectmaterials)
router.use('/materials', materials)
router.use('/details', details)
router.use('/projectdetails', projectdetails)
router.use('/stockdetails', stockdetails)
router.use('/stockantypical', stockantypical)
router.use('/shipmentdetails', shipmentdetails)
router.use('/remainderdetails', remainderdetails)
router.use('/brigade', brigade)
router.use('/projectbrigades', projectbrigades)
router.use('/antypical', antypical)
router.use('/userimage', userimage)
router.use('/userfile', userfile)
router.use('/counter', counter)




export default router
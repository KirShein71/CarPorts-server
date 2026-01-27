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
import brigadesdate from './brigadesdate.js'
import region from './region.js'
import service from './service.js'
import estimate from './estimate.js'
import managersale from './managersale.js'
import managerproject from './managerproject.js'
import managerproduction from './managerproduction.js'
import constructor from './constructor.js'
import brigadework from './brigadework.js'
import payment from './payment.js'
import complaint from './complaint.js'
import complaintimage from './complaintimage.js'
import complaintestimate from './complaintestimate.js'
import complaintpayment from './complaintpayment.js'
import deliverydetails from './deliverydetails.js'
import supplier from './supplier.js'
import examination from './examination.js'
import projectexamination from './projectexamination.js'
import designer from './designer.js'
import coefficient from './coefficient.js'
import gant from './gant.js'
import npschapter from './npschapter.js'
import npsquestion from './npsquestion.js'
import npsproject from './npsproject.js'
import warehouseassortment from './warehouseassortment.js'
import projectwarehouse from './projectwarehouse.js'
import shipmentwarehouse from './shipmentwarehouse.js'




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
router.use('/brigadesdate', brigadesdate)
router.use('/region', region)
router.use('/service', service)
router.use('/estimate', estimate)
router.use('/managersale', managersale)
router.use('/managerproject', managerproject)
router.use('/managerproduction', managerproduction)
router.use('/constructor', constructor)
router.use('/brigadework', brigadework)
router.use('/payment', payment)
router.use('/complaint', complaint)
router.use('/complaintimage', complaintimage)
router.use('/complaintestimate', complaintestimate)
router.use('/complaintpayment', complaintpayment)
router.use('/deliverydetails', deliverydetails)
router.use('/supplier', supplier)
router.use('/examination', examination)
router.use('/projectexamination', projectexamination)
router.use('/designer', designer)
router.use('/coefficient', coefficient)
router.use('/gant', gant)
router.use('/npschapter', npschapter)
router.use('/npsquestion', npsquestion)
router.use('/npsproject', npsproject)
router.use('/warehouseassortment', warehouseassortment)
router.use('/projectwarehouse', projectwarehouse)
router.use('/shipmentwarehouse', shipmentwarehouse)




export default router
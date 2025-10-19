import express from 'express';
import { getAllGrades, getGradeByValue } from '../controller/grade';



const router = express.Router()


router.route('/grades').get(getAllGrades)

router.get('/grades/:grade', getGradeByValue)




export default router
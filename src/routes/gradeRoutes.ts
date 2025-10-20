import express from 'express';
import { getAllGrades, getGradeByValue, postGrade } from '../controller/grade';



const router = express.Router()


router.route('/grades').get(getAllGrades).post(postGrade)

router.get('/grades/:grade', getGradeByValue)





export default router
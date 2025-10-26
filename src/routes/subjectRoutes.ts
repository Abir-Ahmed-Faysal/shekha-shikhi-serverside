import express from 'express';
import { createSubject, getSubjectsByGrade } from '../controller/subject';
const router=express.Router()

router.route('/subjects').get(getSubjectsByGrade).post(createSubject)



router.route('/subjects/:grade').get(getSubjectsByGrade)

export default router
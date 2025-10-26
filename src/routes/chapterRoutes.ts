import express from 'express';
import { postChapter } from '../controller/chapter';
const router = express.Router()



router.route('/chapters').post(postChapter)


export default router
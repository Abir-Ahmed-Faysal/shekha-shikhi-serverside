import express from 'express';
import { getTranslation, postTranslation } from '../controller/translation';

const router = express.Router()



router.route('/translation')
    .get(getTranslation)
    .post(postTranslation)



export default router
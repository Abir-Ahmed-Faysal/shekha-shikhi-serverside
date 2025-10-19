import express from "express";
import { getTodos, postTodos, findOne, update, deleteData, testError } from "../controller/todos";


const router = express.Router();


router.route("/todos")
  .get(getTodos)
  .post(postTodos);

  
router.route("/todos/:id")
  .get(findOne)
  .patch(update)
  .delete(deleteData);


  

  router.get("/test-error", testError );

export default router;

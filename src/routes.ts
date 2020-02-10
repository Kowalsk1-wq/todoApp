import { Router } from "express";
const rt = Router();

import TaskController from "./app/controllers/TaskController"

/**
 * @routes
 */
rt.get("/", (_req, res) => res.json({ Hello: true })); //<- Hello Route

rt.get("/tasks", TaskController.list);
rt.post("/tasks", TaskController.create);
rt.delete("/tasks/:id", TaskController.delete);

export default rt;

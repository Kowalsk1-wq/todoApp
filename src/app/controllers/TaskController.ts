import { getConnection } from "typeorm";
import { Task } from "../database/entity/Task";

class TaskController {
  async list(_req: any, res: any) {
    const task = await getConnection()
      .createQueryBuilder()
      .select("task")
      .from(Task, "task")
      .getMany();

    return res.json(task);
  }

  async create(req: any, res: any) {
    const { description } = req.body;

    const taskTarget = await getConnection()
      .createQueryBuilder()
      .select("task")
      .from(Task, "task")
      .where("description = :description", { description })
      .getOne();

    if (!taskTarget) {
      const taskCreated = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Task)
        .values([{ description, status: "Pendente" }])
        .execute();

      return res.json(taskCreated.raw);
    } else {
      return res.json({
        message: "A Tarefa Já Existe!",
        task: taskTarget
      });
    }
  }

  async delete(req: any, res: any) {
    const { id } = req.params;

    if (id.length === 36 && typeof id === "string") {
      const taskTarget = await getConnection()
        .createQueryBuilder()
        .select("task")
        .from(Task, "task")
        .where("id = :id", { id })
        .getOne();

      if (taskTarget) {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(Task)
          .where("id = :id", { id })
          .execute();

        return res.json({ ok: "Tarefa Apagada com Sucesso!" });
      } else {
        return res.json({
          error: "Tarefa Não Encontrada!"
        });
      }
    } else {
      return res.json({
        error: "Id Inválido!!"
      })
    }
  }
}

export default new TaskController();

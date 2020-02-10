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

  async changeStatus(req: any, res: any) {
    const { id } = req.params;
    const { status } = await req.query.status;

    if (id.length === 36 && typeof id === "string") {
      const tasktarget = await getConnection()
        .createQueryBuilder()
        .select("task")
        .from(Task, "task")
        .where("id = :id", { id })
        .getOne();

      if (tasktarget) {
        if (
          status == "Pendente" ||
          status == "Andamento" ||
          status == "Concluida"
        ) {
          const taskChange = await getConnection()
            .createQueryBuilder()
            .update(Task)
            .set({
              status: () => `${status}`
            })
            .where("id = :id", { id })
            .execute();

          return res.json({
            ok: `Tarefa com status ${status}!`,
            task: taskChange
          });
        } else {
          return res.json({
            error: "Status Inválido!"
          })
        }
      } else {
        return res.json({
          error: "Tarefa Não Encontrada!"
        });
      }
    } else {
      return res.json({
        error: "Id Inválido!!"
      });
    }
  }

  async update(req: any, res: any) {
    const { id } = req.params;
    const { description } = req.body;

    if (id.length === 36 && typeof id === "string") {
      const tasktarget = await getConnection()
        .createQueryBuilder()
        .select("task")
        .from(Task, "task")
        .where("id = :id", { id })
        .getOne();

      if (tasktarget) {
        const taskUp = await getConnection()
          .createQueryBuilder()
          .update(Task)
          .set({
            description: () => `${description}`
          })
          .where("id = :id", { id })
          .execute();

        return res.json({
          ok: "Tarefa Atualizada com Sucesso!",
          antes: tasktarget,
          agora: taskUp
        });
      } else {
        return res.json({
          error: "Tarefa Não Encontrada!"
        });
      }
    } else {
      return res.json({
        error: "Id Inválido!!"
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
      });
    }
  }
}

export default new TaskController();

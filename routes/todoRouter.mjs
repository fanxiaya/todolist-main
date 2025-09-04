import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { getToken } from "../middleware/userMiddleware.mjs";
import logger from "../logger/logger.mjs";
import todoSchema from "../schema/todoSchema.mjs";
import TodoModel from "../model/todoModel.mjs";
import CounterModel from "../model/couterModel.mjs";

const todoRouter = Router();

const selfIncrement = async () => {
  const counter = await CounterModel.findOneAndUpdate(
    { count: "tool" },
    { $inc: { id: 1 } },
    { new: true, upsert: true }
  );
  return counter.id;
};

// GET /api/todos - Get all todos for authenticated user
todoRouter.get("/todos", getToken, async (req, res) => {
  try {
    const userTodos = await TodoModel.find({
      userEmail: req.userMessage.email,
    });
    res.json(userTodos);
  } catch (error) {
    logger.error({ error }, "获取todo列表失败");
    res.status(500).json({ message: "获取todo列表失败" });
  }
});

// POST /api/todos - Create a new todo
todoRouter.post(
  "/todos",
  getToken,
  checkSchema(todoSchema),
  async (req, res) => {
    const validationResults = validationResult(req);
    if (!validationResults.isEmpty()) {
      logger.error(validationResults, "todo创建请求体格式错误");
      return res.status(400).json({
        message: "请求体格式错误",
        errors: validationResults.array(),
      });
    }

    try {
      let data = matchedData(req);
      data.id = await selfIncrement();
      data.userEmail = req.userMessage.email;
      const newTodo = new TodoModel(data);
      await newTodo.save();
      res.status(201).json(newTodo);
    } catch (error) {
      logger.error({ error }, "todo创建失败");
      res.status(500).json({ message: "todo创建失败" });
    }
  }
);

// PUT /api/todos/:id - Update a todo
todoRouter.put(
  "/todos/:id",
  getToken,
  checkSchema(todoSchema),
  async (req, res) => {
    const validationResults = validationResult(req);
    if (!validationResults.isEmpty()) {
      logger.error(validationResults, "todo更新请求体格式错误");
      return res.status(400).json({
        message: "请求体格式错误",
        errors: validationResults.array(),
      });
    }

    try {
      const todoId = parseInt(req.params.id);
      const data = matchedData(req);
      const result = await TodoModel.updateOne(
        { id: todoId, userEmail: req.userMessage.email },
        { ...data, updateAt: new Date() }
      );
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Todo未找到或未修改" });
      }

      res.json({ message: "Todo更新成功", result });
    } catch (error) {
      logger.error({ error }, "todo更新失败");
      res.status(500).json({ message: "todo更新失败" });
    }
  }
);

// PATCH /api/todos/:id/toggle - Toggle todo completion status
todoRouter.patch("/todos/:id/toggle", getToken, async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todo = await TodoModel.findOne({
      id: todoId,
      userEmail: req.userMessage.email,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo未找到" });
    }
    const result = await TodoModel.updateOne(
      { id: todoId, userEmail: req.userMessage.email },
      { completed: !todo.completed, updatedAt: new Date() }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Todo未找到或未修改" });
    }

    res.json({ message: "完成状态更新成功", result });
  } catch (error) {
    logger.error({ error }, "完成状态更新失败");
    res.status(500).json({ message: "完成状态更新失败" });
  }
});

// DELETE /api/todos/:id - Delete a todo
todoRouter.delete("/todos/:id", getToken, async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const deletedTodo = await TodoModel.deleteOne({
      id: todoId,
      userEmail: req.userMessage.email,
    });
    logger.info(deletedTodo);

    if (deletedTodo.deletedCount === 1) {
      return res
        .status(200)
        .json({ message: "Todo删除成功", todo: deletedTodo });
    } else {
      return res.status(404).json({ message: "Todo未找到" });
    }
  } catch (error) {
    logger.error({ error }, "todo删除失败");
    res.status(500).json({ message: "todo删除失败" });
  }
});

export default todoRouter;

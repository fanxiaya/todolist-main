import { checkSchema, validationResult } from "express-validator";
import UserModel from "../model/userModel.mjs";
import loginSchema from "../schema/loginSchema.mjs";
import logger from "../logger/logger.mjs";
import { verifyJWT } from "../utils/jwtUtils.mjs";

//拿到login请求时的request.body的邮箱和密码，找到collection里的对象后附到request.user上
const checkUser = [
  checkSchema(loginSchema),
  async (request, response, next) => {
    const validationResults = validationResult(request);
    if (!validationResults.isEmpty()) {
      logger.error(validationResults, "post请求体格式错误");
      return response.status(400).send("post请求体格式错误,请重新发送!");
    }

    if (request.headers.authorization) {
      const token = request.headers.authorization.split(" ")[1];
      try {
        const payload = await verifyJWT(token);
        const userMessage = await UserModel.findOne({
          email: payload.email,
          password: payload.password,
        });
        if (userMessage) {
          return response.status(201).send({ message: "用户已登录" });
        }
      } catch (error) {
        if (error.code === "ERR_JWT_EXPIRED") {
          return response.status(401).json({ message: "token过期,重新登录" });
        }
        logger.error({ error }, "登录时携带的token验证失败");
        return response
          .status(400)
          .json({ message: "token验证失败,user身份信息不匹配" });
      }
    }

    const { email, password } = request.body;

    try {
      const user = await UserModel.findOne({
        email,
        password,
      });
      if (!user) {
        logger.error({ email }, "没找到对应的注册用户");
        return response.status(400).json({ message: "没找到对应的注册用户！" });
      }
      request.userMessage = { email, password };
    } catch (error) {
      logger.error({ error }, "查找user时出现错误");
      return response.status(400).json({ message: "查找user时出现错误" });
    }

    next();
  },
];

//获取token的中间件

const getToken = async (request, response, next) => {
  //拿到请求头里的token 解构出payload拿到user信息并返回
  if (!request.headers.authorization) {
    return response.status(400).json({ message: "无token值" });
  }
  const token = request.headers.authorization.split(" ")[1];

  try {
    const payload = await verifyJWT(token);
    request.userMessage = payload;
  } catch (error) {
    logger.error({ error }, "验证token失败");
    return response.status(400).json({ message: "验证token失败" });
  }
  next();
};

const globalErrorHandler = (_err, _request, response, _next) => {
  response.status(500).send("global bug!");
};

export { getToken, checkUser, globalErrorHandler };

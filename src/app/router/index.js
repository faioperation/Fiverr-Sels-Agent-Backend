import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { OtpRouter } from "../modules/otp/otp.route.js";
import { UserRoutes } from "../modules/user/user.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";
import { ConversationRoutes } from "../modules/users/conversation/conversation.route.js";
import { MessageRoutes } from "../modules/users/message/message.route.js";
import { AgentTrainingRoutes } from "../modules/agentTraining/agentTraining.route.js";
import { PublicApiRoutes } from "../modules/publicApi/publicApi.route.js";
import { AddUserRoutes } from "../modules/add-user/addUser.route.js";
import { CategoryRoutes } from "../modules/category/category.route.js";



export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/otp",
    route: OtpRouter,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/conversation",
    route: ConversationRoutes,
  },
  {
    path: "/message",
    route: MessageRoutes,
  },
  {
    path: "/agent-training",
    route: AgentTrainingRoutes,
  },
  {
    path: "/public",
    route: PublicApiRoutes,
  },
  {
    path: "/admin/add-user",
    route: AddUserRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
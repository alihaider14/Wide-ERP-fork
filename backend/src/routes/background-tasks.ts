import { Router} from "express";

import authenticateJWT from "~/middlewares/validate-token";
import {getBackgroundTasks} from "~/controllers/background-tasks/getBackgroundTasks";
import { updateBackgroundTaskStatus } from "~/controllers/background-tasks/updateBackgroundTaskStatus";

const router = Router();

router.get(
  "/background-tasks",
  authenticateJWT("view_background_tasks"),
  getBackgroundTasks,
);

router.patch(
  "/background-tasks/:id/status",
  authenticateJWT("view_background_tasks"),
  updateBackgroundTaskStatus,
);

export default router;

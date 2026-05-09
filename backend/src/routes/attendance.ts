import express from "express";
import {getAttendance} from "~/controllers/attendance/getAttendance";
import {manualAttendance} from "~/controllers/attendance/manualAttendance";
import {updateAttendance} from "~/controllers/attendance/updateAttendance";
import authenticateJWT from "~/middlewares/validate-token";

export default (router: express.Router) => {
  router.post(
    "/manual-attendance",
    authenticateJWT("view_attendance"),
    manualAttendance,
  );
  router.put("/attendance", authenticateJWT("view_attendance"), updateAttendance);
  router.get("/attendance", authenticateJWT("view_attendance"), getAttendance);
};

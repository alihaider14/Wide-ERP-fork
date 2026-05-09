import { Router } from "express";
import { getActivities } from "~/controllers/activity/getActivities";

export default (router: Router) => {
    router.get("/activities", getActivities);
};
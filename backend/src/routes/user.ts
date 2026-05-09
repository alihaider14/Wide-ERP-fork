import express from "express";
import authenticateJWT from "~/middlewares/validate-token";
import { addUser } from "~/controllers/users/addUser";
import { updateUser } from "~/controllers/users/updateUser";
import { getUsers } from "~/controllers/users/getUsers";
import { getUserById } from "~/controllers/users/getUserById";
import { deleteUserById } from "~/controllers/users/deleteUserById";
import { updateUserAccess } from "~/controllers/users/updateUserAccess";

export default (router: express.Router) => {
	router.post("/users", authenticateJWT("create_user"), addUser);
	router.put("/users", authenticateJWT("update_user"), updateUser);
	router.get("/users", authenticateJWT("view_users"), getUsers);
	router.get("/users/:id", authenticateJWT(), getUserById);
	router.delete("/users/:id", authenticateJWT("delete_user"), deleteUserById);
	router.put("/users-access", authenticateJWT("update_user"), updateUserAccess); 

};

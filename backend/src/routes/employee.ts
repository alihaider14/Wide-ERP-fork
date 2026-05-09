import express from "express";
import authenticateJWT from "~/middlewares/validate-token";
import { addEmployee } from "~/controllers/employees/addEmployee";
import { getEmployeeById } from "~/controllers/employees/getEmployeeById";
import { getEmployees } from "~/controllers/employees/getEmployees";
import { getEmployeeSalaries } from "~/controllers/employees/getEmployeeSalaries";
import { updateEmployee } from "~/controllers/employees/updateEmployee";
import { updateEmployeeStatus } from "~/controllers/employees/updateEmployeeStatus";
import { createEmployeeSalary } from "~/controllers/employees/createEmployeeSalary";
import { updateEmployeeSalary } from "~/controllers/employees/updateEmployeeSalary";
import { deleteEmployee } from "~/controllers/employees/deleteEmployee";

export default (router: express.Router) => {
	router.get("/employees", authenticateJWT("view_employees"), getEmployees);
	router.get("/employees/:id", authenticateJWT("view_employees"), getEmployeeById);
	router.get(
		"/employees/:id/salaries",
		authenticateJWT("view_employees"),
		getEmployeeSalaries,
	);
	router.post("/employees", authenticateJWT("create_employee"), addEmployee);
	router.post("/employee-salary", authenticateJWT("update_employee"), createEmployeeSalary);
	router.patch("/employee", authenticateJWT("update_employee"), updateEmployeeStatus);
	router.put("/employees", authenticateJWT("update_employee"), updateEmployee);
	router.put("/employee-salary", authenticateJWT("update_employee"), updateEmployeeSalary);
	router.delete("/employees", authenticateJWT("delete_employee"), deleteEmployee);
};

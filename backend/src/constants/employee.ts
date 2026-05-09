export const EMPLOYEE_NAME_REGEX = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;
export const EMPLOYEE_PHONE_REGEX = /^\+?\d{11,15}$/;
export const SHOP_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
export const PHONE_REGEX = /^(\+?[1-9]\d{7,14}|(?:\+92|92|0)?3\d{2}-?\d{7})$/;
export const NO_NEGATIVE_NUMBER = /^\d+(\.\d+)?$/;
export const POSTAL_CODE = /^\d{5}$/;

export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const VALID_DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
] as const;

import {TAttendance, TManualAttendance} from "@/types/Attendance";
import {axiosInstance} from "./axios-cofig";
import { formatDateQueryParam } from "@/helper/date-format";

export const manualAttendance = async (data: Partial<TAttendance>) => {
  const response = await axiosInstance.post("/manual-attendance", data);
  return response.data;
};

export const updateAttendance = async (data: TManualAttendance) => {
  const response = await axiosInstance.put("/attendance", data);
  return response.data;
};

export const getAttendance = async (
  pageNo = 1,
  pageSize = 10,
  search = "",
  from?: Date,
  to?: Date,
) => {
  let url = `/attendance?pageNo=${pageNo}&size=${pageSize}`;
  if (search) url += `&q=${search}`;
  if (from) url += `&from=${formatDateQueryParam(from)}`;
  if (to) url += `&to=${formatDateQueryParam(to)}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

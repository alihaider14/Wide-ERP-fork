import { validateWithZod } from "@/lib/handle-error";
import { axiosInstance } from "./axios-cofig";
import { updateTaskStatusSchema } from "@/validations/backgroundTask.schema";
import {
  IGetBackgroundTasksParams,
  IGetBackgroundTasksResponse,
  UpdateBackgroundTaskStatusInput,
} from "@/types/background-task";

export const getBackgroundTasks = async ({
  page = 1,
  size = 10,
  from,
  to,
  search,
}: IGetBackgroundTasksParams = {}): Promise<IGetBackgroundTasksResponse> => {
  let url = `/background-tasks?page=${page}&size=${size}`;

  if (from) url += `&from=${from}`;
  if (to) url += `&to=${to}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const updateBackgroundTaskStatus = async ({
  id,
  status,
}: UpdateBackgroundTaskStatusInput) => {
  const validatedData = await validateWithZod(updateTaskStatusSchema, {status});
  const {data} = await axiosInstance.patch(`/background-tasks/${id}/status`, validatedData);
  return data;
};
export interface IBackgroundTask {
  _id: string;
  task_no: number;
  task?: string;
  note?: string;
  type: string;
  status: string;
  last_run_at: string;
  createdAt: string;
  updatedAt?: string;
  collection_name?: string;
  doc_id?: string;
}

export interface IGetBackgroundTasksResponse {
  tasks: IBackgroundTask[];
  total: number;
  page: number;
  total_pages: number;
}

export interface IGetBackgroundTasksParams {
  page?: number;
  size?: number;
  from?: string;
  to?: string;
  search?: string;
}

export type UpdateBackgroundTaskStatusInput = {
  id: string;
  status: "Active" | "Paused";
};

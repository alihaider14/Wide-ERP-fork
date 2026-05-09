export interface IActivity {
  _id: string;
  date_time: string;
  activites: string;
  module_id: string;
  activist_id: string;
  created_at: string;
  updated_at: string;
}

export interface IGetActivitiesResponse {
  data: IActivity[];
  total: number;
  page: number;
  total_pages: number;
}

export interface IGetActivitiesParams {
  page?: number;
  size?: number;
  from?: string;
  to?: string;
}

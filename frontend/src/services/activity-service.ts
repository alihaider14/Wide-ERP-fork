import { axiosInstance } from './axios-cofig';
import { IGetActivitiesParams, IGetActivitiesResponse } from '@/types/activity-service';

export const getActivities = async ({
  page = 1,
  size = 50,
  from,
  to,
}: IGetActivitiesParams = {}): Promise<IGetActivitiesResponse> => {
  let url = `/activities?page=${page}&size=${size}`;
  
  if (from) {
    url += `&from=${from}`;
  }
  
  if (to) {
    url += `&to=${to}`;
  }

  const response = await axiosInstance.get(url);
  return response.data;
};

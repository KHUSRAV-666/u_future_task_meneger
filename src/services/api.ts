import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
}

interface GetTasksResponse {
  tasks: Task[];
  totalCount: number;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], number>({
      query: (page = 1) => `/todos?_page=${page}&_limit=10`,  // Пагинация
    }),
  }),
});

export const { useGetTasksQuery } = api;
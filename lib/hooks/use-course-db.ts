import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api/fetch";
import { type Course } from "@/lib/types/index";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

// 获取课程列表
export const useCourseList = () => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      return await fetchApi<Course[]>("course/list");
    },
  });
};

// 获取课程详情
export const useCourseDetail = (courseId: string) => {
  return useQuery<Course | null>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      return await fetchApi<Course>(`course/detail/${courseId}`);
    },
    enabled: !!courseId,
  });
};

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api/fetch";
import { Course } from "@/lib/types";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

interface CourseListResponse {
  courses: Course[];
}

interface CourseDetailResponse {
  course: Course;
}

// 获取课程列表
export const useCourseList = () => {
  return useQuery<ApiResponse<Course[]>>({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch(`/api/course/list`);
      const data = await res.json();
      return data.data;
    },
  });
};

// 获取课程详情
export const useCourseDetail = (courseId: number) => {
  return useQuery<ApiResponse<Course>>({
    queryKey: ["course", courseId],
    queryFn: () => fetch(`/api/course/detail/${courseId}`),
    enabled: !!courseId,
  });
};

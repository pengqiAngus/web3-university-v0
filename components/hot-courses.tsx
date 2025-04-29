"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCourseList } from "@/lib/hooks/use-course-db";
import ComponentLoading from "@/components/loading/ComponentLoading";
export default function HotCourses() {
  const { data, isLoading, error } = useCourseList();
  const hotCourse = data?.slice(0, 6) || [];

  return (
    <section className="py-20 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 from-black via-purple-950/5 to-black pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hot{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Courses
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our most popular courses that are helping students master blockchain
            technology and Web3 development
          </p>
        </motion.div>
        {isLoading ? (
          <ComponentLoading />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {hotCourse?.map((course, index) => (
              <motion.div
                className={`w-full ${
                  index % 3 === 0 || index % 3 === 2 ? "pt-10" : "pb-10"
                }`}
                key={course.id}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <Link href={`/courses/${course.id}`}>
                  <Card className="border-none relative bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-xl text-white overflow-hidden transition-all duration-500 cursor-pointer group">
                    {/* 渐变边框效果 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-300/5 via-transparent to-purple-300/5 z-0" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 z-0" />
                    {/* 发光边框效果 */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-purple-300/10 to-transparent blur-sm group-hover:via-purple-300/30 transition-all duration-700" />

                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-300/10 via-transparent to-purple-300/10 z-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity blur-xl" />
                        <img
                          src={course.imgUrl || "/placeholder.svg"}
                          alt={course.name}
                          className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      </div>

                      <CardContent className="relative z-20 p-6 bg-gradient-to-b from-transparent via-black/50 to-black/50">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />

                        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-white transition-all duration-500">
                          {course.name}
                        </h3>

                        <p className="text-gray-300 text-sm mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-300/10 group-hover:border-purple-300/20 transition-colors">
                            <Clock className="h-4 w-4 text-purple-400" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-300/10 group-hover:border-purple-300/20 transition-colors">
                            <BookOpen className="h-4 w-4 text-purple-400" />
                            <span>{course.category}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-300/10 group-hover:border-purple-300/20 transition-colors">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{course.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8">
          <Link href="/courses">
            <Button className="bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

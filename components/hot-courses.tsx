"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { useCourseList } from "@/lib/hooks/use-course-db";

export default function HotCourses() {
  const { data, isLoading, error } = useCourseList();

  const hotCourse = data?.slice(0, 6) || [];
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

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

        <style jsx global>{`
          .my-masonry-grid {
            display: flex;
            width: auto;
            gap: 2rem;
          }
          .my-masonry-grid_column {
            padding: 0;
            background-clip: padding-box;
          }
          .my-masonry-grid_column > div {
            margin-bottom: 2rem;
          }
        `}</style>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {hotCourse?.map((course, index) => (
            <motion.div
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
                <Card className="bg-black/40 border border-purple-500/20 backdrop-blur-sm text-white hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer h-full group">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={course.imgUrl || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full text-white bg-purple-600/80 hover:bg-purple-600 group-hover:bg-purple-500 transition-colors">
                      View Course
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </Masonry>
      </div>
    </section>
  );
}

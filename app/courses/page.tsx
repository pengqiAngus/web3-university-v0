"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useCourseList } from "@/lib/hooks/use-course-db";

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useCourseList();
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial column setup
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredCourses = courses?.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Distribute courses into columns for waterfall layout
  const columnContents = Array.from({ length: columns }, () => []);

  filteredCourses?.forEach((course, index) => {
    columnContents[index % columns].push(course);
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Hexagon grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fillRule='evenodd'%3E%3Cg id='hexagons' fill='%239C92AC' fillOpacity='0.4' fillRule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "24px 42px",
        }}
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0  from-purple-900/30 via-transparent to-black/80"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <motion.h1
            className="text-4xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Video Content Creation Center
          </motion.h1>

          <motion.div
            className="max-w-md mx-auto mb-12 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white pl-10 backdrop-blur-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </motion.div>

          <motion.div
            className="flex flex-wrap -mx-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {columnContents.map((columnCourses, columnIndex) => (
              <div key={columnIndex} className="px-4 w-full sm:w-1/2 lg:w-1/3">
                <div className="space-y-8">
                  {columnCourses.map((course, index) => (
                    <motion.div key={course.id} variants={item}>
                      <Link href={`/courses/${course.id}`}>
                        <Card className="bg-black/40 border border-purple-500/20 backdrop-blur-sm text-white hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer h-full group">
                          <div className="relative overflow-hidden">
                            <img
                              src={course.imgUrl || "/placeholder.svg"}
                              alt={course.title}
                              className="w-full h-48 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl group-hover:text-purple-400 transition-colors">
                              {course.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="pb-2">
                            <p className="text-gray-400 text-sm mb-4">
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

                          <CardFooter>
                            <Button className="w-full bg-purple-600/80 hover:bg-purple-600 group-hover:bg-purple-500 transition-colors">
                              View Course
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

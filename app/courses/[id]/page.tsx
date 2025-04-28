"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  BookOpen,
  Clock,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import { useWeb3 } from "@/lib/context/web3-context";
import { motion } from "framer-motion";
import { useCourseDetail } from "@/lib/hooks/use-course-db";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { Course } from "@/lib/types/course";
import { Toaster, toast } from "sonner";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { courseContract, address, tokenBalance, setTokenBalance, ydContract } =
    useWeb3();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [hasCourse, setHasCourse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: course = {} as Course,
    isLoading,
    error,
  } = useCourseDetail(id as string);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!id) {
    return (
      <main className="min-h-screen bg-black relative overflow-hidden">
        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-12 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
            <p>The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <ErrorScreen />;
  }

  const buyCourse = async (courseId: string) => {
    try {
      setIsSubmitting(true);
      if (!courseContract || !address) {
        throw new Error("Please connect your wallet first");
      }
      if (!tokenBalance || Number(tokenBalance) < Number(course.price)) {
        throw new Error("Insufficient token balance to purchase this course");
      }

      // Show loading state
      toast.loading("Checking course information...");

      // Check if course exists
      try {
        const web2CourseId = course.id.toString();

        toast.loading("Processing transaction...", {
          description: "Please wait for confirmation",
        });

        // Call purchase method
        const tx = await courseContract.purchaseCourse(web2CourseId);
        await tx.wait();

        // Update user course status
        setHasCourse(true);

        // Update user token balance
        if (ydContract && address) {
          const newBalance = await ydContract.balanceOf(address);
          setTokenBalance(newBalance.toString());
        }

        toast.success("Purchase successful!", {
          description: "Course has been added to your learning list",
        });
      } catch (error) {
        console.error("Course check failed:", error);
        throw new Error("Course does not exist or is not on chain");
      }
    } catch (error) {
      console.error("Error purchasing course:", error);
      toast.error("Purchase failed", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const initUserCourses = async () => {
      if (courseContract && address) {
        try {
          const id = await courseContract.web2ToCourseId(course.id);
          const hasCourse = await courseContract.userCourses(address, id);
          setHasCourse(hasCourse);
        } catch (error) {
          console.error("Error initializing user courses:", error);
          toast.error("Failed to load your purchased courses");
        }
      }
    };
    if (course?.name) {
      initUserCourses();
    }
  }, [address, course]);

  const togglePlay = () => {
    if (!hasCourse) {
      toast.error("Please purchase the course first");
      return;
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return isLoading ? (
    <LoadingScreen
      title="Loading Courses..."
      subtitle="Please wait while we fetch the latest course information"
      status="Syncing course data..."
    />
  ) : (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <Toaster richColors position="top-center" />
      {/* Circuit board pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 304 304' width='304' height='304'%3E%3Cpath fill='%239C92AC' fillOpacity='0.4' d='M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V210h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0  from-purple-900/20 via-black/50 to-black"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black/70 rounded-lg overflow-hidden mb-6 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={course?.fileUrl}
                    className="w-full aspect-video"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={hasCourse ? togglePlay : undefined}
                    style={{ cursor: hasCourse ? "pointer" : "not-allowed" }}
                  />

                  {!isPlaying && address && hasCourse && (
                    <motion.div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                      onClick={togglePlay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="bg-purple-600 rounded-full p-4"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="h-8 w-8 text-white" />
                      </motion.div>
                    </motion.div>
                  )}

                  {!hasCourse && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white text-xl mb-4">
                          Please Purchase Course First
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {address && hasCourse && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlay}
                        className="text-white"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full"
                        style={{ width: `${progress}%` }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <motion.h1
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {course.name}
              </motion.h1>

              <motion.div
                className="flex flex-wrap gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{course.category}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Award className="h-5 w-5 mr-2" />
                  <span>Price: ${course.price}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <span className="text-gray-400">Created:</span>
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Tabs defaultValue="overview" className="mb-8">
                  <TabsList className="bg-black/50 border border-purple-500/20">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-purple-600"
                    >
                      Overview
                    </TabsTrigger>
                    {/* <TabsTrigger
                      value="curriculum"
                      className="data-[state=active]:bg-purple-600"
                    >
                      Curriculum
                    </TabsTrigger> */}
                  </TabsList>
                  <TabsContent value="overview" className="text-white mt-4">
                    <p className="text-gray-300 leading-relaxed">
                      {course.description}
                    </p>
                  </TabsContent>
                  <TabsContent value="curriculum" className="text-white mt-4">
                    <div className="space-y-4">
                      <Card className="bg-black/50 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                        <CardContent className="p-4">
                          <p className="text-gray-400">
                            Course content is being prepared...
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-black/50 border border-purple-500/20 backdrop-blur-sm text-white sticky top-4 shadow-lg shadow-purple-500/5">
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-4 group">
                    <img
                      src={course.imgUrl || "/placeholder.svg"}
                      alt={course.name}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                  </div>

                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Course Details
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span>{course.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span>{course.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span>${course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 relative overflow-hidden group"
                    onClick={() => {
                      buyCourse(course.id);
                    }}
                    disabled={isSubmitting || hasCourse}
                  >
                    <span className="relative z-10">
                      {isSubmitting
                        ? "Purchasing..."
                        : hasCourse
                        ? "Purchased"
                        : "Purchase Now"}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

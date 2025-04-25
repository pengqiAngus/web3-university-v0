"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/lib/web3-context";
import { motion } from "framer-motion";
import { X, ImageIcon, Video, Loader2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchApi, uploadFile } from "@/lib/api";

export default function UploadCoursePage() {
  const { address, connectWallet } = useWeb3();
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("beginner");
  const [duration, setDuration] = useState("");
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [courseVideo, setCourseVideo] = useState<string | null>(null);
  const [courseImageId, setCourseImageId] = useState<string | null>(null);
  const [courseVideoId, setCourseVideoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Validation state
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    price?: string;
    duration?: string;
    image?: string;
    video?: string;
  }>({});

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "图片大小不能超过 5MB" });
        return;
      }

      try {
        setIsUploading(true);
        // 读取文件预览
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCourseImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);

        // 上传文件到服务器
        const fileId = await uploadFile(file);
        setCourseImageId(fileId);
        setErrors({ ...errors, image: undefined });
        toast({
          title: "上传成功",
          description: "图片上传成功",
        });
      } catch (error) {
        setErrors({ ...errors, image: "图片上传失败，请重试" });
        toast({
          title: "上传失败",
          description: "图片上传失败，请重试",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Handle video upload
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setErrors({ ...errors, video: "视频大小不能超过 100MB" });
        return;
      }

      try {
        setIsUploading(true);
        // 读取文件预览
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCourseVideo(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);

        // 上传文件到服务器
        const fileId = await uploadFile(file);
        setCourseVideoId(fileId);
        setErrors({ ...errors, video: undefined });
        toast({
          title: "上传成功",
          description: "视频上传成功",
        });
      } catch (error) {
        setErrors({ ...errors, video: "视频上传失败，请重试" });
        toast({
          title: "上传失败",
          description: "视频上传失败，请重试",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setCourseImage(null);
    setCourseImageId(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Remove uploaded video
  const removeVideo = () => {
    setCourseVideo(null);
    setCourseVideoId(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: {
      name?: string;
      description?: string;
      price?: string;
      duration?: string;
      image?: string;
      video?: string;
    } = {};

    if (!courseName.trim()) {
      newErrors.name = "课程名称不能为空";
    }

    if (!description.trim()) {
      newErrors.description = "课程描述不能为空";
    } else if (description.length < 50) {
      newErrors.description = "课程描述至少需要 50 个字符";
    }

    if (!price.trim()) {
      newErrors.price = "价格不能为空";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "价格必须大于 0";
    }

    if (!duration.trim()) {
      newErrors.duration = "课程时长不能为空";
    } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      newErrors.duration = "课程时长必须大于 0";
    }

    if (!courseImageId) {
      newErrors.image = "请上传课程封面";
    }

    if (!courseVideoId) {
      newErrors.video = "请上传课程视频";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "验证错误",
        description: "请修复表单中的错误",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        title: courseName,
        description,
        price: Number(price),
        level,
        icon: "",
        tags: null,
        duration: Number(duration),
        imageId: courseImageId,
        videoId: courseVideoId,
      };

      const response = await fetchApi("/api/courses/confrim", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "课程上传成功",
        description: "您的课程已提交审核",
      });

      // 提交成功后跳转到课程列表页
      router.push("/courses");
    } catch (error) {
      console.error("提交课程失败:", error);
      toast({
        title: "上传失败",
        description: "上传课程时发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Circuit board pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 304 304' width='304' height='304'%3E%3Cpath fill='%239C92AC' fillOpacity='0.4' d='M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V210h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0  from-purple-900/20 via-black/50 to-black" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <motion.h1
            className="text-4xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Upload
            </span>{" "}
            New Course
          </motion.h1>

          {!address ? (
            <motion.div
              className="max-w-md mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-black/80 border border-purple-500/20 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle>Connect Your Wallet</CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect your wallet to upload a new course
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Button
                    onClick={connectWallet}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-black/80 border border-purple-500/20 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill in the details about your new course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="courseName">
                        Course Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className={`bg-black/50 border-purple-500/30 text-white ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="e.g. Blockchain Fundamentals"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`bg-black/50 border-purple-500/30 text-white min-h-[120px] ${
                          errors.description ? "border-red-500" : ""
                        }`}
                        placeholder="Provide a detailed description of your course"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Price (YDT) <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={`bg-black/50 border-purple-500/30 text-white pl-12 ${
                              errors.price ? "border-red-500" : ""
                            }`}
                            placeholder="e.g. 100"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                            YDT
                          </div>
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-sm">{errors.price}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">
                          Level <span className="text-red-500">*</span>
                        </Label>
                        <Select value={level} onValueChange={setLevel}>
                          <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="all-levels">
                              All Levels
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">
                          Duration (hours){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className={`bg-black/50 border-purple-500/30 text-white ${
                            errors.duration ? "border-red-500" : ""
                          }`}
                          placeholder="e.g. 4"
                        />
                        {errors.duration && (
                          <p className="text-red-500 text-sm">
                            {errors.duration}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="courseImage">
                          Course Image <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-black/90 border-purple-500/30 text-white">
                              <p>Recommended size: 1280x720px, max 5MB</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        id="courseImage"
                      />

                      {!courseImage ? (
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors ${
                            errors.image
                              ? "border-red-500"
                              : "border-purple-500/30"
                          }`}
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center">
                            <ImageIcon className="h-12 w-12 text-purple-500/50 mb-4" />
                            <p className="text-gray-400 mb-2">
                              Click to upload course thumbnail
                            </p>
                            <p className="text-gray-500 text-sm">
                              PNG, JPG or WEBP (max. 5MB)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden border border-purple-500/30">
                          <img
                            src={courseImage || "/placeholder.svg"}
                            alt="Course thumbnail preview"
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {errors.image && (
                        <p className="text-red-500 text-sm">{errors.image}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="courseVideo">
                          Course Video <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-black/90 border-purple-500/30 text-white">
                              <p>Supported formats: MP4, WebM, max 100MB</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <input
                        type="file"
                        ref={videoInputRef}
                        onChange={handleVideoChange}
                        accept="video/*"
                        className="hidden"
                        id="courseVideo"
                      />

                      {!courseVideo ? (
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors ${
                            errors.video
                              ? "border-red-500"
                              : "border-purple-500/30"
                          }`}
                          onClick={() => videoInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center">
                            <Video className="h-12 w-12 text-purple-500/50 mb-4" />
                            <p className="text-gray-400 mb-2">
                              Click to upload course video
                            </p>
                            <p className="text-gray-500 text-sm">
                              MP4 or WebM (max. 100MB)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden border border-purple-500/30">
                          <video
                            src={courseVideo}
                            controls
                            className="w-full h-48 object-cover bg-black"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={removeVideo}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {errors.video && (
                        <p className="text-red-500 text-sm">{errors.video}</p>
                      )}
                    </div>

                    <Alert className="bg-purple-900/20 border-purple-500/30">
                      <AlertDescription className="text-gray-300">
                        By uploading this course, you agree to our terms and
                        conditions. Your course will be reviewed before being
                        published.
                      </AlertDescription>
                    </Alert>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading Course...
                          </>
                        ) : (
                          "Upload Course"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="border-t border-purple-500/10 pt-4 text-center text-gray-400 text-sm">
                  Need help? Contact our support team at support@web3learn.com
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

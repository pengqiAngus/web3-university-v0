"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Clock, Star, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Sample course data (same as in courses page)
const HOT_COURSES = [
  {
    id: 1,
    title: "Blockchain Fundamentals",
    description: "Learn the basics of blockchain technology and how it works",
    image: "/placeholder.svg?height=200&width=400",
    duration: "4 hours",
    level: "Beginner",
    rating: 4.8,
    students: 1245,
  },
  {
    id: 2,
    title: "Smart Contract Development",
    description: "Build and deploy smart contracts on Ethereum",
    image: "/placeholder.svg?height=200&width=400",
    duration: "8 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 876,
  },
  {
    id: 3,
    title: "DeFi Protocols",
    description: "Understand decentralized finance protocols and applications",
    image: "/placeholder.svg?height=200&width=400",
    duration: "6 hours",
    level: "Advanced",
    rating: 4.7,
    students: 654,
  },
  {
    id: 4,
    title: "NFT Creation & Trading",
    description: "Create, mint and trade NFTs on various marketplaces",
    image: "/placeholder.svg?height=200&width=400",
    duration: "5 hours",
    level: "Intermediate",
    rating: 4.6,
    students: 932,
  },
  {
    id: 5,
    title: "Web3 Frontend Development",
    description: "Build decentralized applications with React and ethers.js",
    image: "/placeholder.svg?height=200&width=400",
    duration: "10 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 1087,
  },
  {
    id: 6,
    title: "Crypto Trading Strategies",
    description: "Learn effective trading strategies for cryptocurrency markets",
    image: "/placeholder.svg?height=200&width=400",
    duration: "7 hours",
    level: "All Levels",
    rating: 4.5,
    students: 1532,
  },
]

export default function HotCourses() {
  return (
    <section className="py-20 relative">
      {/* Gradient background */}
      <div className="absolute inset-0  from-black via-purple-950/5 to-black pointer-events-none" />

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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Courses</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our most popular courses that are helping students master blockchain technology and Web3 development
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {HOT_COURSES.map((course, index) => (
              <CarouselItem key={course.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/courses/${course.id}`}>
                    <Card className="bg-black/40 border border-purple-500/20 backdrop-blur-sm text-white hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer h-full group">
                      <div className="relative overflow-hidden">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-48 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

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
                        <Button className="w-full bg-purple-600/80 hover:bg-purple-600 group-hover:bg-purple-500 transition-colors">
                          View Course
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative static mr-2 bg-purple-600/20 hover:bg-purple-600/40 border-purple-500/30" />
            <CarouselNext className="relative static ml-2 bg-purple-600/20 hover:bg-purple-600/40 border-purple-500/30" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

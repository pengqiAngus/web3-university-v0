"use client"

import { motion } from "framer-motion"
import { Award, Users, BookOpen, Globe } from "lucide-react"

export default function AboutUs() {
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
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Us</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Empowering the next generation of blockchain developers and enthusiasts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl" />
              <div className="relative bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
                <p className="text-gray-300 leading-relaxed mb-6">
                  <span className="text-purple-400 font-semibold">Web3Learn</span> is a pioneering educational platform
                  dedicated to blockchain technology and Web3 development. Founded in 2023 by a team of blockchain
                  experts and educators, we're on a mission to make blockchain education accessible, engaging, and
                  rewarding.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our innovative approach combines comprehensive learning materials with hands-on projects and a
                  token-based reward system. By completing courses and contributing to our ecosystem, students earn YDT
                  tokens that can be used within our platform or exchanged for other cryptocurrencies.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col items-center text-center">
                <div className="bg-purple-600/20 p-3 rounded-full mb-4">
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Expert Instructors</h3>
                <p className="text-gray-400 text-sm">Learn from industry professionals with real-world experience</p>
              </div>

              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col items-center text-center">
                <div className="bg-purple-600/20 p-3 rounded-full mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Community Driven</h3>
                <p className="text-gray-400 text-sm">Join a thriving community of blockchain enthusiasts</p>
              </div>

              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col items-center text-center">
                <div className="bg-purple-600/20 p-3 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Practical Learning</h3>
                <p className="text-gray-400 text-sm">Build real projects that enhance your portfolio</p>
              </div>

              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 flex flex-col items-center text-center">
                <div className="bg-purple-600/20 p-3 rounded-full mb-4">
                  <Globe className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Global Access</h3>
                <p className="text-gray-400 text-sm">Learn from anywhere in the world, at your own pace</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

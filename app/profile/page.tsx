"use client"

import type React from "react"

import { useState, useRef } from "react"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Coins, User, Edit, Loader2, Database, Shield, Activity, Upload, X } from "lucide-react"
import { useWeb3 } from "@/lib/web3-context"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { address, balance, tokenBalance, username, profile, avatar, connectWallet, updateProfile } = useWeb3()
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState(username)
  const [newProfile, setNewProfile] = useState(profile)
  const [newAvatar, setNewAvatar] = useState(avatar)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call delay
    setTimeout(() => {
      updateProfile(newUsername, newProfile, newAvatar)
      setIsEditing(false)
      setIsSaving(false)
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewAvatar(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeAvatar = () => {
    setNewAvatar("")
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Tech-focused background */}
      <div className="absolute inset-0">
        {/* Binary code pattern */}
        <div className="absolute inset-0 opacity-5 overflow-hidden">
          <div className="absolute top-0 left-0 text-[8px] font-mono text-purple-500 leading-none whitespace-nowrap">
            {Array(100)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="opacity-30">
                  {Array(200)
                    .fill(0)
                    .map((_, j) => (Math.random() > 0.5 ? "1" : "0"))
                    .join("")}
                </div>
              ))}
          </div>
        </div>

        {/* Network nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="nodes" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="rgba(147, 51, 234, 0.8)" />
              <circle cx="25" cy="25" r="1" fill="rgba(147, 51, 234, 0.8)" />
              <circle cx="75" cy="25" r="1" fill="rgba(147, 51, 234, 0.8)" />
              <circle cx="25" cy="75" r="1" fill="rgba(147, 51, 234, 0.8)" />
              <circle cx="75" cy="75" r="1" fill="rgba(147, 51, 234, 0.8)" />
              <path
                d="M50,50 L25,25 M50,50 L75,25 M50,50 L25,75 M50,50 L75,75"
                stroke="rgba(147, 51, 234, 0.3)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#nodes)" />
        </svg>

        {/* Gradient overlay */}
        <div className="absolute inset-0  from-black via-purple-950/5 to-black" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <motion.h1
            className="text-4xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Blockchain Profile
            </span>
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
                    Connect your wallet to view and manage your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-black/80 border border-purple-500/20 w-full mb-8">
                  <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-purple-600">
                    <User className="mr-2 h-5 w-5" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="wallet" className="flex-1 data-[state=active]:bg-purple-600">
                    <Wallet className="mr-2 h-5 w-5" />
                    Wallet
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex-1 data-[state=active]:bg-purple-600">
                    <Shield className="mr-2 h-5 w-5" />
                    Security
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card className="bg-black/80 border border-purple-500/20 backdrop-blur-sm text-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-purple-500/10">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription className="text-gray-400">Manage your personal information</CardDescription>
                      </div>

                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsEditing(true)}
                          className="border-purple-500/30 text-purple-500"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      )}
                    </CardHeader>

                    <CardContent className="pt-6">
                      {isEditing ? (
                        <motion.div
                          className="space-y-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Avatar upload section */}
                          <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                              <Avatar className="h-24 w-24 border-2 border-purple-500/50">
                                <AvatarImage src={newAvatar || "/placeholder.svg?height=96&width=96"} alt={username} />
                                <AvatarFallback className="bg-purple-900 text-white text-xl">
                                  {newUsername.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {newAvatar && (
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                  onClick={removeAvatar}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={triggerFileInput}
                              className="border-purple-500/30 text-white"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Avatar
                            </Button>
                            <p className="text-xs text-gray-400 mt-2">Recommended: Square image, max 1MB</p>
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Username</label>
                            <Input
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className="bg-black/50 border-purple-500/30 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Bio</label>
                            <Textarea
                              value={newProfile}
                              onChange={(e) => setNewProfile(e.target.value)}
                              className="bg-black/50 border-purple-500/30 text-white min-h-[120px]"
                            />
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false)
                                setNewUsername(username)
                                setNewProfile(profile)
                                setNewAvatar(avatar)
                              }}
                              className="border-purple-500/30 text-white"
                              disabled={isSaving}
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="space-y-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex flex-col items-center mb-6">
                            <Avatar className="h-24 w-24 border-2 border-purple-500/50 mb-4">
                              <AvatarImage src={avatar || "/placeholder.svg?height=96&width=96"} alt={username} />
                              <AvatarFallback className="bg-purple-900 text-white text-xl">
                                {username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div>
                            <h3 className="text-sm text-gray-400 mb-1">Username</h3>
                            <p className="text-xl">{username}</p>
                          </div>

                          <div>
                            <h3 className="text-sm text-gray-400 mb-1">Bio</h3>
                            <p className="text-gray-300">{profile}</p>
                          </div>

                          <div>
                            <h3 className="text-sm text-gray-400 mb-1">Wallet Address</h3>
                            <div className="bg-black/50 p-2 rounded border border-purple-500/10 font-mono text-sm">
                              {address}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wallet">
                  <Card className="bg-black/80 border border-purple-500/20 backdrop-blur-sm text-white">
                    <CardHeader className="border-b border-purple-500/10">
                      <CardTitle>Wallet Information</CardTitle>
                      <CardDescription className="text-gray-400">
                        View your wallet details and token balances
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                          className="bg-black/50 rounded-lg p-6 border border-purple-500/20"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="flex items-center mb-4">
                            <div className="bg-purple-600/20 p-3 rounded-full mr-4">
                              <Database className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">Blockchain Data</h3>
                              <p className="text-gray-400 text-sm">Your on-chain information</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded border border-purple-500/10">
                              <span className="text-gray-400">Address</span>
                              <span className="font-mono text-xs">
                                {address?.substring(0, 8)}...{address?.substring(address.length - 6)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded border border-purple-500/10">
                              <span className="text-gray-400">Network</span>
                              <span className="text-green-400">Ethereum Mainnet</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-black/50 rounded border border-purple-500/10">
                              <span className="text-gray-400">Status</span>
                              <span className="flex items-center">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                Connected
                              </span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <Button variant="outline" className="w-full border-purple-500/30 text-white">
                              View on Etherscan
                            </Button>
                          </div>
                        </motion.div>

                        <motion.div
                          className="bg-black/50 rounded-lg p-6 border border-purple-500/20"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <div className="flex items-center mb-4">
                            <div className="bg-purple-600/20 p-3 rounded-full mr-4">
                              <Coins className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">Token Balances</h3>
                              <p className="text-gray-400 text-sm">Your available tokens</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-black/50 rounded border border-purple-500/10">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-xs">ETH</span>
                                </div>
                                <div>
                                  <div>Ethereum</div>
                                  <div className="text-xs text-gray-400">Native Token</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div>{balance} ETH</div>
                                <div className="text-xs text-gray-400">≈ $1,800.00 USD</div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-black/50 rounded border border-purple-500/10">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-xs">YDT</span>
                                </div>
                                <div>
                                  <div>Yideng Token</div>
                                  <div className="text-xs text-gray-400">ERC-20</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div>{tokenBalance} YDT</div>
                                <div className="text-xs text-gray-400">≈ $500.00 USD</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Transaction history */}
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Activity className="h-5 w-5 mr-2 text-purple-500" />
                          Recent Transactions
                        </h3>
                        <div className="bg-black/50 rounded-lg border border-purple-500/20 overflow-hidden">
                          <div className="p-3 text-sm text-gray-400 border-b border-purple-500/10 flex justify-between">
                            <span>Type</span>
                            <span>Amount</span>
                            <span>Status</span>
                            <span>Date</span>
                          </div>
                          <div className="p-3 text-sm border-b border-purple-500/10 flex justify-between items-center">
                            <span className="flex items-center">
                              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                              Received
                            </span>
                            <span>0.5 ETH</span>
                            <span className="text-green-400">Confirmed</span>
                            <span>2 days ago</span>
                          </div>
                          <div className="p-3 text-sm border-b border-purple-500/10 flex justify-between items-center">
                            <span className="flex items-center">
                              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                              Sent
                            </span>
                            <span>1000 YDT</span>
                            <span className="text-green-400">Confirmed</span>
                            <span>5 days ago</span>
                          </div>
                          <div className="p-3 text-sm flex justify-between items-center">
                            <span className="flex items-center">
                              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                              Swap
                            </span>
                            <span>0.2 ETH → 200 YDT</span>
                            <span className="text-green-400">Confirmed</span>
                            <span>1 week ago</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card className="bg-black/80 border border-purple-500/20 backdrop-blur-sm text-white">
                    <CardHeader className="border-b border-purple-500/10">
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your account security and permissions
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-purple-500 mr-2" />
                              <h3 className="font-medium">Contract Approvals</h3>
                            </div>
                            <Button variant="outline" size="sm" className="border-purple-500/30 text-white">
                              Manage
                            </Button>
                          </div>
                          <p className="text-sm text-gray-400">
                            Review and revoke smart contract approvals to protect your assets.
                          </p>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Database className="h-5 w-5 text-purple-500 mr-2" />
                              <h3 className="font-medium">Connected dApps</h3>
                            </div>
                            <Button variant="outline" size="sm" className="border-purple-500/30 text-white">
                              View All
                            </Button>
                          </div>
                          <div className="text-sm text-gray-400">
                            <div className="flex justify-between items-center p-2 border-b border-purple-500/10">
                              <span>Web3Learn</span>
                              <span className="text-green-400">Active</span>
                            </div>
                            <div className="flex justify-between items-center p-2">
                              <span>Uniswap</span>
                              <span className="text-gray-500">Inactive</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Activity className="h-5 w-5 text-purple-500 mr-2" />
                              <h3 className="font-medium">Activity Log</h3>
                            </div>
                            <Button variant="outline" size="sm" className="border-purple-500/30 text-white">
                              View All
                            </Button>
                          </div>
                          <div className="text-sm text-gray-400">
                            <div className="flex justify-between items-center p-2 border-b border-purple-500/10">
                              <span>Profile Updated</span>
                              <span>2 hours ago</span>
                            </div>
                            <div className="flex justify-between items-center p-2">
                              <span>Wallet Connected</span>
                              <span>3 days ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}

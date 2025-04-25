"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/lib/context/web3-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, ArrowUpDown, Wallet, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";

export default function SwapPage() {
  const { address, balance, tokenBalance, ydContract, signer } = useWeb3()
  const [ethAmount, setEthAmount] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isBuying, setIsBuying] = useState(true) // true: ETH -> Token, false: Token -> ETH
  const [exchangeRate, setExchangeRate] = useState(1000) // 1 ETH = 1000 YDT

  // 监听输入变化，自动计算兑换金额
  useEffect(() => {
    if (isBuying) {
      if (ethAmount) {
        const amount = Number(ethAmount) * exchangeRate
        setTokenAmount(amount.toString())
      } else {
        setTokenAmount("")
      }
    } else {
      if (tokenAmount) {
        const amount = Number(tokenAmount) / exchangeRate
        setEthAmount(amount.toString())
      } else {
        setEthAmount("")
      }
    }
  }, [ethAmount, tokenAmount, isBuying, exchangeRate])

  const handleFromInputChange = (value: string) => {
    if (isBuying) {
      setEthAmount(value)
    } else {
      setTokenAmount(value)
    }
  }

  const buyWithETH = async (ethAmount: string) => {
    if (!ydContract || !signer) return
    try {
      const amount = ethers.utils.parseEther(ethAmount)
      const tx = await ydContract.buyWithETH({ value: amount })
      await tx.wait()
    } catch (error) {
      console.error("Error buying tokens:", error)
      throw error
    }
  }

  const sellTokens = async (tokenAmount: string) => {
    if (!ydContract || !signer) return
    try {
      const amount = ethers.utils.parseEther(tokenAmount)
      const tx = await ydContract.sellTokens(amount)
      await tx.wait()
    } catch (error) {
      console.error("Error selling tokens:", error)
      throw error
    }
  }

  const handleBuyWithETH = async () => {
    if (!ethAmount) return
    try {
      setIsLoading(true)
      await buyWithETH(ethAmount)
      setEthAmount("")
    } catch (error) {
      console.error("Error buying tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSellTokens = async () => {
    if (!tokenAmount) return
    try {
      setIsLoading(true)
      await sellTokens(tokenAmount)
      setTokenAmount("")
    } catch (error) {
      console.error("Error selling tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwapDirection = () => {
    setIsBuying(!isBuying)
    // 交换输入值
    const temp = ethAmount
    setEthAmount(tokenAmount)
    setTokenAmount(temp)
  }

  const handleSwap = async () => {
    if (isBuying) {
      await handleBuyWithETH()
    } else {
      await handleSellTokens()
    }
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Tech-focused background */}
      <div className="absolute inset-0">
        {/* Digital grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(147, 51, 234, 0.1) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Circuit lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M100,0 L100,50 L150,50 L150,100 L200,100 M0,100 L50,100 L50,150 L100,150 L100,200 M100,100 L150,150 M50,50 L100,100"
                fill="none"
                stroke="rgba(147, 51, 234, 0.8)"
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit)" />
        </svg>

        {/* Gradient overlay */}
        <div className="absolute inset-0  from-black via-purple-950/10 to-black" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-black/80 border border-purple-500/20 backdrop-blur-sm text-white shadow-md">
                <CardHeader className="border-b border-purple-500/10 pb-4">
                  <CardTitle className="text-2xl text-center">
                    <span className="text-purple-400">ETH</span> / <span className="text-pink-400">YDT</span> Swap
                  </CardTitle>
                  <CardDescription className="text-center text-gray-400">
                    {isBuying 
                      ? "Exchange your ETH for Yideng tokens to access premium courses"
                      : "Exchange your Yideng tokens back to ETH"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  {!address ? (
                    <div className="text-center py-8">
                      <p className="mb-4 text-gray-400">Connect your wallet to swap tokens</p>
                      <div className="flex justify-center">
                        <ConnectButton.Custom>
                          {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            mounted,
                          }) => {
                            return (
                              <div
                                {...(!mounted && {
                                  'aria-hidden': true,
                                  'style': {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                  },
                                })}
                              >
                                {(() => {
                                  if (!mounted || !account || !chain) {
                                    return (
                                      <button
                                        onClick={openConnectModal}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                                      >
                                        Connect Wallet
                                      </button>
                                    )
                                  }
                                })()}
                              </div>
                            )
                          }}
                        </ConnectButton.Custom>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-sm text-gray-400">From</span>
                        <span className="text-sm text-gray-400">
                          Balance: {isBuying ? balance : tokenBalance} {isBuying ? "ETH" : "YDT"}
                        </span>
                      </div>
                      <div className="mb-6 relative">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={isBuying ? ethAmount : tokenAmount}
                          onChange={(e) => handleFromInputChange(e.target.value)}
                          className="bg-black/50 border-purple-500/30 text-white p-6 text-xl"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 px-2 py-1 rounded text-sm">
                          {isBuying ? "ETH" : "YDT"}
                        </div>
                      </div>

                      <div className="flex justify-center my-4">
                        <button
                          onClick={handleSwapDirection}
                          className="bg-purple-600/20 p-2 rounded-full hover:bg-purple-600/30 transition-colors"
                        >
                          <ArrowUpDown className="h-6 w-6 text-purple-500" />
                        </button>
                      </div>

                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-sm text-gray-400">To</span>
                        <span className="text-sm text-gray-400">
                          Balance: {isBuying ? tokenBalance : balance} {isBuying ? "YDT" : "ETH"}
                        </span>
                      </div>
                      <div className="mb-6 relative">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={isBuying ? tokenAmount : ethAmount}
                          readOnly
                          className="bg-black/50 border-purple-500/30 text-white p-6 text-xl opacity-70"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-pink-600 px-2 py-1 rounded text-sm">
                          {isBuying ? "YDT" : "ETH"}
                        </div>
                      </div>

                      {/* Exchange rate info */}
                      <div className="bg-purple-900/20 border border-purple-500/20 rounded p-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Exchange Rate</span>
                          <span className="text-white">1 ETH = {exchangeRate} YDT</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span className="text-gray-400">Network Fee</span>
                          <span className="text-white">0.001 ETH</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>

                <CardFooter className="border-t border-purple-500/10 pt-4">
                  {address && (
                    <Button
                      onClick={handleSwap}
                      disabled={isLoading || (!ethAmount && !tokenAmount)}
                      className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Swap...
                        </>
                      ) : (
                        isBuying ? "Buy Tokens" : "Sell Tokens"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>

            {/* Technical data display */}
            {address && (
              <motion.div
                className="mt-8 text-white text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-black/50 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-purple-400 mb-2 font-medium">Transaction Data</h3>
                  <div className="font-mono text-xs text-gray-400 overflow-x-auto">
                    <div className="mb-1">
                      Method: <span className="text-green-400">swap(address,uint256)</span>
                    </div>
                    <div className="mb-1">
                      Gas Estimate: <span className="text-yellow-400">~85,000</span>
                    </div>
                    <div>
                      Contract: <span className="text-blue-400">0x1234...7890</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

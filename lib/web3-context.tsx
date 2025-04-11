"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { YIDENG_TOKEN_ADDRESS, YIDENG_TOKEN_ABI, formatEther } from "@/lib/utils"

// Mock ethers library for the preview
const mockEthers = {
  BrowserProvider: class BrowserProvider {
    constructor(ethereum: any) {
      this.ethereum = ethereum
    }
    ethereum: any

    async getBalance(address: string) {
      return BigInt(1000000000000000000) // 1 ETH
    }

    async listAccounts() {
      if (this.ethereum?.request) {
        const accounts = await this.ethereum.request({ method: "eth_accounts" })
        return accounts.map((addr: string) => ({ address: addr }))
      }
      return []
    }
  },
  Contract: class Contract {
    constructor(address: string, abi: any, provider: any) {}

    async balanceOf(address: string) {
      return BigInt(5000000000000000000) // 5 tokens
    }
  },
  formatEther: (value: bigint) => {
    return (Number(value) / 1e18).toString()
  },
}

// Use mock ethers instead of importing the real one
const ethers = mockEthers

interface Web3ContextType {
  address: string | null
  balance: string
  tokenBalance: string
  username: string
  profile: string
  avatar: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  updateProfile: (newUsername: string, newProfile: string, newAvatar?: string) => void
  swapEthForToken: (ethAmount: string) => Promise<boolean>
  provider: ethers.BrowserProvider | null
  isConnected: boolean
}

const defaultContext: Web3ContextType = {
  address: null,
  balance: "0",
  tokenBalance: "0",
  username: "Web3 User",
  profile: "I'm new to Web3 learning!",
  avatar: "",
  connectWallet: async () => {},
  disconnectWallet: () => {},
  updateProfile: () => {},
  swapEthForToken: async () => false,
  provider: null,
  isConnected: false,
}

const Web3Context = createContext<Web3ContextType>(defaultContext)

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [tokenBalance, setTokenBalance] = useState("0")
  const [username, setUsername] = useState("Web3 User")
  const [profile, setProfile] = useState("I'm new to Web3 learning!")
  const [avatar, setAvatar] = useState("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  useEffect(() => {
    // Initialize provider and check for existing connection
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)

          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            const address = accounts[0].address
            setAddress(address)

            // Load user data from localStorage if exists
            const storedUsername = localStorage.getItem(`username_${address}`)
            const storedProfile = localStorage.getItem(`profile_${address}`)
            const storedAvatar = localStorage.getItem(`avatar_${address}`)

            if (storedUsername) setUsername(storedUsername)
            if (storedProfile) setProfile(storedProfile)
            if (storedAvatar) setAvatar(storedAvatar)

            // Get ETH balance
            const ethBalance = await provider.getBalance(address)
            setBalance(ethers.formatEther(ethBalance))

            // Get token balance
            await updateTokenBalance(provider, address)
          }
        } catch (error) {
          console.error("Error initializing web3:", error)
        }
      }
    }

    init()

    // Setup event listeners for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          init() // Reinitialize with new account
        } else {
          setAddress(null)
          setBalance("0")
          setTokenBalance("0")
          setUsername("Web3 User")
          setProfile("I'm new to Web3 learning!")
          setAvatar("")
        }
      })
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  // Update token balance
  const updateTokenBalance = async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const tokenContract = new ethers.Contract(YIDENG_TOKEN_ADDRESS, YIDENG_TOKEN_ABI, provider)

      const balance = await tokenContract.balanceOf(address)
      setTokenBalance(ethers.formatEther(balance))
    } catch (error) {
      console.error("Error getting token balance:", error)
    }
  }

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(provider)

        await window.ethereum.request({ method: "eth_requestAccounts" })
        const accounts = await provider.listAccounts()

        if (accounts.length > 0) {
          const address = accounts[0].address
          setAddress(address)

          // Get ETH balance
          const ethBalance = await provider.getBalance(address)
          setBalance(ethers.formatEther(ethBalance))

          // Get token balance
          await updateTokenBalance(provider, address)

          // Load user data from localStorage if exists
          const storedUsername = localStorage.getItem(`username_${address}`)
          const storedProfile = localStorage.getItem(`profile_${address}`)
          const storedAvatar = localStorage.getItem(`avatar_${address}`)

          if (storedUsername) setUsername(storedUsername)
          if (storedProfile) setProfile(storedProfile)
          if (storedAvatar) setAvatar(storedAvatar)
        }
      } catch (error) {
        console.error("Error connecting wallet:", error)
      }
    } else {
      alert("Please install MetaMask to use this feature")
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAddress(null)
    setBalance("0")
    setTokenBalance("0")
    setUsername("Web3 User")
    setProfile("I'm new to Web3 learning!")
    setAvatar("")
    setProvider(null)
  }

  // Update profile
  const updateProfile = (newUsername: string, newProfile: string, newAvatar?: string) => {
    if (!address) return

    setUsername(newUsername)
    setProfile(newProfile)

    if (newAvatar !== undefined) {
      setAvatar(newAvatar)
      localStorage.setItem(`avatar_${address}`, newAvatar)
    }

    // Save to localStorage
    localStorage.setItem(`username_${address}`, newUsername)
    localStorage.setItem(`profile_${address}`, newProfile)
  }

  // Swap ETH for token (simplified implementation)
  const swapEthForToken = async (ethAmount: string): Promise<boolean> => {
    if (!address || !provider) return false

    try {
      // In a real implementation, this would call a swap contract
      // For this demo, we'll simulate a successful swap
      alert(`Swapped ${ethAmount} ETH for Yideng tokens (simulated)`)

      // Update balances after swap (in a real implementation, this would happen automatically)
      const ethBalance = await provider.getBalance(address)
      setBalance(formatEther(ethBalance))

      // Simulate token balance increase
      setTokenBalance((prev) => (Number(prev) + Number(ethAmount) * 1000).toString())

      return true
    } catch (error) {
      console.error("Error swapping tokens:", error)
      return false
    }
  }

  return (
    <Web3Context.Provider
      value={{
        address,
        balance,
        tokenBalance,
        username,
        profile,
        avatar,
        connectWallet,
        disconnectWallet,
        updateProfile,
        swapEthForToken,
        provider,
        isConnected: !!address,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

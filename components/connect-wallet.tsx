"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Coins } from "lucide-react"
import { shortenAddress } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ConnectWallet() {
  const { address, username, balance, tokenBalance, avatar, connectWallet, disconnectWallet } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (address) return

    try {
      setIsConnecting(true)
      await connectWallet()
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  if (!address) {
    return (
      <Button onClick={handleConnect} disabled={isConnecting} className="bg-purple-600 hover:bg-purple-700">
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-purple-500/10">
          <Avatar className="h-10 w-10 border-2 border-purple-500/50">
            <AvatarImage src={avatar || "/placeholder.svg?height=40&width=40"} alt={username} />
            <AvatarFallback className="bg-purple-900 text-white">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black/90 border border-purple-500/20 text-white" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-gray-400 font-mono">{shortenAddress(address)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex justify-between cursor-default">
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4 text-purple-400" />
              <span>ETH Balance</span>
            </div>
            <span>{balance}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between cursor-default">
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4 text-pink-400" />
              <span>YDT Balance</span>
            </div>
            <span>{tokenBalance}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10" onClick={handleDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

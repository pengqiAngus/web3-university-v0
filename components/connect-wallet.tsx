"use client";

import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Coins } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import { useWeb3 } from "@/lib/context/web3-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { getNonce, getToken } from "@/lib/api/user";
import { ethers } from "ethers";

export function ConnectWallet() {
  const {
    address,
    username,
    balance,
    tokenBalance,
    avatar,
    isConnected,
    isAuthenticated,
    setIsAuthenticated,
  } = useWeb3();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleLogin = async () => {
      if (address && isConnected && !isAuthenticated) {
        try {
          // 1. 获取 nonce
          const response = await getNonce(address);
          const nonce = response.data.nonce;
          // 2. 使用钱包签名
          if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const signature = await signer.signMessage(nonce);
            const { data:{token} } = await getToken(address, signature, nonce);
            localStorage.setItem("token", JSON.stringify(token));
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      }
    };
    const token = localStorage.getItem("token");
    if (address && isConnected && !isAuthenticated && !token) {
      handleLogin();
    }
  }, [address, isConnected, isAuthenticated, setIsAuthenticated]);

  if (!mounted) {
    return null;
  }

  if (!address) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button
            onClick={openConnectModal}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </ConnectButton.Custom>
    );
  }

  return (
    <ConnectButton.Custom>
      {({ openAccountModal }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 hover:bg-purple-500/10"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={avatar || "/placeholder.svg?height=40&width=40"}
                  alt={username}
                  className="border-2 border-purple-500/50 rounded-full"
                />
                <AvatarFallback className="bg-purple-900 text-white border-2 border-purple-500/50">
                  {username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-black/90 border border-purple-500/20 text-white"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{username}</p>
                <p className="text-xs text-gray-400 font-mono">
                  {shortenAddress(address)}
                </p>
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
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
              onClick={openAccountModal}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ConnectButton.Custom>
  );
}

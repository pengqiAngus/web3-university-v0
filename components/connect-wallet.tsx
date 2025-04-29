"use client";

import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Coins, User } from "lucide-react";
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
import { useEffect, useState, useCallback } from "react";
import { getNonce, getToken } from "@/lib/api/user";
import { ethers } from "ethers";
import Link from "next/link";

export function ConnectWallet() {
  const {
    address,
    username,
    balance,
    tokenBalance,
    avatarUrl,
    isConnected,
    setIsAuthenticated,
  } = useWeb3();
  const [mounted, setMounted] = useState(false);

  // 初始化时检查认证状态
  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理登录逻辑
  const handleLogin = useCallback(async () => {
    if (address && isConnected && mounted) {
      try {
        const response = await getNonce(address);
        const nonce = response.data.nonce;

        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const signature = await signer.signMessage(nonce);
          const {
            data: { token },
          } = await getToken(address, signature, nonce);
          localStorage.setItem("token", JSON.stringify(token));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  }, [address, isConnected, mounted, setIsAuthenticated]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      handleLogin();
    }
  }, [handleLogin]);

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
                  src={avatarUrl || "/placeholder.svg?height=40&width=40"}
                  alt={username}
                  className="border-2 border-purple-500/50 rounded-full"
                />
                <AvatarFallback className="bg-purple-900 text-white border-2 border-purple-500/50">
                  {username?.substring(0, 2).toUpperCase()}
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
              <Link href="/profile">
                <DropdownMenuItem className="flex justify-between cursor-pointer hover:bg-purple-500/10">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-purple-400" />
                    <span>Profile</span>
                  </div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="flex justify-between cursor-pointer hover:bg-purple-500/10">
                <div className="flex items-center">
                  <Coins className="mr-2 h-4 w-4 text-purple-400" />
                  <span>ETH Balance</span>
                </div>
                <span>{balance} ETH</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-between cursor-pointer hover:bg-purple-500/10">
                <div className="flex items-center">
                  <Coins className="mr-2 h-4 w-4 text-pink-400" />
                  <span>YDT Balance</span>
                </div>
                <span>{tokenBalance}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-purple-500/20" />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer hover:bg-red-500/10 cursor-pointer"
              onClick={openAccountModal}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="cursor-pointer">Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ConnectButton.Custom>
  );
}

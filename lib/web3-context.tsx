"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider, useAccount, useBalance, useContractRead } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "wagmi/chains";
import { YIDENG_TOKEN_ADDRESS, YIDENG_TOKEN_ABI } from "@/lib/utils";

const queryClient = new QueryClient();

const projectId = "YOUR_PROJECT_ID"; // 从 WalletConnect 获取

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: "Web3 University",
    projectId,
  }
);

const config = getDefaultConfig({
  appName: "Web3 University",
  projectId,
  chains: [mainnet, sepolia],
  connectors,
});

interface Web3ContextType {
  address: string | null;
  balance: string;
  tokenBalance: string;
  username: string;
  profile: string;
  avatar: string;
  updateProfile: (
    newUsername: string,
    newProfile: string,
    newAvatar?: string
  ) => void;
  isConnected: boolean;
}

const defaultContext: Web3ContextType = {
  address: null,
  balance: "0",
  tokenBalance: "0",
  username: "Web3 User",
  profile: "I'm new to Web3 learning!",
  avatar: "",
  updateProfile: () => {},
  isConnected: false,
};

const Web3Context = createContext<Web3ContextType>(defaultContext);

export const useWeb3 = () => useContext(Web3Context);

const Web3ProviderContent = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
  });
  const { data: tokenBalanceData } = useContractRead({
    address: YIDENG_TOKEN_ADDRESS,
    abi: YIDENG_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  const [username, setUsername] = useState("Web3 User");
  const [profile, setProfile] = useState("I'm new to Web3 learning!");
  const [avatar, setAvatar] = useState("");

  // Update profile
  const updateProfile = (
    newUsername: string,
    newProfile: string,
    newAvatar?: string
  ) => {
    if (!address) return;

    setUsername(newUsername);
    setProfile(newProfile);

    if (newAvatar !== undefined) {
      setAvatar(newAvatar);
      localStorage.setItem(`avatar_${address}`, newAvatar);
    }

    localStorage.setItem(`username_${address}`, newUsername);
    localStorage.setItem(`profile_${address}`, newProfile);
  };

  return (
    <Web3Context.Provider
      value={{
        address: address || null,
        balance: balanceData?.formatted || "0",
        tokenBalance: tokenBalanceData?.toString() || "0",
        username,
        profile,
        avatar,
        updateProfile,
        isConnected,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <Web3ProviderContent>{children}</Web3ProviderContent>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

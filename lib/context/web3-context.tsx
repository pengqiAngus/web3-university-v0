"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
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
import { WagmiProvider, useAccount, useBalance } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "wagmi/chains";
import { ethers } from "ethers";
import { YiDengToken__factory } from "@/typechain-types";
import { CourseMarket__factory } from "@/typechain-types";
import { FileInfo } from "@/lib/types/index";
import { useUserProfile } from "@/lib/hooks/use-user-profile";
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
    appName: " Video Content Creation",
    projectId,
  }
);

const config = getDefaultConfig({
  appName: " Video Content Creation",
  projectId,
  chains: [mainnet, sepolia],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  ssr: true,
});

const COURSE_MARKET_ADDRESS = "0x5DA45119233433327cD77D66EfCdA92edE57Ce78";
const YIDENG_TOKEN_ADDRESS = "0xb26BA51DAcc2F8e59CB87ECCD2eC73a2C3540d6f";
interface Web3ContextType {
  address: string | null;
  balance: string;
  tokenBalance: string;
  username: string;
  title: string;
  description: string;
  avatar: FileInfo;
  avatarUrl: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  updateProfile: (
    newUsername: string,
    newDescription: string,
    newTitle: string,
    newAvatar?: FileInfo
  ) => void;
  setTokenBalance: (tokenBalance: string) => void;
  setEthBalance: (ethBalance: string) => void;
  isConnected: boolean;
  ydContract: ethers.Contract | null;
  courseContract: ethers.Contract | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

const defaultContext: Web3ContextType = {
  address: null,
  balance: "0",
  tokenBalance: "0",
  username: "Web3 User",
  title: "",
  description: "I'm new to Web3 learning!",
  avatar: {
    id: "",
    size: 0,
    mimetype: "",
    title: "",
  },
  avatarUrl: "",
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  updateProfile: () => {},
  setTokenBalance: () => {},
  setEthBalance: () => {},
  isConnected: false,
  ydContract: null,
  courseContract: null,
  provider: null,
  signer: null,
};

const Web3Context = createContext<Web3ContextType>(defaultContext);

export const useWeb3 = () => useContext(Web3Context);

const Web3ProviderContent = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();

  const profile = useUserProfile(address);
  const { username, title, description, avatar, avatarUrl, updateProfile } =
    profile || defaultContext;
  const [ydContract, setYdContract] = useState<ethers.Contract | null>(null);
  const [courseContract, setCourseContract] = useState<ethers.Contract | null>(
    null
  );
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ethBalance, setEthBalance] = useState("0");

  useEffect(() => {
    const initContracts = async () => {
      if (window.ethereum && isConnected && address) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const ydContract = YiDengToken__factory.connect(
            YIDENG_TOKEN_ADDRESS,
            signer
          );
          const courseContract = CourseMarket__factory.connect(
            COURSE_MARKET_ADDRESS,
            signer
          );

          setProvider(provider);
          setSigner(signer);
          setYdContract(ydContract);
          setCourseContract(courseContract);

          // 初始化时获取余额
          const [tokenBalance, ethBalanceValue] = await Promise.all([
            ydContract.balanceOf(address),
            provider.getBalance(address),
          ]);

          setTokenBalance(tokenBalance.toString());
          setEthBalance(
            Number(ethers.utils.formatEther(ethBalanceValue)).toFixed(2)
          );
        } catch (error) {
          console.error("Error initializing contracts:", error);
        }
      }
    };

    initContracts();
  }, [isConnected, address]);

  // 监听余额变化
  useEffect(() => {
    if (!ydContract || !address || !provider) return;

    const updateBalance = async () => {
      try {
        const [tokenBalance, ethBalanceValue] = await Promise.all([
          ydContract.balanceOf(address),
          provider.getBalance(address),
        ]);

        setTokenBalance(tokenBalance.toString());
        setEthBalance(
          Number(ethers.utils.formatEther(ethBalanceValue)).toFixed(2)
        );
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    // 监听 Transfer 事件
    const filter = ydContract.filters.Transfer(null, address);
    ydContract.on(filter, updateBalance);

    // 初始更新一次余额
    updateBalance();

    return () => {
      ydContract.off(filter, updateBalance);
    };
  }, [ydContract, address, provider]);

  return (
    <Web3Context.Provider
      value={{
        address: address || null,
        balance: ethBalance,
        tokenBalance,
        username,
        title,
        description,
        avatar,
        avatarUrl,
        isAuthenticated,
        setIsAuthenticated,
        updateProfile,
        setTokenBalance,
        setEthBalance,
        isConnected,
        ydContract,
        courseContract,
        provider,
        signer,
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

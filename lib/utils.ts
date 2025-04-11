import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Web3 related utility functions
export const YIDENG_TOKEN_ADDRESS = "0x1234567890123456789012345678901234567890" // Replace with actual token address
export const YIDENG_TOKEN_ABI = [
  // ERC20 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]

export function formatEther(value: any): string {
  if (typeof value === "bigint") {
    return (Number(value) / 1e18).toFixed(4)
  }
  // Handle string or number
  return (Number(value) / 1e18).toFixed(4)
}

export function parseEther(value: string): any {
  // Return a number instead of BigInt for compatibility
  return Math.floor(Number(value) * 1e18)
}

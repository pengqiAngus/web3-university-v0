import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

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

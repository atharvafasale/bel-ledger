"use client";
import React, { useState, useEffect } from "react";
import {
  Alchemy,
  Network,
  Utils,
  BigNumber as AlchemyBigNumber,
} from "alchemy-sdk";
import {
  Copy,
  ExternalLink,
  Skull,
  ZapIcon,
  GithubIcon,
  Bomb,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import Image from "next/image";
import { ethers } from "ethers";
import { useLedger } from "@/components/LedgerContext";

const CHAIN_CONFIG = {
  "ETH-SEPOLIA": {
    network: Network.ETH_SEPOLIA,
    nativeCurrency: "ETH",
    explorer: "https://sepolia.etherscan.io",
    color: "#00FF00",
    isEVM: true,
    icon: <ZapIcon className="w-5 h-5 text-green-500" />,
  },
  BASE: {
    network: Network.BASE_MAINNET,
    nativeCurrency: "ETH",
    explorer: "https://base-sepolia.blockscout.com/",
    color: "#FF00FF",
    isEVM: true,
    icon: <Bomb className="w-5 h-5 text-pink-500" />,
  },
};

interface Token {
  name: string;
  symbol: string;
  balance: string;
  logo?: string;
}

export default function LedgerWalletHome() {
  const [selectedChain, setSelectedChain] =
    useState<keyof typeof CHAIN_CONFIG>("ETH-SEPOLIA");
  const [balance, setBalance] = useState<string>("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [copied, setCopied] = useState(false);
  const [alchemy, setAlchemy] = useState<Alchemy | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { isConnected, address } = useLedger();

  useEffect(() => {
    const initAlchemy = () => {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        network: CHAIN_CONFIG[selectedChain].network,
      };
      setAlchemy(new Alchemy(settings));
    };
    initAlchemy();
  }, [selectedChain]);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!alchemy || !isConnected || !address) return;

      setIsLoading(true);
      const loadingToast = toast.loading("HACKING THE BLOCKCHAIN...", {
        style: {
          background: "#000",
          color: "#00FF00",
          border: "1px solid #00FF00",
          fontFamily: "monospace",
        },
        icon: "⚡",
      });

      try {
        const balanceWei: AlchemyBigNumber = await alchemy.core.getBalance(
          address
        );
        const balanceEth = ethers.formatEther(balanceWei.toString());
        setBalance(parseFloat(balanceEth).toFixed(4));

        const punkTokens = [
          {
            name: "AnarchyCoin",
            symbol: "ANRCH",
            balance: (Math.random() * 1000).toFixed(2),
            logo: "https://api.placeholder.com/32",
          },
          {
            name: "CypherPunk",
            symbol: "CYPH",
            balance: (Math.random() * 42).toFixed(2),
            logo: "https://api.placeholder.com/32",
          },
          {
            name: "NeoToken",
            symbol: "NEO",
            balance: (Math.random() * 84).toFixed(2),
            logo: "https://api.placeholder.com/32",
          },
        ];

        setTokens(punkTokens);

        toast.success("DATA EXFILTRATION COMPLETE!", {
          id: loadingToast,
          style: {
            background: "#000",
            color: "#00FF00",
            border: "1px solid #00FF00",
            fontFamily: "monospace",
          },
          icon: "✓",
        });
      } catch (error) {
        toast.error("SYSTEM FAILURE: DATA CORRUPTED!", {
          id: loadingToast,
          style: {
            background: "#000",
            color: "#FF0000",
            border: "1px solid #FF0000",
            fontFamily: "monospace",
          },
          icon: "☠️",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (alchemy && isConnected && address) {
      fetchWalletData();
    }
  }, [alchemy, isConnected, address]);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("ADDRESS CLONED TO CLIPBOARD!", {
      style: {
        background: "#000",
        color: "#00FF00",
        border: "1px solid #00FF00",
        fontFamily: "monospace",
      },
      icon: "🔄",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen bg-black text-green-500 font-mono">
        <div className="border-2 border-green-500 p-10 rounded-md shadow-lg shadow-green-500/20 max-w-md mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-green-500 to-purple-500"></div>
          <Skull className="w-20 h-20 mx-auto mb-6 text-green-500" />
          <h1 className="text-4xl font-bold mb-6 glitch-text" style={{ textShadow: "0 0 5px #00FF00" }}>
            CONNECTION REQUIRED
          </h1>
          <p className="text-xl mb-6 typing-animation">
            &#62; PLEASE CONNECT LEDGER HARDWARE
          </p>
          <div className="w-full h-1 bg-green-500 mb-6 loading-bar"></div>
          <p className="text-xs text-green-300 blinking-cursor">
            WAITING FOR SECURE CONNECTION...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen font-mono text-green-500 relative overflow-hidden">
      {/* Additional JSX rendering wallet details and UI goes here */}
    </div>
  );
}

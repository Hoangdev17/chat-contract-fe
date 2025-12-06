import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWalletStore } from '@/store/wallet/wallet.store';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    ethereum?: any;
  }
}

function Home() {
  const { account, isConnected, setAccount, disconnect } = useWalletStore();
  const navigate = useNavigate();

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `user${address.slice(-5)}`;
  };

  // Avatar random dựa trên address
  const avatarUrl = useMemo(() => {
    if (!account) return '';
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${account}`;
  }, [account]);

  useEffect(() => {
    const checkWallet = async () => {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    };

    checkWallet();
  }, [setAccount]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Bạn cần cài MetaMask!');
      return;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setAccount(accounts[0]);
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">
            {isConnected ? 'Welcome back 👋' : 'Welcome to Chat Contract'}
          </CardTitle>
          <CardDescription>
            {isConnected
              ? 'You are successfully connected with your wallet'
              : 'Connect your wallet to start chatting'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          {!isConnected ? (
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          ) : (
            <>
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{account?.slice(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="text-lg font-semibold">{shortenAddress(account!)}</p>
                <p className="text-xs text-muted-foreground">Your address wallet: {account}</p>
              </div>

              <div className="w-full space-y-2">
                <Button className="w-full" onClick={() => navigate('/chat')}>
                  Enter Chat
                </Button>

                <Button variant="outline" className="w-full" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;

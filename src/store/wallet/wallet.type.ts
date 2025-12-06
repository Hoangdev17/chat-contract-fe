export interface WalletState {
  account: string | null;
  isConnected: boolean;
  setAccount: (account: string | null) => void;
  disconnect: () => void;
}

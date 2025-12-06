import { create } from 'zustand';
import type { WalletState } from './wallet.type';
import { devtools, persist } from 'zustand/middleware';

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      (set) => ({
        account: null,
        isConnected: false,

        setAccount: (account) => set({ account, isConnected: true }, false, 'wallet/setAccount'),

        disconnect: () => set({ account: null, isConnected: false }, false, 'wallet/disconnect'),
      }),
      {
        name: 'wallet-storage',
      }
    ),
    { name: 'WalletStore' }
  )
);

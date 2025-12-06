import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { MessageState, Message } from './message.type';
import { getChatContract } from '@/lib/contract';

export const useMessageStore = create<MessageState>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        conversationIds: [],
        receiver: null,

        setReceiver: (address) => set({ receiver: address }, false, 'message/setReceiver'),

        setMessages: (messages: Message[]) => set({ messages }, false, 'message/setMessages'),

        fetchUserConverastion: async (user: string) => {
          const { contract } = await getChatContract();
          const result: string[] = await contract.getUserConversations(user);
          set({ conversationIds: result }, false, 'message/setConversationIds');
        },

        fetchConversation: async (partner: string) => {
          try {
            const { contract } = await getChatContract();

            const result: any[] = await contract.getConversation(partner);

            const messages = result.map((item: any) => ({
              sender: item.sender,
              content: item.content,
              timestamp: Number(item.timestamp),
            }));

            set({ messages }, false, 'message/setMessages');
          } catch (err) {
            console.error('Error fetching conversation:', err);
            set({ messages: [] });
          }
        },

        sendMessage: async (receiver: string, content: string) => {
          try {
            if (!receiver) throw new Error('Receiver not set');

            const { contract } = await getChatContract();

            const tx = await contract.sendMessage(receiver, content);

            const receipt = await tx.wait();

            return receipt;
          } catch (err) {
            console.error('Failed to send message:', err);
            throw err;
          }
        },

        deleteMessage: async (partner: string, index: number) => {
          try {
            const { contract } = await getChatContract();
            const tx = await contract.deleteMessage(partner, index);
            await tx.wait();

            const { messages } = get();
            const updatedMessages = messages.filter((_, i) => i !== index);
            set({ messages: updatedMessages }, false, 'message/deleteMessage');
          } catch (err) {
            console.error('Failed to delete message:', err);
            throw err;
          }
        },

        clearConversation: async (partner: string) => {
          try {
            const { contract } = await getChatContract();
            const tx = await contract.clearConversation(partner);
            await tx.wait();
            set({ messages: [] }, false, 'message/clearMessages');
          } catch (err) {
            console.error('Failed to clear conversation:', err);
            throw err;
          }
        },
      }),
      {
        name: 'message-storage',
      }
    ),
    { name: 'MessageStore' }
  )
);

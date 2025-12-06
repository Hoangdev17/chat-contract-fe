import { useMessageStore } from '@/store/message/message.store';
import { useWalletStore } from '@/store/wallet/wallet.store';
import { useEffect, useState } from 'react';
import { getChatContract } from '@/lib/contract';
import type { Message } from '@/store/message/message.type';
import ChatSidebar from '@/components/organism/ChatSidebar';
import ChatWindow from '@/components/organism/ChatWindow';

type Conversation = {
  address: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
};

export default function Chat() {
  const {
    messages,
    conversationIds,
    fetchUserConverastion,
    fetchConversation,
    sendMessage,
    receiver,
    setReceiver,
    setMessages,
    deleteMessage,
    clearConversation,
  } = useMessageStore();
  const { account } = useWalletStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!account || !receiver) return;

    let contract: any;

    const setupListener = async () => {
      try {
        const { contract: chatContract } = await getChatContract();
        contract = chatContract;

        const handleMessageSent = (
          sender: string,
          receiverAddr: string,
          content: string,
          timestamp: bigint
        ) => {
          const senderLower = sender.toLowerCase();
          const receiverLower = receiverAddr.toLowerCase();
          const accountLower = account.toLowerCase();
          const currentReceiverLower = receiver.toLowerCase();

          if (
            (senderLower === accountLower && receiverLower === currentReceiverLower) ||
            (senderLower === currentReceiverLower && receiverLower === accountLower)
          ) {
            const messageExists = messages.some(
              (msg) =>
                msg.sender.toLowerCase() === senderLower &&
                msg.content === content &&
                msg.timestamp === Number(timestamp)
            );

            if (!messageExists) {
              const newMsg: Message = {
                sender,
                content,
                timestamp: Number(timestamp),
              };

              setMessages([...messages, newMsg]);
            }
          }
        };

        contract.on('Messagesent', handleMessageSent);
      } catch (err) {
        console.error('Error setting up event listener:', err);
      }
    };

    setupListener();

    return () => {
      if (contract) {
        contract.removeAllListeners('Messagesent');
      }
    };
  }, [account, receiver, messages, setMessages]);

  useEffect(() => {
    if (!account) return;

    setReceiver('');

    const fetchData = async () => {
      try {
        await fetchUserConverastion(account);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    fetchData();
  }, [account, fetchUserConverastion]);

  useEffect(() => {
    if (messages.length > 0 && receiver) {
      const lastMessage = messages[messages.length - 1];
      setConversations((prevConvs) =>
        prevConvs.map((conv) => {
          if (conv.address === receiver) {
            return {
              ...conv,
              lastMessage: lastMessage.content,
              timestamp: formatTimestamp(lastMessage.timestamp),
            };
          }
          return conv;
        })
      );
    }
  }, [messages, receiver]);

  useEffect(() => {
    if (conversationIds.length > 0) {
      const convs: Conversation[] = conversationIds.map((id, index) => ({
        address: id,
        name: id.slice(0, 6) + '...' + id.slice(-4),
        lastMessage: 'Click to view messages',
        timestamp: '',
        unread: false,
      }));
      setConversations(convs);
    }
  }, [conversationIds]);

  const handleSelectConversation = async (address: string) => {
    setReceiver(address);
    try {
      await fetchConversation(address);
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!receiver) return;
    await sendMessage(receiver, message);
  };

  const handleStartNewConversation = async (address: string, message: string) => {
    await sendMessage(address, message);
    setReceiver(address);
    await fetchConversation(address);
    if (account) {
      await fetchUserConverastion(account);
    }
  };

  const handleDeleteMessage = async (index: number) => {
    if (!receiver) return;
    await deleteMessage(receiver, index);
  };

  const handleClearConversation = async () => {
    if (!receiver) return;
    await clearConversation(receiver);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24)
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const selectedConversation = conversations.find((c) => c.address === receiver);

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white">
      <ChatSidebar
        conversations={conversations}
        receiver={receiver}
        onSelectConversation={handleSelectConversation}
        onStartNewConversation={handleStartNewConversation}
      />

      {receiver ? (
        <ChatWindow
          receiver={receiver}
          messages={messages}
          account={account}
          selectedConversation={selectedConversation}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onClearConversation={handleClearConversation}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}

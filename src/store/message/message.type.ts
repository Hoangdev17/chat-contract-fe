export type Message = {
  sender: string;
  content: string;
  timestamp: number;
};

export type MessageState = {
  messages: Message[];
  conversationIds: string[];
  receiver: string | null;

  setReceiver: (address: string) => void;
  setMessages: (messages: Message[]) => void;
  fetchUserConverastion: (user: string) => Promise<void>;
  fetchConversation: (receiver: string) => Promise<void>;
  sendMessage: (receiver: string, content: string) => Promise<any>;
  deleteMessage: (partner: string, index: number) => Promise<void>;
  clearConversation: (partner: string) => Promise<void>;
};

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import type { Message } from '@/store/message/message.type';

type Conversation = {
  address: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
};

type ChatWindowProps = {
  receiver: string;
  messages: Message[];
  account: string | null;
  selectedConversation?: Conversation;
  onSendMessage: (message: string) => Promise<void>;
  onDeleteMessage: (index: number) => Promise<void>;
  onClearConversation: () => Promise<void>;
};

export default function ChatWindow({
  receiver,
  messages,
  account,
  selectedConversation,
  onSendMessage,
  onDeleteMessage,
  onClearConversation,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getInitials = (address: string) => {
    return address.slice(2, 4).toUpperCase();
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#3a3a3a] bg-[#262626]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
              {getInitials(receiver)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{selectedConversation?.name || receiver}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-[#3a3a3a]"
            onClick={async () => {
              if (confirm('Are you sure you want to clear this conversation?')) {
                try {
                  await onClearConversation();
                } catch (err) {
                  console.error('Error clearing conversation:', err);
                }
              }
            }}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full p-6 bg-[#1a1a1a]">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.sender.toLowerCase() === account?.toLowerCase();
              return (
                <div
                  key={index}
                  className={cn('flex gap-2', isOwnMessage ? 'justify-end' : 'justify-start')}
                >
                  {!isOwnMessage && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xs">
                        {getInitials(msg.sender)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md px-4 py-2 rounded-2xl relative group',
                      isOwnMessage
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-[#262626] text-white rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                    {isOwnMessage && (
                      <button
                        onClick={async () => {
                          if (confirm('Delete this message?')) {
                            try {
                              await onDeleteMessage(index);
                            } catch (err) {
                              console.error('Error deleting message:', err);
                            }
                          }
                        }}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 rounded-full p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-[#3a3a3a] bg-[#262626]">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Input
            placeholder="Vision OS is the future 😎"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-[#3a3a3a] border-none text-white placeholder:text-gray-400"
          />

          <Button
            size="icon"
            onClick={handleSendMessage}
            className="rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

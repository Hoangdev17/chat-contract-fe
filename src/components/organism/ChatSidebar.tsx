import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Conversation = {
  address: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
};

type ChatSidebarProps = {
  conversations: Conversation[];
  receiver: string | null;
  onSelectConversation: (address: string) => void;
  onStartNewConversation: (address: string, message: string) => Promise<void>;
};

export default function ChatSidebar({
  conversations,
  receiver,
  onSelectConversation,
  onStartNewConversation,
}: ChatSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newConversationAddress, setNewConversationAddress] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');

  const getInitials = (address: string) => {
    return address.slice(2, 4).toUpperCase();
  };

  const handleStartNewConversation = async () => {
    if (!newConversationAddress.trim() || !newConversationMessage.trim()) {
      alert('Please enter both address and message');
      return;
    }

    if (!newConversationAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Invalid Ethereum address');
      return;
    }

    try {
      await onStartNewConversation(newConversationAddress, newConversationMessage);
      setNewConversationAddress('');
      setNewConversationMessage('');
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error starting new conversation:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="w-80 bg-[#262626] flex flex-col border-r border-[#3a3a3a]">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chats</h1>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-[#3a3a3a]">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#262626] text-white border-[#3a3a3a]">
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter the wallet address and your first message
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={newConversationAddress}
                    onChange={(e) => setNewConversationAddress(e.target.value)}
                    className="bg-[#3a3a3a] border-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message..."
                    value={newConversationMessage}
                    onChange={(e) => setNewConversationMessage(e.target.value)}
                    className="bg-[#3a3a3a] border-none text-white min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setNewConversationAddress('');
                      setNewConversationMessage('');
                    }}
                    className="hover:bg-[#3a3a3a]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStartNewConversation}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 px-2">
          {conversations.map((conv) => (
            <button
              key={conv.address}
              onClick={() => onSelectConversation(conv.address)}
              className={cn(
                'w-full p-3 flex items-center gap-3 rounded-lg hover:bg-[#3a3a3a] transition-colors text-left',
                receiver === conv.address && 'bg-[#3a3a3a]'
              )}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
                  {getInitials(conv.address)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{conv.name}</span>
                  <span className="text-xs text-gray-400">{conv.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

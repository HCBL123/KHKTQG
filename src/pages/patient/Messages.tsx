import React, { useState } from 'react';
import { usePatient } from '../../hooks/usePatients';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  AlertCircle,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  doctorName: string;
  doctorAvatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
}

const Messages = () => {
  const { loading, error } = usePatient();
  const [activeConversation, setActiveConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real data from backend
  const conversations: Conversation[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Wilson',
      doctorAvatar: 'SW',
      lastMessage: 'How are you feeling today?',
      timestamp: new Date(),
      unread: 2,
      online: true,
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      doctorAvatar: 'MC',
      lastMessage: 'Your latest test results look good',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: 0,
      online: false,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'doctor',
      content: 'Hello! How are you feeling today?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
    },
    {
      id: '2',
      sender: 'patient',
      content: 'Hi Dr. Wilson! I"m feeling much better today. The exercises are really helping.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: true,
    },
    {
      id: '3',
      sender: 'doctor',
      content: 'That"s great to hear! Have you been experiencing any pain during the exercises?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
    },
    {
      id: '4',
      sender: 'patient',
      content: 'Just a little discomfort in my knee after the leg press, but it goes away quickly.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: true,
    },
    {
      id: '5',
      sender: 'doctor',
      content: 'That"s normal, but lets monitor it. Try reducing the weight slightly next time.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add message sending logic here
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">{error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm h-[calc(100vh-4rem)]">
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-10rem)]">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                    className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                      activeConversation === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {conversation.doctorAvatar}
                        </span>
                      </div>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.doctorName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {format(conversation.timestamp, 'HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-xs text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-8 flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {conversations.find(c => c.id === activeConversation)?.doctorAvatar}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {conversations.find(c => c.id === activeConversation)?.doctorName}
                        </h2>
                        <p className="text-sm text-green-500">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Info className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'patient' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === 'patient'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {format(message.timestamp, 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 
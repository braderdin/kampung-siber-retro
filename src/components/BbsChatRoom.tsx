"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Users, MessageCircle, Smile, Copy, RefreshCw, Loader2, User, MessageSquare, Bell, Volume2, VolumeX } from "lucide-react";
import { handleChatCommand, ChatCommandResult } from "@/components/chat/chat-command-handler";

interface BbsChatRoomProps {
  roomName?: string;
  className?: string;
  maxMessages?: number;
  onMessageSend?: (message: ChatMessage) => void;
  onUserJoin?: (user: ChatUser) => void;
  onUserLeave?: (user: ChatUser) => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  type?: "message" | "system" | "action";
  isOwn?: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  joinTime: string;
}

interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
}

const DEFAULT_ROOM_NAME = "Kampung Siber BBS";
const DEFAULT_MAX_MESSAGES = 100;
const MESSAGE_HISTORY_KEY = "bbs_chat_history";
const USERS_ONLINE_KEY = "bbs_users_online";

// Start: LocalStorage Helper Functions
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
// End: LocalStorage Helper Functions

export default function BbsChatRoom({ 
  roomName = DEFAULT_ROOM_NAME,
  className,
  maxMessages = DEFAULT_MAX_MESSAGES,
  onMessageSend,
  onUserJoin,
  onUserLeave,
}: BbsChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [muted, setMuted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  // Start: Fixed localStorage access with client-side check
  const [userName, setUserName] = useState(() => {
    const saved = getLocalStorageItem("bbs_user_name");
    return saved || `User_${Math.floor(Math.random() * 1000)}`;
  });

  useEffect(() => {
    const savedName = getLocalStorageItem("bbs_user_name");
    if (!savedName) {
      const newName = `User_${Math.floor(Math.random() * 1000)}`;
      setLocalStorageItem("bbs_user_name", newName);
      setUserName(newName);
    } else {
      setUserName(savedName);
    }
  }, []);
  // End: Fixed localStorage access

  useEffect(() => {
    const savedHistory = getLocalStorageItem(MESSAGE_HISTORY_KEY);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {}
    }

    const savedUsers = getLocalStorageItem(USERS_ONLINE_KEY);
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {}
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const recentMessages = messages.slice(-maxMessages);
      setLocalStorageItem(MESSAGE_HISTORY_KEY, JSON.stringify(recentMessages));
    }
  }, [messages, maxMessages]);

  useEffect(() => {
    if (users.length > 0) {
      setLocalStorageItem(USERS_ONLINE_KEY, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectWebSocket = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setLoading(false);
        
        const joinMessage: WebSocketMessage = {
          type: "join",
          data: {
            userId,
            userName,
            room: roomName,
            timestamp: new Date().toISOString(),
          },
        };
        ws.send(JSON.stringify(joinMessage));

        const newUser: ChatUser = {
          id: userId,
          name: userName,
          isOnline: true,
          joinTime: new Date().toISOString(),
        };
        
        setUsers(prev => [...prev, newUser]);
        onUserJoin?.(newUser);

        const joinSystemMsg: ChatMessage = {
          id: Date.now().toString(),
          userId: "system",
          userName: "Sistem",
          content: `${userName} menyertai bilik ${roomName}`,
          timestamp: new Date().toISOString(),
          type: "system",
        };
        setMessages(prev => [...prev, joinSystemMsg]);
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          // Start: Fixed TypeScript strict casting
          const rawData = data.data as unknown;
          
          switch (data.type) {
            case "message":
              const msg: ChatMessage = {
                ...(rawData as ChatMessage),
                isOwn: (rawData as ChatMessage).userId === userId,
              };
              setMessages(prev => [...prev, msg]);
              onMessageSend?.(msg);
              break;
              
            case "user_join":
              setUsers(prev => [...prev, rawData as ChatUser]);
              onUserJoin?.(rawData as ChatUser);
              break;
              
            case "user_leave":
              setUsers(prev => prev.filter(u => u.id !== (rawData as { userId: string }).userId));
              onUserLeave?.(rawData as ChatUser);
              break;
              
            case "typing":
              setIsTyping(true);
              setTimeout(() => setIsTyping(false), 2000);
              break;
          }
          // End: Fixed TypeScript strict casting
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      setLoading(false);
    }
  }, [userId, userName, roomName, onMessageSend, onUserJoin, onUserLeave]);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const processAndSendMessage = useCallback((content: string) => {
    const commandResult: ChatCommandResult = handleChatCommand(content);
    
    if (commandResult.shouldDeleteMessages) {
      setMessages([]);
      removeLocalStorageItem(MESSAGE_HISTORY_KEY);
      return;
    }
    
    if (commandResult.response) {
      const actionMessage: ChatMessage = {
        id: `action_${Date.now()}`,
        userId: "system",
        userName: "Command",
        content: commandResult.response,
        timestamp: new Date().toISOString(),
        type: "action",
      };
      setMessages(prev => [...prev, actionMessage]);
      setInputValue("");
      return;
    }

    if (!content.trim() || !isConnected) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId,
      userName,
      content,
      timestamp: new Date().toISOString(),
      type: "message",
      isOwn: true,
    };

    setMessages(prev => [...prev, message]);
    setInputValue("");
    onMessageSend?.(message);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "message",
        data: message,
      }));
    }
  }, [isConnected, userId, userName, onMessageSend]);

  const sendMessage = useCallback(() => {
    processAndSendMessage(inputValue);
  }, [inputValue, processAndSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const playNotificationSound = useCallback(() => {
    if (!muted && soundEnabled && typeof Audio !== "undefined") {
      try {
        const audio = new Audio("/sounds/notification.wav");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  }, [muted, soundEnabled]);

  const handleNewMessage = useCallback(() => {
    if (document.hidden) {
      playNotificationSound();
    }
  }, [playNotificationSound]);

  useEffect(() => {
    if (messages.length > 0) {
      handleNewMessage();
    }
  }, [messages, handleNewMessage]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hari ini";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Semalam";
    }
    return date.toLocaleDateString("ms-MY");
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isSystem = message.type === "system";
    const isAction = message.type === "action";
    const isSameUser = index > 0 && messages[index - 1]?.userId === message.userId;
    const showAvatar = !isSameUser || isSystem;

    return (
      <div 
        key={message.id} 
        className={`flex gap-3 mb-4 ${
          isSystem || isAction ? "justify-center" : ""
        }`}
      >
        {showAvatar && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center pixel-font text-sm">
            {isSystem || isAction ? "C" : (message.userName?.charAt(0)?.toUpperCase() || "U")}
          </div>
        )}
        
        <div className="flex-1">
          {!isSystem && !isAction && (
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-200 pixel-font">
                {message.userName}
              </span>
              <span className="text-xs text-gray-500 pixel-font">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}
          
          {isSystem || isAction ? (
            <div className="px-3 py-2 bg-gray-800/50 rounded border border-gray-700">
              <p className="text-sm text-yellow-400 pixel-font italic">
                {message.content}
              </p>
            </div>
          ) : (
            <div className={`px-3 py-2 rounded border ${
              message.isOwn 
                ? "bg-emerald-500/20 border-emerald-500/30 ml-auto max-w-xs" 
                : "bg-gray-800/30 border-gray-700"
            }`}>
              <p className="text-sm text-gray-200 pixel-font break-words">
                {message.content}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex flex-col h-full ${className || ""}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-400 pixel-font">Membuka sala berhadapan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className || ""}`}>
      <div className="flex items-center justify-between p-3 bg-gray-900/50 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-cyan-400" />
          <h2 className="pixel-font text-lg font-semibold text-gray-200">
            {roomName}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 pixel-font">
            <Users className="h-3 w-3 inline mr-1" />
            {users.length} pengguna
          </div>
          
          <button
            onClick={() => setMuted(!muted)}
            className="p-1 rounded-full hover:bg-gray-800/50 text-gray-400 transition-colors"
            title={muted ? "Bising" : "Bising Mati"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded-full hover:bg-gray-800/50 text-gray-400 transition-colors"
            title={soundEnabled ? "Bising Mati" : "Bising"}
          >
            {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </button>
          
          <span className={`text-xs ${isConnected ? "text-emerald-400" : "text-red-400"} pixel-font`}>
            {isConnected ? "Terhubung" : "Putus"}
          </span>
        </div>
      </div>

      {/* Start: Height Restriction Update - max-h-[350px] */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 max-h-[350px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 pixel-font">Belum ada mesej</p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-sm pixel-font">Anda</span>
            </div>
            <div className="px-3 py-2 bg-gray-800/30 rounded">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      {/* End: Height Restriction Update - max-h-[350px] */}

      <div className="p-3 border-t border-gray-700">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Taip mesej anda... (Shift+Enter untuk newline). /help untuk arahan."
          className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600 focus:outline-none focus:border-emerald-500 resize-none text-sm text-gray-200 pixel-font"
          rows={2}
          disabled={!isConnected}
        />
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500 pixel-font">
            {inputValue.length < 500 ? `${inputValue.length}/500` : inputValue.length.toString()}
          </div>
          
          <div className="flex items-center gap-2">
            <Smile className="h-4 w-4 text-gray-400" />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !inputValue.trim()}
              className="flex items-center gap-1 px-4 py-1.5 text-sm rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors pixel-font disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Hantar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const useBbsChat = (roomName?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  // Start: Fixed localStorage access for hook
  const [userName] = useState(() => {
    const saved = getLocalStorageItem("bbs_user_name");
    return saved || `User_${Math.floor(Math.random() * 1000)}`;
  });
  // End: Fixed localStorage access
  
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      
      ws.send(JSON.stringify({
        type: "join",
        data: {
          userId,
          userName,
          room: roomName,
          timestamp: new Date().toISOString(),
        },
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Start: Fixed TypeScript strict casting
        const rawData = data.data as unknown;
        
        switch (data.type) {
          case "message":
            setMessages(prev => [...prev, rawData as ChatMessage]);
            break;
          case "user_join":
            setUsers(prev => [...prev, rawData as ChatUser]);
            break;
          case "user_leave":
            setUsers(prev => prev.filter((u: ChatUser) => u.id !== (rawData as { userId: string }).userId));
            break;
        }
        // End: Fixed TypeScript strict casting
      } catch (e) {}
    };

    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, [userId, userName, roomName]);

  const sendMessage = useCallback((content: string) => {
    if (!isConnected) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId,
      userName,
      content,
      timestamp: new Date().toISOString(),
      type: "message",
    };
    
    setMessages(prev => [...prev, message]);
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "message",
        data: message,
      }));
    }
  }, [isConnected, userId, userName]);

  return {
    messages,
    users,
    isConnected,
    sendMessage,
    setMessages,
  };
};

export const createChatRoom = (name: string) => {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!active) return;
    
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        data: {
          userId: `user_${Date.now()}`,
          userName: name,
          room: name,
          timestamp: new Date().toISOString(),
        },
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Start: Fixed TypeScript strict casting
        if (data.type === "message") {
          setMessages(prev => [...prev, data.data as unknown as ChatMessage]);
        }
        // End: Fixed TypeScript strict casting
      } catch (e) {}
    };

    return () => ws.close();
  }, [active, name]);

  const start = () => setActive(true);
  const stop = () => setActive(false);

  return {
    active,
    start,
    stop,
    messages,
    setMessages,
  };
};

const BellOff = Bell;
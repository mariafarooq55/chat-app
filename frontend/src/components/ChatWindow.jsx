import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import Message from "./Message";

const ChatWindow = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages when room changes
  useEffect(() => {
    if (!room) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${room._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join socket room
    if (socket) {
      socket.emit("join_room", room._id);
    }
  }, [room, socket]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit("send_message", {
      content: newMessage,
      sender: user._id,
      room: room._id,
    });

    setNewMessage("");
  };

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-5xl mb-4">💬</p>
          <h2 className="text-xl font-bold text-gray-400">
            Select a room to start chatting
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Choose a room from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      {/* Room Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
        <h2 className="text-white font-bold text-lg"># {room.name}</h2>
        {room.description && (
          <p className="text-gray-400 text-sm">{room.description}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm">
              No messages yet. Say hello! 👋
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message._id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message # ${room.name}`}
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition font-semibold text-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

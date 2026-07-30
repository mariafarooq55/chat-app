import { useAuth } from "../context/AuthContext";

const Message = ({ message }) => {
  const { user } = useAuth();
  const isOwn = message.sender._id === user._id;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col`}
      >
        {!isOwn && (
          <span className="text-purple-400 text-xs font-semibold mb-1 ml-1">
            {message.sender.username}
          </span>
        )}
        <div
          className={`px-4 py-2 rounded-2xl text-sm ${
            isOwn
              ? "bg-purple-600 text-white rounded-br-none"
              : "bg-gray-700 text-gray-100 rounded-bl-none"
          }`}
        >
          {message.content}
        </div>
        <span className="text-gray-500 text-xs mt-1 mx-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;

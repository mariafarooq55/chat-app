import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ rooms, selectedRoom, setSelectedRoom, onCreateRoom }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-purple-400">💬 ChatApp</h1>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{user?.username}</p>
            <p className="text-green-400 text-xs">● Online</p>
          </div>
        </div>
      </div>

      {/* Rooms */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Rooms
          </p>
          <button
            onClick={onCreateRoom}
            className="text-purple-400 hover:text-purple-300 text-xs font-semibold"
          >
            + New
          </button>
        </div>

        {rooms.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">
            No rooms yet. Create one!
          </p>
        )}

        {rooms.map((room) => (
          <button
            key={room._id}
            onClick={() => setSelectedRoom(room)}
            className={`w-full text-left p-3 rounded-xl mb-1 transition ${
              selectedRoom?._id === room._id
                ? "bg-purple-600/20 border border-purple-500/30"
                : "hover:bg-gray-800"
            }`}
          >
            <p
              className={`font-semibold text-sm ${
                selectedRoom?._id === room._id
                  ? "text-purple-400"
                  : "text-gray-200"
              }`}
            >
              # {room.name}
            </p>
            {room.description && (
              <p className="text-gray-500 text-xs mt-0.5 truncate">
                {room.description}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

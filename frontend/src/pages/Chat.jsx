import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newRoom),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRooms([...rooms, data]);
      setSelectedRoom(data);
      setNewRoom({ name: "", description: "" });
      setShowCreateRoom(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex bg-gray-950 overflow-hidden">
      <Sidebar
        rooms={rooms}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        onCreateRoom={() => setShowCreateRoom(true)}
      />
      <ChatWindow room={selectedRoom} />

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-900 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              Create New Room
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, name: e.target.value })
                  }
                  placeholder="e.g. general, random, tech"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newRoom.description}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, description: e.target.value })
                  }
                  placeholder="What's this room about?"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-400 font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

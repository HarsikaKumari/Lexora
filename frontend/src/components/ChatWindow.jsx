// components/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ otherUserId, otherUserName, onClose, token: propToken }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    // ✅ Pehle props se token lo, nahi toh localStorage se
    const token = propToken || localStorage.getItem('token');
    const socketRef = useRef(null);

    useEffect(() => {
        console.log('🔍 ChatWindow mounted');
        console.log('otherUserId:', otherUserId);
        console.log('token exists:', !!token);
        console.log('user:', user?.id, user?.name);

        if (!otherUserId || !token) {
            console.log('❌ Missing required data');
            return;
        }

        // Fetch messages
        const fetchMessages = async () => {
            try {
                console.log('📚 Fetching messages...');
                const res = await api.get(`/chat/messages/${otherUserId}`);
                console.log('✅ Messages received:', res.data);
                setMessages(res.data);
            } catch (err) {
                console.error('❌ Fetch error:', err);
            }
        };
        fetchMessages();

        // Socket connection
        console.log('🔌 Connecting socket...');
        socketRef.current = io(`${import.meta.env.VITE_API_URL}` || 'http://localhost:5000', {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        socketRef.current.on('connect', () => {
            console.log('✅ Socket connected!');
            setIsConnected(true);
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('❌ Socket error:', err.message);
            setIsConnected(false);
        });

        socketRef.current.on('private_message', (msg) => {
            console.log('📨 Message received:', msg);
            setMessages(prev => [...prev, msg]);
        });

        socketRef.current.on('message_sent', (msg) => {
            console.log('✅ Message sent:', msg);
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [otherUserId, token]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!socketRef.current || !isConnected) {
            alert('Not connected!');
            return;
        }

        socketRef.current.emit('private_message', {
            toUserId: Number(otherUserId),
            message: newMessage.trim()
        });
        setNewMessage('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="fixed bottom-0 right-4 w-96 bg-white rounded-t-xl shadow-2xl border border-slate-200 z-50 flex flex-col" style={{ height: '500px' }}>
            <div className="flex items-center justify-between px-4 py-3 rounded-t-xl" style={{ background: '#185FA5' }}>
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white font-medium">{otherUserName}</span>
                </div>
                <button onClick={onClose} className="text-white text-xl">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.from_user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] px-3 py-2 rounded-lg ${msg.from_user_id === user?.id ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                                <p className="text-sm break-words">{msg.message}</p>
                                <span className={`text-xs mt-1 block ${msg.from_user_id === user?.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="border-t border-gray-200 p-3 bg-white rounded-b-xl">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!isConnected}
                        placeholder={isConnected ? "Type a message..." : "Connecting..."}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !newMessage.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;

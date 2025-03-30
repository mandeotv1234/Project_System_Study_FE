import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode
import axios from "axios"; // Import axios để gọi API
import  API_DOMAIN  from "../Utils/request"; // Đường dẫn tùy thuộc vào cấu trúc dự án của bạn
const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng chatbox
  const [stompClient, setStompClient] = useState(null); // Kết nối STOMP
  const [messages, setMessages] = useState([]); // Danh sách tin nhắn
  const [messageContent, setMessageContent] = useState(""); // Nội dung tin nhắn

  // Lấy token từ localStorage hoặc sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null; // Giải mã userId từ token
  const adminId = 25; // ID của admin

  useEffect(() => {
    if (!userId) {
      console.error("Không tìm thấy userId từ token");
      return;
    }

    // Kết nối SockJS và STOMP
    const socketUrl = `${API_DOMAIN}/chat`;
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to STOMP");

        // Subscribe để nhận tin nhắn từ server
        client.subscribe("/topic/messages", (msg) => {
          const newMessage = JSON.parse(msg.body);
        
          console.log("Tin nhắn mới:", newMessage);
          // Nếu tin nhắn được gửi bởi chính userId, không thêm vào danh sách
          if (newMessage.sender.id === userId) {
            console.log("Bỏ qua tin nhắn do chính user gửi:", newMessage);
            return;
          }
        
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from STOMP");
      },
    });
    console.log("client", client);

    client.activate();
    setStompClient(client);

    // Ngắt kết nối khi component bị unmount
    return () => {
      if (client) client.deactivate();
    };
  }, [userId]);

  // Lấy tin nhắn cũ khi mở chatbox
useEffect(() => {
    if (isOpen && userId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${API_DOMAIN}/api/chat/${userId}/${adminId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
              },
            }
          );
          const formattedMessages = response.data.map((msg) => ({
            id: msg.id,
            content: msg.content,
            timestamp: msg.timestamp,
            senderId: msg.sender.id,
          }));
          setMessages(formattedMessages); // Cập nhật danh sách tin nhắn
        } catch (error) {
          console.error("Lỗi khi lấy tin nhắn cũ:", error);
        }
      };
  
      fetchMessages();
    }
  }, [isOpen, userId]);

  const handleSendMessage = () => {
    if (stompClient && messageContent.trim()) {
      const messageData = {
        senderId: userId,
        receiverId: adminId, // Gửi tin nhắn đến admin
        content: messageContent,
        timestamp: new Date().toISOString(),
      };

      // Gửi tin nhắn qua STOMP
      stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(messageData),
      });

      // Hiển thị tin nhắn ngay lập tức trên giao diện
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessageContent("");
    }
  };

  return (
    <div>
      {/* Nút mở/đóng chatbox */}
      <div
        className="position-fixed bottom-0 end-0 m-3 btn btn-primary rounded-circle shadow"
        style={{ zIndex: 1050 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Đóng" : "Chat"}
      </div>

      {/* Chatbox */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="position-fixed bottom-0 end-0 m-3 bg-white border rounded shadow"
          style={{ width: "300px", zIndex: 1050 }}
        >
          <div className="bg-primary text-white p-3">
            <h5 className="mb-0">Chat với Admin</h5>
          </div>
          <div className="p-3" style={{ height: "300px", overflowY: "auto" }}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.senderId === userId ? "text-end" : "text-start"
                  }`}
                >
                  <div
                    className={`d-inline-block p-2 rounded ${
                      msg.senderId === userId
                        ? "bg-primary text-white"
                        : "bg-light text-dark"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-muted small mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">Không có tin nhắn nào.</p>
            )}
          </div>
          <div className="p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tin nhắn..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
              >
                Gửi
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatBox;
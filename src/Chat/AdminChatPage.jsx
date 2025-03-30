import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import API_DOMAIN  from "../Utils/request"; // Đường dẫn tùy thuộc vào cấu trúc dự án của bạn
const AdminChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]); // Danh sách phòng chat
  const [selectedChat, setSelectedChat] = useState(null); // Phòng chat được chọn
  const [messages, setMessages] = useState([]); // Lịch sử tin nhắn
  const [messageContent, setMessageContent] = useState(""); // Nội dung tin nhắn
  const [stompClient, setStompClient] = useState(null); // Kết nối STOMP

  // Decode token để lấy adminId
  const token = localStorage.getItem("token");
  let adminId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      adminId = decodedToken.id; // adminId chính là userId của admin
    } catch (error) {
      console.error("Lỗi khi decode token:", error);
    }
  }

  // Lấy danh sách phòng chat
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${API_DOMAIN}/api/chatrooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChatRooms(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng chat:", error);
      }
    };
    fetchChatRooms();
  }, [token]);

  // Kết nối WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_DOMAIN}/chat/`),
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // Thử kết nối lại sau 5 giây
      onConnect: () => {
        console.log("Admin đã kết nối STOMP");
        client.subscribe("/topic/messages", (msg) => {
          const newMessage = JSON.parse(msg.body);
          console.log("Tin nhắn mới:", newMessage);
          handleNewMessage(newMessage);
        });
      },
      onDisconnect: () => {
        console.log("Kết nối STOMP đã bị đóng.");
      },
      onStompError: (frame) => {
        console.error("Lỗi STOMP:", frame.headers["message"]);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  // Xử lý tin nhắn mới
  const handleNewMessage = (newMessage) => {
    console.log("Xử lý tin nhắn mới:", newMessage);
    console.log("selectedChat", selectedChat);
    console.log("adminId", adminId);
    // Nếu admin đang mở đúng phòng chat, cập nhật danh sách tin nhắn
    if (
      (newMessage.sender.id === selectedChat.user1Id || newMessage.receiver.id === adminId)
    ) {
      setMessages((prev) => [...prev, newMessage]);
    }

    // Cập nhật tin nhắn cho phòng chat tương ứng trong danh sách phòng chat
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedChat?.id
          ? { ...room, lastMessage: newMessage.content }
          : room
      )
    );
  };

  // Xử lý khi chọn phòng chat
  const handleChatSelect = (chatRoom) => {
    setSelectedChat(chatRoom);
    setMessages(chatRoom.messages); // Sử dụng tin nhắn từ phòng chat đã chọn
  };

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (!stompClient || !stompClient.connected) {
      console.error("Kết nối STOMP chưa được thiết lập.");
      return;
    }

    if (messageContent && selectedChat) {
      const messageData = {
        senderId: adminId, // ID của admin (người gửi)
        receiverId: selectedChat.user1Id === adminId ? selectedChat.user2Id : selectedChat.user1Id, // ID của người nhận
        content: messageContent, // Nội dung tin nhắn
        timestamp: new Date().toISOString(), // Thời gian gửi
      };

      console.log("Gửi tin nhắn:", messageData);

      // Gửi tin nhắn qua STOMP
      stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(messageData),
      });

      // Hiển thị tin nhắn ngay lập tức trên giao diện
      setMessages((prev) => [...prev, messageData]);
      setMessageContent("");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Danh sách phòng chat */}
        <div
          className="col-md-4 border-end"
          style={{ height: "100vh", overflowY: "auto" }}
        >
          <h4 className="p-3">Danh sách phòng chat</h4>
          {chatRooms.map((room) => (
            <div
              key={room.id}
              className={`p-3 border-bottom cursor-pointer ${
                selectedChat && selectedChat.id === room.id ? "bg-light" : ""
              }`}
              onClick={() => handleChatSelect(room)}
            >
              <p className="mb-0 font-weight-bold">
                {room.user1Id === adminId
                  ? room.messages[0]?.receiver?.username
                  : room.messages[0]?.sender?.username}
              </p>
              <p className="text-muted small mb-0">
                {room.messages[room.messages.length - 1]?.content || "Không có tin nhắn"}
              </p>
            </div>
          ))}
        </div>

        {/* Lịch sử tin nhắn */}
        <div
          className="col-md-8 d-flex flex-column"
          style={{ height: "100vh" }}
        >
          <div className="flex-grow-1 p-3 overflow-auto">
            {selectedChat ? (
              <>
                <h5 className="mb-4">
                  Phòng:{" "}
                  {selectedChat.user1Id === adminId
                    ? selectedChat.messages[0]?.receiver?.username
                    : selectedChat.messages[0]?.sender?.username}
                </h5>
              
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.sender &&  msg.sender.id === adminId ||msg.senderId === adminId? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`d-inline-block p-2 rounded ${
                        msg.sender && msg.sender.id === adminId||msg.senderId === adminId
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
                ))}
              </>
            ) : (
              <p className="text-center text-muted">
                Chọn một phòng chat để xem tin nhắn
              </p>
            )}
          </div>

          {/* Gửi tin nhắn */}
          {selectedChat && (
            <div className="p-3 border-top">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tin nhắn..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                  Gửi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
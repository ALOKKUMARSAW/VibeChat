package com.alok.chat.payload;

public class MessageRequest {

    public String content;
    public String sender;
    public String roomId;

    public MessageRequest() {}

    public MessageRequest(String content, String sender, String roomId) {
        this.content = content;
        this.sender = sender;
        this.roomId = roomId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }
}

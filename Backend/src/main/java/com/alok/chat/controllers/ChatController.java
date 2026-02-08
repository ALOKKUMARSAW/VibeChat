package com.alok.chat.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.alok.chat.entities.Message;
import com.alok.chat.entities.Room;
import com.alok.chat.payload.MessageRequest;
import com.alok.chat.repositories.RoomRepository;


@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {


    private final RoomRepository roomRepository;

    public ChatController(final RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }


    //for sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}")// /app/sendMessage/roomId
    @SendTo("/topic/room/{roomId}")//subscribe
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ) {

        Room room = roomRepository.findByRoomId(roomId);
        Message message = new Message(request.getSender(), request.getContent());
        if (room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("room not found !!");
        }

        return message;


    }
}

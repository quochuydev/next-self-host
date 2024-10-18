"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, File, Menu, Plus } from "lucide-react";
import LoginButton from "@/app/chat-box/components/login-button";
import RegisterButton from "@/app/chat-box/components/register-button";
import {
  createClient,
  CryptoEvent,
  EventType,
  MatrixEvent,
  RoomEvent,
  MatrixClient,
  Room,
  MsgType,
} from "matrix-js-sdk";

const homeserverUrl = "http://localhost:8009";
const deviceId = "REDACTED";
const defaultRoomId = "!QreMEfWZjEiFkZrday:e2e.homeserver.localhost";
const defaultJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzViYW1kaDU2djYybzR4M3J6cGZ2d3Z5dnZrdm1zaGk2dHp6Y2ZhdDM1Z3FvamEiLCJpYXQiOjE3MjkyNDU1NTEsImV4cCI6MTczNzAyMTU1MSwiaXNzIjoiZTJlLmhvbWVzZXJ2ZXIubG9jYWxob3N0In0.T3zYP-Ajfq5unJ7VNQEUrE2WjrJXhdKVtYt8wW9VOXs";
const defaultRecoveryKey =
  "EsTb Fu3G 3ysu 3Gep msRV ZPs8 R16i V9VG aCVK coPj bmwD 9NXx";

export default function ChatBox() {
  const [input, setInput] = useState("testing " + new Date());
  const [jwt, setJwt] = useState(defaultJwt);
  const [recoveryKey, setRecoveryKey] = useState(defaultRecoveryKey);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [client, setClient] = useState<MatrixClient | undefined>(undefined);
  const [roomId, setRoomId] = useState(defaultRoomId);
  const [room, setRoom] = useState<Room | undefined>(undefined);

  const initializeMatrix = async () => {
    try {
      await global.Olm.init();
      console.log("Olm initialized successfully");
    } catch (err) {
      console.error("Error initializing Matrix client:", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    initializeMatrix();
  }, []);

  const initializeMatrixClient = async () => {
    if (!client) return;

    try {
      const loginResponse = await client.login("org.matrix.login.jwt", {
        token: jwt,
        device_id: deviceId,
      });
      console.log(`debug:loginResponse`, loginResponse);

      await client.initCrypto();
      await client.startClient();
      client.setGlobalErrorOnUnknownDevices(false);

      await restoreKeysUsingRecoveryKey(client, recoveryKey);
      console.log("restore - done");

      listenForEvents();
    } catch (err) {
      console.error("Error initializing Matrix client:", err);
    }
  };

  useEffect(() => {
    initializeMatrixClient();
  }, [client]);

  const loginAndRestore = async () => {
    if (!jwt) return;
    if (!recoveryKey) return;

    const newClient = createClient({
      baseUrl: homeserverUrl,
      deviceId,
    });

    setClient(newClient);
  };

  async function sendEncryptedMessage(message: string) {
    if (!client) return;
    if (!roomId) return;
    if (!message) return;

    try {
      const room = client.getRoom(roomId);
      console.log("room", room);

      if (!room) {
        console.error("Room not found:", roomId);
        return;
      }

      await client.joinRoom(roomId);

      await client.sendEvent(roomId, EventType.RoomMessage, {
        body: message,
        msgtype: MsgType.Text,
      });
      console.log("Message sent:", message);
    } catch (error) {
      console.error("Error sending encrypted message:", error);
    }
  }

  async function restoreKeysUsingRecoveryKey(
    client: MatrixClient,
    recoveryKey: string
  ) {
    try {
      const backupInfo = await client.getKeyBackupVersion();
      if (!backupInfo) throw new Error("No backup info found on the server.");

      const restoreResult = await client.restoreKeyBackupWithRecoveryKey(
        recoveryKey,
        undefined,
        undefined,
        backupInfo
      );
      console.log("Successfully restored keys.", restoreResult);
    } catch (error) {
      console.error("Failed to restore keys using recovery key:", error);
    }
  }

  const listenForEvents = () => {
    if (!client) return;

    client.on(RoomEvent.Timeline, async (event) => {
      if (
        event.getType() !== "m.room.message" &&
        event.getType() !== "m.room.encrypted"
      ) {
        return;
      }

      console.log("Encrypted content:", event.getContent());
      await client.decryptEventIfNeeded(event);
      const content = event.getContent();
      console.log("Decrypted content:", content);

      setEvents((e) => [
        ...e,
        {
          id: Date.now(),
          type: "text",
          content: content.body,
          send: "user",
        },
      ]);
    });

    client.on(CryptoEvent.RoomKeyRequest, (req) => {
      console.log("Received room key request", req.requestBody);
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`bg-secondary w-64 p-4 flex flex-col ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <h1 className="text-2xl font-bold mb-4">Chat App</h1>
        <RegisterButton />
        <LoginButton onLogin={() => loginAndRestore()} />
        <div className="flex">
          <Input
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            className="p-1 text-xs"
          />
          <Button variant="ghost" size="icon">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex">
          <Input
            value={recoveryKey}
            onChange={(e) => setRecoveryKey(e.target.value)}
            className="p-1 text-xs"
          />
          <Button variant="ghost" size="icon">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col">
          <p>roomId</p>
          <Input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="p-1 text-xs"
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-lg font-semibold mb-2">Online Users</h2>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>User {i + 1}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-secondary p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg font-semibold">Chat Support</p>
            <p>Huy pham</p>
            <p>{roomId}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              console.log("create room");
            }}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <ScrollArea className="flex flex-1 p-4 w-full items-end justify-end">
          {events.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {message.type === "text" ? (
                  <p>{message.content}</p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4" />
                    <span>{message.content}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendEncryptedMessage(input);
              }}
            />
            <Button onClick={() => sendEncryptedMessage(input)}>
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

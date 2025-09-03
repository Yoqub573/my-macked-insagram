import React, { useState, useRef, useEffect } from "react";
import Peer from "peerjs";

export default function PeerCall({ myId, herId }) {
  const [peerId, setPeerId] = useState(myId);
  const [callActive, setCallActive] = useState(false);
  const [videoMode, setVideoMode] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerRef = useRef(null);
  const currentCallRef = useRef(null);

  useEffect(() => {
    // Создание Peer
    const peer = new Peer(myId, {
      host: "0.peerjs.com", // Можно заменить на свой сервер
      port: 443,
      secure: true,
    });
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("Мой Peer ID:", id);
    });

    // При входящем звонке
    peer.on("call", async (call) => {
      const isVideo = call.metadata?.video ?? true;
      setVideoMode(isVideo);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideo,
          audio: true,
        });

        if (isVideo) localVideoRef.current.srcObject = stream;
        else localAudioRef.current.srcObject = stream;

        call.answer(stream);
        currentCallRef.current = call;
        setCallActive(true);

        call.on("stream", (remoteStream) => {
          if (isVideo) remoteVideoRef.current.srcObject = remoteStream;
          else remoteAudioRef.current.srcObject = remoteStream;
        });

        call.on("close", () => endCall());
      } catch (err) {
        console.error("Ошибка доступа к камере/микрофону:", err);
      }
    });

    return () => peer.destroy();
  }, [myId]);

  const callPeer = async (video = true) => {
    if (!herId) return alert("Нет ID собеседника!");
    setVideoMode(video);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: true,
      });

      if (video) localVideoRef.current.srcObject = stream;
      else localAudioRef.current.srcObject = stream;

      const call = peerRef.current.call(herId, stream, { metadata: { video } });
      currentCallRef.current = call;
      setCallActive(true);

      call.on("stream", (remoteStream) => {
        if (video) remoteVideoRef.current.srcObject = remoteStream;
        else remoteAudioRef.current.srcObject = remoteStream;
      });

      call.on("close", () => endCall());
    } catch (err) {
      console.error("Ошибка доступа к камере/микрофону:", err);
    }
  };

  const endCall = () => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }
    setCallActive(false);

    [localVideoRef, remoteVideoRef, localAudioRef, remoteAudioRef].forEach((ref) => {
      if (ref.current?.srcObject) {
        ref.current.srcObject.getTracks().forEach((t) => t.stop());
        ref.current.srcObject = null;
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <strong>Мой ID:</strong> {peerId} <br />
        <strong>Его ID:</strong> {herId}
      </div>

      <div className="flex gap-2 mt-2">
        <button onClick={() => callPeer(false)}>🎧 Аудио</button>
        <button onClick={() => callPeer(true)}>📹 Видео</button>
        <button onClick={endCall}>❌ Завершить</button>
      </div>

      <div className="flex gap-2 mt-4">
        {/* Локальные потоки */}
        {videoMode ? (
          <video ref={localVideoRef} autoPlay muted className="w-64 h-64 border" />
        ) : (
          <audio ref={localAudioRef} autoPlay muted />
        )}

        {/* Удалённые потоки */}
        {videoMode ? (
          <video ref={remoteVideoRef} autoPlay className="w-32 h-32 border" />
        ) : (
          <audio ref={remoteAudioRef} autoPlay />
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorVideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(DoctorContext);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const [status, setStatus] = useState("Starting camera...");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    let mounted = true;

    const send = (payload) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload));
      }
    };

    const addIceCandidate = async (candidate) => {
      if (!peerRef.current) return;

      if (!peerRef.current.remoteDescription) {
        pendingCandidatesRef.current.push(candidate);
        return;
      }

      await peerRef.current.addIceCandidate(candidate);
    };

    const flushPendingCandidates = async () => {
      if (!peerRef.current?.remoteDescription) return;

      const candidates = [...pendingCandidatesRef.current];
      pendingCandidatesRef.current = [];

      await Promise.all(
        candidates.map((candidate) => peerRef.current.addIceCandidate(candidate))
      );
    };

    const createPeer = () => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      streamRef.current?.getTracks().forEach((track) => {
        peer.addTrack(track, streamRef.current);
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          send({ type: "ice-candidate", candidate: event.candidate });
        }
      };

      peer.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setStatus("Connected");
        }
      };

      peer.onconnectionstatechange = () => {
        if (peer.connectionState === "connected") setStatus("Connected");
        if (peer.connectionState === "disconnected") {
          setStatus("Patient disconnected");
        }
      };

      peerRef.current = peer;
      return peer;
    };

    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) return;

        streamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const cleanBackendUrl = (backendUrl || "http://localhost:4000")
          .trim()
          .replace(/^['"]|['"]$/g, "");
        const socket = new WebSocket(
          `${cleanBackendUrl.replace(/^http/, "ws")}/video-signaling`
        );
        socketRef.current = socket;

        socket.onopen = () => {
          setStatus("Waiting for patient to join...");
          send({
            type: "join",
            roomId: appointmentId,
            role: "doctor",
          });
        };

        socket.onmessage = async (event) => {
          const message = JSON.parse(event.data);

          if (message.type === "joined") {
            setStatus(message.peers > 0 ? "Connecting..." : "Waiting for patient to join...");
          }

          if (message.type === "peer-joined") {
            setStatus("Connecting...");
            const peer = peerRef.current || createPeer();
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            send({ type: "offer", offer });
          }

          if (message.type === "offer") {
            const peer = peerRef.current || createPeer();
            await peer.setRemoteDescription(message.offer);
            await flushPendingCandidates();
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            send({ type: "answer", answer });
          }

          if (message.type === "answer" && peerRef.current) {
            await peerRef.current.setRemoteDescription(message.answer);
            await flushPendingCandidates();
          }

          if (message.type === "ice-candidate" && peerRef.current) {
            await addIceCandidate(message.candidate);
          }

          if (message.type === "peer-left") {
            setStatus("Patient left the call");
          }
        };

        socket.onerror = () =>
          setStatus("Video signaling connection failed. Check backend server and VITE_BACKEND_URL.");
        socket.onclose = () => setStatus("Video signaling connection closed");
      } catch (error) {
        setStatus(error.message || "Unable to start video call");
      }
    };

    startCall();

    return () => {
      mounted = false;
      socketRef.current?.close();
      peerRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [appointmentId, backendUrl]);

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  const toggleCamera = () => {
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doctor Video Consultation</h1>
            <p className="text-sm text-slate-300">{status}</p>
          </div>
          <button
            onClick={() => navigate("/doctor-appointments")}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Leave Call
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="aspect-video w-full bg-black object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="aspect-video w-full bg-black object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={toggleMic}
                className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-slate-700"
              >
                {micOn ? "Mute Mic" : "Unmute Mic"}
              </button>
              <button
                onClick={toggleCamera}
                className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-slate-700"
              >
                {cameraOn ? "Stop Camera" : "Start Camera"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

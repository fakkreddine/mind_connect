// pages/agoraTranscriptionDemo.tsx

import { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { startAgoraTranscriptionClient } from "../utils/agoraTranscriptionClient";

export default function AgoraTranscriptionDemo() {
  const [transcriptionText, setTranscriptionText] = useState<string>("");
  const [transcriptionActive, setTranscriptionActive] = useState<boolean>(false);
  let transcriptionClient: { stopTranscription: () => void } | null = null;

  // Function to initialize Agora and start transcription.
  async function initTranscription() {
    try {
      // Create Agora microphone and camera tracks.
      const [micTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      // Get the native MediaStreamTrack from the Agora microphone track.
      const audioMediaStreamTrack = micTrack.getMediaStreamTrack();
      // Create a new MediaStream from the native audio track.
      const audioStream = new MediaStream([audioMediaStreamTrack]);
  
      // Start the transcription client. Pass a callback to update the transcript.
      transcriptionClient = startAgoraTranscriptionClient(audioStream, (text) => {
        // Here we're simply appending the latest transcript to our state.
        // In a real use-case you may want to manage state differently.
        setTranscriptionText((prev) => prev + " " + text);
      });
      setTranscriptionActive(true);
    } catch (error) {
      console.error("Error initializing Agora transcription:", error);
    }
  }

  const stopTranscription = () => {
    if (transcriptionClient) {
      transcriptionClient.stopTranscription();
      setTranscriptionActive(false);
    }
  };

  // Start transcription on component mount for demo purposes.
  useEffect(() => {
    initTranscription();

    // Cleanup on unmount.
    return () => {
      if (transcriptionClient) {
        transcriptionClient.stopTranscription();
      }
    };
  }, []);

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Agora RTC Transcription Demo</h1>
      <p>
        Transcript:
        <br />
        <textarea
          value={transcriptionText}
          readOnly
          style={{ width: "100%", height: "200px" }}
        />
      </p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={stopTranscription} disabled={!transcriptionActive}>
          Stop Transcription
        </button>
      </div>
    </div>
  );
}

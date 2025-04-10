// utils/agoraTranscriptionClient.ts

/**
 * Starts a live transcription session by capturing audio from an Agora RTC MediaStream,
 * recording it via MediaRecorder, and sending binary audio chunks to your backend.
 *
 * @param stream - A MediaStream instance provided by your Agora RTC integration.
 * @param onTranscript - A callback that receives transcript text when available.
 * @returns An object with a stopTranscription function to end the session.
 */
export function startAgoraTranscriptionClient(
    stream: MediaStream,
    onTranscript: (text: string) => void
  ) {
    // Connect to your backend WebSocket endpoint for transcription.
    const ws = new WebSocket("ws://b319-196-224-6-220.ngrok-free.app");
    ws.binaryType = "arraybuffer";
    let recorder: MediaRecorder;
  
    ws.onopen = () => {
      console.log("WebSocket connected for live transcription (Agora RTC).");
      // Inform the backend this is a live stream.
      ws.send(JSON.stringify({ live: true }));
  
      // Create a MediaRecorder for the audio stream.
      recorder = new MediaRecorder(stream, { mimeType: "audio/webm; codecs=opus" });
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
          event.data.arrayBuffer().then((buffer) => {
            ws.send(buffer);
          });
        }
      };
  
      // Start recording, emitting audio data every second.
      recorder.start(1000);
    };
  
    ws.onmessage = (event) => {
      try {
        // Parse the incoming message.
        const message = JSON.parse(event.data);
        if (message.transcription) {
          console.log("Live transcription:", message.transcription);
          // Invoke the callback to update the UI (for example, with React state).
          onTranscript(message.transcription);
        }
        // Optionally handle other message types...
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    // Function to stop the transcription session.
    const stopTranscription = () => {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: "stop" }));
        ws.close();
      }
      console.log("Stopped live transcription.");
    };
  
    return { stopTranscription };
  }
  
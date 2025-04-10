"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Brain,
  ClipboardList,
  FileText,
  Mic,
  MicOff,
  Monitor,
  Phone,
  Search,
  Video,
  VideoOff,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LiveTranscript } from "@/components/live-transcript"
import { MedicalTermDetector } from "@/components/medical-term-detector"
import { PatientHistory } from "@/components/patient-history"
import { TherapyNotes } from "@/components/therapy-notes"
import { startAgoraTranscriptionClient } from "@/lib/transcriptionClient"
import AgoraTranscription from "@/components/transcribeDemo"

const APP_ID = "f74c9f2bc19849b5b2a2df2aac5db369"
const TOKEN = "007eJxTYGj84LoqRsC894hG1Z9ah2BbKTuPS8wyJuwmTlcEinRdVRUY0sxNki3TjJKSDS0tTCyTTJOMEo1S0owSE5NNU5KMzSxzeX6kNwQyMuwwvcDCyACBID4LQ1pidgYDAwAr2xvj"
const CHANNEL = "fakh"
const sessionData = {
  id: "1",
  patient: {
    name: "John Patient",
    avatar: "/placeholder.svg?height=80&width=80",
    issues: "Anxiety, Depression",
    age: 32,
    gender: "Male",
    sessionCount: 8,
  },
  date: "May 15, 2025",
  time: "3:00 PM",
  duration: "50 minutes",
  status: "active",
}

const transcriptData = [
  {
    id: "1",
    speaker: "Dr. Thomas",
    text: "Hello John, it's good to see you today. How have you been since our last session?",
    timestamp: "00:15",
  },
  {
    id: "2",
    speaker: "John Patient",
    text: "I've been doing okay. I tried the mindfulness exercises you suggested, and they helped a bit with my anxiety.",
    timestamp: "00:30",
  },
  {
    id: "3",
    speaker: "Dr. Thomas",
    text: "That's great to hear. Can you tell me more about when you practiced the exercises and how they helped?",
    timestamp: "00:45",
  },
  {
    id: "4",
    speaker: "John Patient",
    text: "I tried them in the mornings before work, and also when I felt overwhelmed during the day. They helped me focus on my breathing instead of worrying thoughts.",
    timestamp: "01:10",
  },
  {
    id: "5",
    speaker: "Dr. Thomas",
    text: "That's excellent. Mindfulness can be a powerful tool for managing anxiety in the moment. Let's talk about some additional strategies you might find helpful.",
    timestamp: "01:30",
  },
]

const detectedTerms = [
  {
    id: "1",
    term: "anxiety",
    definition:
      "A mental health disorder characterized by feelings of worry, anxiety, or fear that are strong enough to interfere with one's daily activities.",
    timestamp: "00:30",
    relatedRecords: true,
  },
  {
    id: "2",
    term: "mindfulness",
    definition:
      "A mental state achieved by focusing one's awareness on the present moment, while calmly acknowledging and accepting one's feelings, thoughts, and bodily sensations.",
    timestamp: "00:30",
    relatedRecords: false,
  },
  {
    id: "3",
    term: "depression",
    definition:
      "A mental health disorder characterized by persistently depressed mood or loss of interest in activities, causing significant impairment in daily life.",
    timestamp: "02:15",
    relatedRecords: true,
  },
]

const patientHistory = {
  diagnoses: [
    { condition: "Generalized Anxiety Disorder", diagnosedDate: "January 15, 2024", status: "Active" },
    { condition: "Major Depressive Disorder", diagnosedDate: "January 15, 2024", status: "Active" },
  ],
  medications: [
    { name: "Sertraline", dosage: "50mg daily", startDate: "February 1, 2024", status: "Current" },
    { name: "Lorazepam", dosage: "0.5mg as needed", startDate: "February 1, 2024", status: "Current" },
  ],
  previousSessions: [
    {
      date: "May 8, 2025",
      notes:
        "Patient reported improved sleep patterns but continued anxiety in social situations. We practiced mindfulness techniques and discussed cognitive restructuring for negative thoughts.",
    },
    {
      date: "May 1, 2025",
      notes:
        "Initial assessment. Patient presents with symptoms of anxiety and depression. Reported difficulty sleeping and persistent worry about work and relationships.",
    },
  ],
  goals: [
    "Reduce anxiety symptoms",
    "Improve sleep quality",
    "Develop coping strategies for stress",
    "Address negative thought patterns",
  ],
}

const VideoCall = ({ onLeave }: { onLeave: () => void }) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [remoteUsers, setRemoteUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mainUser, setMainUser] = useState<any>(null)

  const clientRef = useRef<any>(null)
  const tracksRef = useRef<any[]>([])
  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteContainerRef = useRef<HTMLDivElement>(null)
  const smallVideoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initAgora = async () => {
      try {
        setIsLoading(true)
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default
        const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
        clientRef.current = rtcClient

        const handleUserPublished = async (user: any, mediaType: string) => {
          await rtcClient.subscribe(user, mediaType)
          setRemoteUsers(prev => {
            const existingUser = prev.find(u => u.uid === user.uid)
            return existingUser 
              ? prev.map(u => u.uid === user.uid ? { ...u, [mediaType]: user[mediaType + 'Track'] } : u)
              : [...prev, { 
                  uid: user.uid, 
                  video: mediaType === 'video' ? user.videoTrack : null,
                  audio: mediaType === 'audio' ? user.audioTrack : null
                }]
          })

          if (mediaType === 'audio') user.audioTrack?.play()
          if (mediaType === 'video' && !mainUser) setMainUser(user)
        }

        const handleUserLeft = (user: any) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
          if (mainUser?.uid === user.uid) {
            setMainUser(remoteUsers.find(u => u.uid !== user.uid && u.video) || null)
          }
        }

        rtcClient.on('user-published', handleUserPublished)
        rtcClient.on('user-left', handleUserLeft)

        await rtcClient.join(APP_ID, CHANNEL, TOKEN, null)
        
        const [micTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
        tracksRef.current = [micTrack, cameraTrack]
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const data =startAgoraTranscriptionClient(stream)
        console.log(data)
        
        
        await rtcClient.publish([micTrack, cameraTrack])
        if (localVideoRef.current) cameraTrack.play(localVideoRef.current)

        setIsLoading(false)
      } catch (error) {
        console.error('Agora initialization failed:', error)
        setIsLoading(false)
      }
    }

    initAgora()

    return () => {
      tracksRef.current.forEach(track => {
        track?.stop()
        track?.close()
      })
      if (clientRef.current) {
        clientRef.current.leave()
        clientRef.current.removeAllListeners()
      }
    }
  }, [])

  useEffect(() => {
    if (!remoteContainerRef.current || !smallVideoContainerRef.current) return

    smallVideoContainerRef.current.innerHTML = ''

    if (mainUser?.video) {
      remoteContainerRef.current.innerHTML = ''
      mainUser.video.play(remoteContainerRef.current)
    }

    remoteUsers.forEach((user, index) => {
      if (!user.video || user.uid === mainUser?.uid) return

      const container = document.createElement('div')
      container.className = 'bg-black rounded border-2 border-background overflow-hidden shadow-lg cursor-pointer'
      container.style.bottom = '4px'
      container.style.left = `${4 + index * 28}px`
      container.style.zIndex = '10'
      container.style.width = "500px"
      container.style.height = "300px"
      container.style.position = 'absolute'
      container.onclick = () => setMainUser(user)
      
      smallVideoContainerRef.current?.appendChild(container)
      user.video.play(container)
    })
  }, [remoteUsers, mainUser])

  const toggleCamera = () => {
    if (tracksRef.current[1]) {
      tracksRef.current[1].setEnabled(!isVideoEnabled)
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  const toggleMic = () => {
    if (tracksRef.current[0]) {
      tracksRef.current[0].setEnabled(!isAudioEnabled)
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  const handleLeave = async () => {
    tracksRef.current.forEach(track => track?.close())
    if (clientRef.current) {
      await clientRef.current.leave()
    }
    onLeave()
  }

  if (isLoading) {
    return (
      <div className="relative bg-muted rounded-lg overflow-hidden flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Setting up video call...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative bg-muted rounded-lg overflow-hidden flex-1 flex items-center justify-center">
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div ref={remoteContainerRef} className="w-full h-full flex items-center justify-center">
            {!mainUser?.video && (
              <Avatar className="h-32 w-32">
                <AvatarImage src={sessionData.patient.avatar} />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            )}
          </div>
          
          <div ref={smallVideoContainerRef} className="absolute bottom-32 left-4 flex gap-2"></div>
          
          <div ref={localVideoRef} className="absolute bottom-4 right-4 w-32 h-24 bg-black rounded-lg overflow-hidden border-2 border-background shadow-lg z-10">
            {!isVideoEnabled && (
              <div className="w-full h-full flex items-center justify-center text-white">
                <VideoOff className="h-5 w-5" />
              </div>
            )}
          </div>
          
          {remoteUsers.length > 0 && (
            <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
              {remoteUsers.length} remote {remoteUsers.length === 1 ? 'user' : 'users'} connected
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Connected:</span>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {remoteUsers.length + 1} users
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={!isAudioEnabled ? "bg-destructive" : ""}
            onClick={toggleMic}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={!isVideoEnabled ? "bg-destructive" : ""}
            onClick={toggleCamera}
          >
            {isVideoEnabled ? <Video /> : <VideoOff />}
          </Button>
          <Button variant="outline" size="icon">
            <Monitor />
          </Button>
          <Button variant="destructive" onClick={handleLeave}>
            <Phone className="mr-2" />
            End Call
          </Button>
        </div>
      </div>
    </>
  )
}

export default function TherapistSessionPage({ params }: { params: { id: string } }) {
  const [isConnected, setIsConnected] = useState(false)
  const [chatMessages, setChatMessages] = useState<
    Array<{
      sender: string
      message: string
      timestamp: string
    }>
  >([])
  const [messageInput, setMessageInput] = useState("")
  const [sessionNotes, setSessionNotes] = useState("")
  const [transcript, setTranscript] = useState(transcriptData)
  const [detectedMedicalTerms, setDetectedMedicalTerms] = useState(detectedTerms)
  const [sessionTime, setSessionTime] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const startSession = () => {
    setIsConnected(true)
  }
  
  const endSession = () => {
    setIsConnected(false)
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  
  useEffect(() => {
    if (isConnected && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      const transcriptInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const newEntry = {
            id: `${transcript.length + 1}`,
            speaker: Math.random() > 0.5 ? "Dr. Thomas" : "John Patient",
            text: "This is a simulated live transcript entry to demonstrate real-time transcription during the therapy session.",
            timestamp: formatTime(sessionTime),
          }
          setTranscript((prev) => [...prev, newEntry])

          if (Math.random() > 0.8) {
            const terms = ["insomnia", "panic attack", "cognitive distortion", "rumination", "social anxiety"]
            const randomTerm = terms[Math.floor(Math.random() * terms.length)]

            const newTerm = {
              id: `${detectedMedicalTerms.length + 4}`,
              term: randomTerm,
              definition: `This is a definition for ${randomTerm} that would help the therapist understand the concept.`,
              timestamp: formatTime(sessionTime),
              relatedRecords: Math.random() > 0.5,
            }

            setDetectedMedicalTerms((prev) => [...prev, newTerm])
          }
        }
      }, 5000)

      const suggestionsInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const suggestions = [
            "Consider exploring the patient's sleep patterns in more detail.",
            "The patient mentioned work stress - this might be worth discussing further.",
            "Patient shows improvement in applying mindfulness techniques.",
            "Consider assigning a thought record for negative thought patterns.",
            "Might benefit from additional relaxation techniques for anxiety management.",
          ]

          const newSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
          if (!aiSuggestions.includes(newSuggestion)) {
            setAiSuggestions((prev) => [...prev, newSuggestion])
          }
        }
      }, 10000)

      return () => {
        clearInterval(transcriptInterval)
        clearInterval(suggestionsInterval)
      }
    }
  }, [isConnected, sessionTime, transcript.length, detectedMedicalTerms.length, aiSuggestions])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (messageInput.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          sender: "You",
          message: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setMessageInput("")

      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: sessionData.patient.name,
            message: "Thank you, that's helpful to know.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }, 3000)
    }
  }

  const addSuggestionToNotes = (suggestion: string) => {
    setSessionNotes((prev) => prev + (prev ? "\n\n" : "") + suggestion)
    setAiSuggestions((prev) => prev.filter((s) => s !== suggestion))
  }


  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Start capturing audio when the component is mounted
  useEffect(() => {
    const startAudioCapture = async () => {
      try {
        // Use the browser's media devices API to capture audio
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream);  // Set the media stream to start transcription
      } catch (error) {
        console.error('Error capturing audio:', error);
      }
    };

    startAudioCapture();

    // Clean up the media stream when the component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());  // Stop the tracks to release resources
      }
    };
  }, []);


   function AgoraTranscriptionDemo() {
    const [transcriptionText, setTranscriptionText] = useState<string>("");
    const [transcriptionActive, setTranscriptionActive] = useState<boolean>(false);
    // We'll store our transcription client so we can later stop it.
    let transcriptionClient: { stopTranscription: () => void } | null = null;
  
    // This function initializes the Agora RTC tracks, extracts the native audio stream,
    // and starts the transcription client.
    async function initTranscription() {
      try {
        // Create the Agora microphone and camera tracks.
        const [micTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        
        // Get the native MediaStreamTrack from the Agora mic track.
        // (Make sure the Agora track exposes getMediaStreamTrack()—check Agora's docs if needed.)
        const audioMediaStreamTrack = micTrack.getMediaStreamTrack();
        
        // Create a new MediaStream from the native audio track.
        const audioStream = new MediaStream([audioMediaStreamTrack]);
  
        // Start the transcription client using our utility function.
        // We provide a callback to update the transcript state when new transcript text is received.
        transcriptionClient = startAgoraTranscriptionClient(audioStream, (text: string) => {
          // Append or update the transcript text in state.
          setTranscriptionText((prev) => prev + " " + text);
        });
        setTranscriptionActive(true);
      } catch (error) {
        console.error("Error initializing Agora transcription:", error);
      }
    }
  
    // Function to stop the transcription session.
    const stopTranscription = () => {
      if (transcriptionClient) {
        transcriptionClient.stopTranscription();
        setTranscriptionActive(false);
      }
    };
  
    // Start transcription when the component mounts.
    useEffect(() => {
      initTranscription();
  
      // Cleanup: stop transcription on unmount.
      return () => {
        if (transcriptionClient) {
          transcriptionClient.stopTranscription();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Agora RTC Live Transcription Demo</h1>
        <p>This demo captures Agora RTC audio, sends it for live transcription, and displays the transcript text below.</p>
        
        <div style={{ marginBottom: "1rem" }}>
          <textarea
            value={transcriptionText}
            readOnly
            placeholder="Transcript text will appear here..."
            style={{ width: "100%", height: "200px", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>
        
        <div>
          <button
            onClick={stopTranscription}
            disabled={!transcriptionActive}
            style={{ padding: "0.5rem 1rem" }}
          >
            Stop Transcription
          </button>
        </div>
      </div>
    );
  }





  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-background p-4 sticky top-0 z-10">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/therapist/dashboard">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Session with {sessionData.patient.name}</h1>
            <p className="text-sm text-muted-foreground">
              {sessionData.date} at {sessionData.time} ({sessionData.duration})
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-auto flex items-center gap-1.5 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Session
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              {formatTime(sessionTime)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="container py-6 h-full flex flex-col">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col">
                {!isConnected ? (
                  <div className="relative bg-muted rounded-lg overflow-hidden flex-1 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="animate-pulse rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-lg font-medium">Ready to start your session</p>
                      <p className="text-sm text-muted-foreground mb-4">Connect with your patient</p>
                      <Button variant="default" onClick={startSession}>
                        Start Session
                      </Button>
                    </div>
                  </div>
                ) : (
                  <VideoCall onLeave={endSession} />
                )}
              </div>
              <AgoraTranscriptionDemo></AgoraTranscriptionDemo>
              <div className="h-full">
                <Tabs defaultValue="notes" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="terms" className="relative">
                      Terms
                      {detectedMedicalTerms.some((term) => !term.viewed) && (
                        <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="patient">Patient</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="flex-1">
                    <Card className="h-full flex flex-col">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-blue -600" />
                          Session Notes
                          <Badge
                            variant="outline"
                            className="ml-auto bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            Auto-saving
                          </Badge>
                        </CardTitle>
                        <CardDescription>Clinical notes for this session</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col gap-4 p-0">
                        <div className="flex-1 flex">
                          <TherapyNotes
                            value={sessionNotes}
                            onChange={setSessionNotes}
                            suggestions={aiSuggestions}
                            onUseSuggestion={addSuggestionToNotes}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transcript" className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col">
                      <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            Live Transcript
                            <Badge
                              variant="outline"
                              className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            >
                              Live
                            </Badge>
                          </CardTitle>
                          <CardDescription>Real-time transcription of your session</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Search className="h-3.5 w-3.5" />
                            <span>Search</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            <span>Export</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        <LiveTranscript transcript={transcript} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="terms" className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          Detected Medical Terms
                        </CardTitle>
                        <CardDescription>AI-detected terms from your conversation</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        <MedicalTermDetector terms={detectedMedicalTerms} patientHistory={patientHistory} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="patient" className="flex-1">
                    <Card className="h-full flex flex-col">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Patient Information
                        </CardTitle>
                        <CardDescription>Details about {sessionData.patient.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-auto">
                        <PatientHistory patient={sessionData.patient} history={patientHistory} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
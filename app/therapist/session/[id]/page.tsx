"use client" 

import { useState, useEffect, useRef, FormEvent } from "react"
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
  Download,
  Copy
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { LiveTranscript } from "@/components/live-transcript"
import { MedicalTermDetector } from "@/components/medical-term-detector"
import { PatientHistory } from "@/components/patient-history"
import { TherapyNotes } from "@/components/therapy-notes"

const APP_ID = "f74c9f2bc19849b5b2a2df2aac5db369"
const TOKEN = "007eJxTYGj84LoqRsC894hG1Z9ah2BbKTuPS8wyJuwmTlcEinRdVRUY0sxNki3TjJKSDS0tTCyTTJOMEo1S0owSE5NNU5KMzSxzeX6kNwQyMuwwvcDCyACBID4LQ1pidgYDAwAr2xvj"
const CHANNEL = "fakh"

// Types
interface TranscriptEntry {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
  isInterim?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: (event: Event) => void;
  onaudiostart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: Event & { error: string }) => void;
  onnomatch: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onsoundend: (event: Event) => void;
  onsoundstart: (event: Event) => void;
  onspeechend: (event: Event) => void;
  onspeechstart: (event: Event) => void;
  onstart: (event: Event) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Term {
  id: string;
  term: string;
  definition: string;
  timestamp: string;
  relatedRecords: boolean;
  viewed?: boolean;
}

interface Patient {
  name: string;
  avatar: string;
  issues: string;
  age: number;
  gender: string;
  sessionCount: number;
}

interface SessionData {
  id: string;
  patient: Patient;
  date: string;
  time: string;
  duration: string;
  status: string;
}

interface PatientHistoryData {
  diagnoses: Array<{
    condition: string;
    diagnosedDate: string;
    status: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    startDate: string;
    status: string;
  }>;
  previousSessions: Array<{
    date: string;
    notes: string;
  }>;
  goals: string[];
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

interface VideoCallProps {
  onLeave: () => void;
  onTranscript?: (text: string, isFinal: boolean, speaker?: string) => void;
}

// Session data
const sessionData: SessionData = {
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

const initialTerms: Term[] = [
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

const patientHistory: PatientHistoryData = {
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

// Helper functions
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Speech recognition service
class TranscriptionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onTranscriptCallback: ((text: string, isFinal: boolean, speaker?: string) => void) | null = null;
  private currentSpeaker = "Dr. Thomas";
  private restartTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error("Speech Recognition API not supported in this browser");
        return;
      }
      
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = this.handleRecognitionResult.bind(this);
      this.recognition.onerror = this.handleRecognitionError.bind(this);
      this.recognition.onend = this.handleRecognitionEnd.bind(this);
    }
  }

  private handleRecognitionResult(event: SpeechRecognitionEvent) {
    if (!this.onTranscriptCallback) return;
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript.trim();
      
      if (!transcript) continue;
      
      this.onTranscriptCallback(
        transcript,
        result.isFinal,
        this.currentSpeaker
      );
    }
  }

  private handleRecognitionError(event: Event & { error: string }) {
    console.error('Speech recognition error:', event.error);
    this.isListening = false;
    
    if (event.error === 'not-allowed') {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use speech recognition.",
        variant: "destructive"
      });
    } else if (event.error === 'network') {
      toast({
        title: "Network error",
        description: "Check your internet connection and try again.",
        variant: "destructive"
      });
    }
  }

  private handleRecognitionEnd() {
    // Auto-restart if still in listening state but recognition stopped
    if (this.isListening && this.recognition) {
      // Use a small delay to prevent rapid restart loops
      this.restartTimeout = setTimeout(() => {
        try {
          this.recognition?.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
          this.isListening = false;
        }
      }, 1000);
    }
  }

  public start(callback: (text: string, isFinal: boolean, speaker?: string) => void) {
    if (!this.recognition) {
      this.initialize();
      
      if (!this.recognition) {
        toast({
          title: "Speech recognition unavailable",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    this.onTranscriptCallback = callback;
    
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.isListening = false;
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      
      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = null;
      }
      
      return true;
    }
    return false;
  }

  public isActive(): boolean {
    return this.isListening;
  }

  public setSpeaker(speaker: string) {
    this.currentSpeaker = speaker;
  }
}

// VideoCall component
const VideoCall = ({ onLeave, onTranscript }: VideoCallProps) => {
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

          if (mediaType === 'audio') {
            user.audioTrack?.play()
            
            // Simulate speech from remote user for transcript
           
          }
          
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
        
        await rtcClient.publish([micTrack, cameraTrack])
        if (localVideoRef.current) cameraTrack.play(localVideoRef.current)

        setIsLoading(false)
      } catch (error) {
        console.error('Agora initialization failed:', error)
        setIsLoading(false)
        
        toast({
          title: "Video connection failed",
          description: "Could not connect to video service. Please try again.",
          variant: "destructive"
        })
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={!isAudioEnabled ? "bg-destructive" : ""}
                  onClick={toggleMic}
                >
                  {isAudioEnabled ? <Mic /> : <MicOff />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={!isVideoEnabled ? "bg-destructive" : ""}
                  onClick={toggleCamera}
                >
                  {isVideoEnabled ? <Video /> : <VideoOff />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isVideoEnabled ? "Turn off camera" : "Turn on camera"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Monitor />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Share screen
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="destructive" onClick={handleLeave}>
            <Phone className="mr-2" />
            End Call
          </Button>
        </div>
      </div>
    </>
  )
}

// Main component
export default function TherapistSessionPage({ params }: { params: { id: string } }) {
  const [isConnected, setIsConnected] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [sessionNotes, setSessionNotes] = useState("")
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [detectedMedicalTerms, setDetectedMedicalTerms] = useState<Term[]>(initialTerms)
  const [sessionTime, setSessionTime] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true)
  const transcriptionServiceRef = useRef<TranscriptionService | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptExportRef = useRef<HTMLAnchorElement | null>(null)
  
  // Initialize transcription service
  useEffect(() => {
    try {
      transcriptionServiceRef.current = new TranscriptionService();
      setSpeechRecognitionSupported(true);
    } catch (error) {
      console.error("Failed to initialize transcription service:", error);
      setSpeechRecognitionSupported(false);
    }
    
    return () => {
      if (transcriptionServiceRef.current?.isActive()) {
        transcriptionServiceRef.current.stop();
      }
    };
  }, []);
  
  const handleTranscriptData = (text: string, isFinal: boolean, speaker: string = "Dr. Thomas") => {
    setTranscript(prev => {
      // Filter out interim entries
      const filteredTranscript = prev.filter(entry => !entry.isInterim);
      
      if (isFinal) {
        // Add as final entry
        return [...filteredTranscript, {
          id: `final-${Date.now()}`,
          speaker,
          text,
          timestamp: formatTime(sessionTime),
          isInterim: false
        }];
      } else {
        // Add as interim entry (will be replaced by next update)
        return [...filteredTranscript, {
          id: `interim-${Date.now()}`,
          speaker,
          text,
          timestamp: formatTime(sessionTime),
          isInterim: true
        }];
      }
    });
    
    // Process for medical terms when final
    if (isFinal) {
      detectMedicalTerms(text);
      generateAISuggestion(text);
    }
  };
  
  const toggleSpeechRecognition = () => {
    if (!transcriptionServiceRef.current) return;
    
    if (isListening) {
      const stopped = transcriptionServiceRef.current.stop();
      if (stopped) setIsListening(false);
    } else {
      const started = transcriptionServiceRef.current.start(handleTranscriptData);
      if (started) setIsListening(true);
    }
  };
  
  // Medical term detection (simplified simulation)
  const detectMedicalTerms = (text: string) => {
    const terms = [
      { term: "insomnia", definition: "Persistent problems falling and staying asleep." },
      { term: "anxiety", definition: "Feelings of worry, nervousness, or unease about something." },
      { term: "depression", definition: "Feelings of severe despondency and dejection." },
      { term: "panic attack", definition: "A sudden episode of intense fear triggering severe physical reactions." },
      { term: "cognitive restructuring", definition: "A therapeutic technique for identifying and disputing irrational thoughts." },
      { term: "mindfulness", definition: "A mental state achieved by focusing awareness on the present moment." }
    ];
    
    const textLower = text.toLowerCase();
    
    for (const term of terms) {
      if (textLower.includes(term.term)) {
        const newTerm = {
          id: `term-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          term: term.term,
          definition: term.definition,
          timestamp: formatTime(sessionTime),
          relatedRecords: Math.random() > 0.5,
        };
        
        setDetectedMedicalTerms(prev => {
          // Check if we already detected this term recently
          const existingTerm = prev.find(t => 
            t.term === newTerm.term && 
            parseInt(t.timestamp.split(':')[0]) * 60 + parseInt(t.timestamp.split(':')[1]) > 
            sessionTime - 120 // Don't add duplicate terms within 2 minutes
          );
          
          if (existingTerm) return prev;
          return [...prev, newTerm];
        });
      }
    }
  };
  
  // AI suggestion generation (simulation)
  const generateAISuggestion = (text: string) => {
    const textLower = text.toLowerCase();
    
    const suggestions = [
      { trigger: "sleep", suggestion: "Consider exploring the patient's sleep hygiene practices and routines." },
      { trigger: "work", suggestion: "Workplace stressors appear significant - explore impact on daily functioning." },
      { trigger: "family", suggestion: "Family dynamics may be contributing to current symptoms - consider further exploration." },
      { trigger: "anxious", suggestion: "Patient shows anxiety symptoms - consider screening for generalized anxiety disorder." },
      { trigger: "sad", suggestion: "Note signs of depressed mood - monitor for clinical depression indicators." }
    ];
    
    for (const s of suggestions) {
      if (textLower.includes(s.trigger)) {
        setAiSuggestions(prev => {
          if (prev.includes(s.suggestion)) return prev;
          return [...prev, s.suggestion];
        });
        break;
      }
    }
  };
  
  const startSession = () => {
    setIsConnected(true);
  };
  
  const endSession = () => {
    setIsConnected(false);
    if (isListening && transcriptionServiceRef.current) {
      transcriptionServiceRef.current.stop();
      setIsListening(false);
    }
  };
  
  // Session timer
  useEffect(() => {
    if (isConnected && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isConnected]);

  // Export transcript functionality
  const exportTranscript = () => {
    // Format transcript data for export
    const formattedData = transcript
      .filter(entry => !entry.isInterim)
      .map(entry => `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`)
      .join('\n\n');
    
    const header = `Session Transcript: ${sessionData.patient.name}\nDate: ${sessionData.date}\nDuration: ${formatTime(sessionTime)}\n\n`;
    const content = header + formattedData;
    
    // Create a blob and download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript_${sessionData.patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
    
    toast({
      title: "Transcript exported",
      description: "Session transcript has been downloaded successfully."
    });
  };
  
  // Copy transcript to clipboard
  const copyTranscriptToClipboard = () => {
    const formattedData = transcript
      .filter(entry => !entry.isInterim)
      .map(entry => `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(formattedData)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Transcript copied to clipboard successfully."
        });
      })
      .catch(err => {
        console.error('Could not copy text:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy transcript to clipboard.",
          variant: "destructive"
        });
      });
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (messageInput.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          sender: "You",
          message: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setMessageInput("");

      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: sessionData.patient.name,
            message: "Thank you, that's helpful to know.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 3000);
    }
  };

  const addSuggestionToNotes = (suggestion: string) => {
    setSessionNotes((prev) => prev + (prev ? "\n\n" : "") + suggestion);
    setAiSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

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
                  <VideoCall 
                    onLeave={endSession} 
                    onTranscript={handleTranscriptData} 
                  />
                )}
              </div>

              <div className="h-full">
                <Tabs defaultValue="transcript" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="transcript" className="relative">
                      Transcript
                      {isListening && (
                        <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      )}
                    </TabsTrigger>
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
                          <ClipboardList className="h-5 w-5 text-blue-600" />
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
                            {isListening && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-200 dark:border-green-800"
                              >
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1"></span>
                                Recording
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>Real-time transcription of your session</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {speechRecognitionSupported && (
                            <Button
                              variant={isListening ? "default" : "outline"}
                              size="sm"
                              className="h-8 gap-1"
                              onClick={toggleSpeechRecognition}
                            >
                              {isListening ? (
                                <>
                                  <MicOff className="h-3.5 w-3.5" />
                                  <span>Stop Dictation</span>
                                </>
                              ) : (
                                <>
                                  <Mic className="h-3.5 w-3.5" />
                                  <span>Start Dictation</span>
                                </>
                              )}
                            </Button>
                          )}
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm" 
                                  className="h-8 gap-1"
                                  onClick={copyTranscriptToClipboard}
                                  disabled={transcript.length === 0}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  <span className="sr-only md:not-sr-only md:inline-block">Copy</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Copy transcript to clipboard
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 gap-1"
                                  onClick={exportTranscript}
                                  disabled={transcript.length === 0}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span className="sr-only md:not-sr-only md:inline-block">Export</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Export transcript as text file
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden p-0">
                        {transcript.length > 0 ? (
                          <LiveTranscript transcript={transcript} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-center p-4">
                            <div>
                              <p className="text-muted-foreground mb-2">No transcript data yet</p>
                              {speechRecognitionSupported && !isListening && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={toggleSpeechRecognition}
                                >
                                  <Mic className="h-4 w-4 mr-2" />
                                  Start Transcription
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
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
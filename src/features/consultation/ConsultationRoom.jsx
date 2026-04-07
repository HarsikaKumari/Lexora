import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Video, Mic, VideoOff, MicOff, PhoneOff, MessageSquare, Shield, Users, Globe } from 'lucide-react'

export default function ConsultationRoom({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const jitsiContainerRef = useRef(null)
  const [jitsiApi, setJitsiApi] = useState(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)

  useEffect(() => {
    // Initialize Jitsi Meet External API
    const domain = "meet.jit.si";
    const options = {
      roomName: `LexiLink-Consultation-${id || 'General'}`,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: user?.name || user?.email || "Legal Participant",
        email: user?.email || ""
      },
      configOverwrite: {
        startWithAudioMuted: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fims-whiteboard', 'raisehand', 'videoquality', 'filmstrip',
          'shortcuts', 'tileview', 'videobackgroundblur', 'help', 'mute-everyone',
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'profile'],
      }
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    setJitsiApi(api);

    // Event Listeners
    api.addEventListeners({
      videoConferenceLeft: () => navigate('/dashboard'),
      audioMuteStatusChanged: (e) => setIsMicOn(!e.muted),
      videoMuteStatusChanged: (e) => setIsVideoOn(!e.muted),
    });

    return () => {
      if (api) api.dispose();
    };
  }, [id, user, navigate]);

  const toggleAudio = () => {
    if (jitsiApi) jitsiApi.executeCommand('toggleAudio');
  };

  const toggleVideo = () => {
    if (jitsiApi) jitsiApi.executeCommand('toggleVideo');
  };

  const handleHangup = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-secondary-950 flex flex-col">
      <div className="flex-grow relative flex flex-col md:flex-row">
        {/* Main Video Area */}
        <div className="flex-grow p-4 relative group">
          <div className="absolute top-8 left-8 z-20 flex items-center gap-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            <span className="h-2 w-2 rounded-full bg-white" />
            LIVE CONSULTATION
          </div>
          
          <div ref={jitsiContainerRef} className="h-full rounded-3xl bg-secondary-900 border border-secondary-800 shadow-2xl overflow-hidden">
             {/* Jitsi iframe will be injected here */}
          </div>
        </div>

        {/* Sidebar: Chat/Notes/Info */}
        <div className="w-full md:w-96 p-4 flex flex-col h-full md:h-auto gap-4">
           {/* Connection Info */}
           <div className="bg-secondary-800 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-primary-400" />
                <h4 className="text-white font-bold text-sm tracking-tight">Secured via Jitsi</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs text-secondary-400">
                   <span>Room Name</span>
                   <span className="text-primary-300 font-mono">LEX-{id?.substring(0,4).toUpperCase()}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-secondary-400">
                   <span>Encryption</span>
                   <span className="text-emerald-400">Active</span>
                 </div>
              </div>
           </div>

           {/* Info Box */}
           <div className="flex-grow bg-secondary-900 rounded-3xl p-8 border border-white/5 flex flex-col justify-center text-center">
              <Globe className="h-12 w-12 text-primary-600 mx-auto mb-6 opacity-50" />
              <h3 className="text-white font-serif font-bold text-lg mb-2">Global Connectivity</h3>
              <p className="text-secondary-500 text-xs leading-relaxed">
                You are connected to a secure LexiLink node. All data is routed through encrypted tunnels.
              </p>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-secondary-900 border-t border-white/10 px-8 flex items-center justify-between shadow-2xl relative z-30">
        <div className="flex items-center gap-6">
           <div className="flex flex-col">
              <span className="text-white font-serif font-bold text-lg leading-none">LexiLink</span>
              <span className="text-[10px] text-primary-400 font-bold tracking-[.2em]">Live Video Consultation</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all group ${isMicOn ? 'bg-secondary-800 text-white hover:bg-secondary-700' : 'bg-red-600 text-white'}`}
          >
            {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </button>
          <button 
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all group ${isVideoOn ? 'bg-secondary-800 text-white hover:bg-secondary-700' : 'bg-red-600 text-white'}`}
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </button>
          <button 
            onClick={handleHangup}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/30"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 group cursor-pointer transition-colors hover:text-white">
              <Users className="h-5 w-5 text-secondary-400 group-hover:text-primary-400" />
              <span className="text-xs text-secondary-400 font-semibold uppercase group-hover:text-white transition-colors">Participants</span>
           </div>
        </div>
      </div>
    </div>
  )
}

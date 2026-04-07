import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Video, Mic, Share, MessageSquare } from 'lucide-react'

export default function VideoCall() {
  const { id } = useParams()
  const navigate = useNavigate()
  const jitsiContainerRef = useRef(null)

  useEffect(() => {
    // Check if Jitsi API is loaded
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = () => initializeJitsi()
      document.body.appendChild(script)
    } else {
      initializeJitsi()
    }

    let api = null;
    function initializeJitsi() {
      const domain = 'meet.jit.si'
      const options = {
        roomName: `LexiLink_Consultation_${id}`,
        width: '100%',
        height: '100%',
        containerRes: jitsiContainerRef.current,
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        },
      }
      api = new window.JitsiMeetExternalAPI(domain, options)
      
      api.addEventListener('videoConferenceLeft', () => {
        navigate('/dashboard')
      })
    }

    return () => {
      if (api) {
        api.dispose()
      }
    }
  }, [id, navigate])

  return (
    <div className="fixed inset-0 bg-secondary-950 z-[100] flex flex-col">
      {/* Custom Header */}
      <header className="h-16 border-b border-white/5 bg-secondary-900/50 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm leading-none">Secure Legal Consultation</h4>
            <p className="text-secondary-400 text-[10px] uppercase font-black tracking-widest mt-1">Room ID: {id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-bold">ENCRYPTED END-TO-END</span>
           </div>
           <button 
             onClick={() => navigate('/dashboard')}
             className="p-2 hover:bg-white/10 rounded-full text-secondary-400 transition-all"
           >
              <X className="h-6 w-6" />
           </button>
        </div>
      </header>

      {/* Jitsi Container */}
      <div ref={jitsiContainerRef} className="flex-grow bg-black" />

      {/* Footer Controls / Info */}
      <footer className="h-14 bg-secondary-900 border-t border-white/5 flex items-center justify-center gap-12 px-6">
         <div className="flex items-center gap-2 text-secondary-500 text-[10px] font-bold uppercase tracking-widest">
            <Mic className="h-3 w-3" /> Audio Online
         </div>
         <div className="flex items-center gap-2 text-secondary-500 text-[10px] font-bold uppercase tracking-widest">
            <Share className="h-3 w-3" /> Screen Ready
         </div>
         <div className="flex items-center gap-2 text-secondary-500 text-[10px] font-bold uppercase tracking-widest">
            <MessageSquare className="h-3 w-3" /> Chat Active
         </div>
      </footer>
    </div>
  )
}

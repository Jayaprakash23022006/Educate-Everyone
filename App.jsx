import { useState, useEffect, useRef, useCallback } from "react";
import {
  GraduationCap, Eye, Ear, BookOpen, Users, Send, Volume2, Fingerprint,
  Search, FileText, MessageSquare, ArrowRight, ArrowLeft, Play, Sparkles,
  Hand, Mic, MicOff, LogOut, ChevronRight, BookMarked, Brain,
} from "lucide-react";

// ── TOKENS ──────────────────────────────────────────────────────────────────
const AC = { bpl:"#FFB347", vi:"#00E5CC", hi:"#BF7FFF", college:"#FF6F6F", staff:"#5B9FFF" };
const BA="#7C4DFF", BB="#FF4D8D";
const BG="#08080F", SUR="#10101E", CARD="#15152A";
const BOR="#1E1E3A", BOR2="#2A2A4A";
const TX="#EEEEFF", MU="#7070A0", FA="#303050";
const FD="'Fraunces',serif", FB="'Inter',sans-serif";
const TL={lessonplan:"Lesson Plan",material:"Material",question:"Important Q",idea:"Idea"};

const glow=(c,p=16)=>`0 0 ${p}px ${c}55,0 0 ${p*2}px ${c}22`;
const hex=(c,a)=>c+Math.round(a*255).toString(16).padStart(2,"0");

function speak(txt,rate=1){
  if(!window.speechSynthesis)return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(txt);
  u.rate=rate; u.lang="en-IN";
  window.speechSynthesis.speak(u);
}

// ── SCHOOL DATA ──────────────────────────────────────────────────────────────
const SCH=[
  {name:"Mathematics",icon:"➗",topics:[
    {title:"Fractions Made Simple",q:"fractions explained simply for school students"},
    {title:"Algebra Basics",q:"algebra basics for beginners"},
    {title:"Geometry: Angles and Shapes",q:"geometry angles shapes basics"},
    {title:"Area and Perimeter",q:"area and perimeter explained for students"},
  ]},
  {name:"Science",icon:"🔬",topics:[
    {title:"The Water Cycle",q:"water cycle explained for students"},
    {title:"Introduction to Cells",q:"introduction to cells biology basics"},
    {title:"Newton Laws of Motion",q:"newtons laws of motion explained simply"},
    {title:"Electricity Basics",q:"electricity basics for school students"},
  ]},
  {name:"English",icon:"📖",topics:[
    {title:"Improving Vocabulary",q:"how to improve english vocabulary daily"},
    {title:"Tenses Made Easy",q:"english tenses explained easy"},
    {title:"Letter Writing",q:"formal letter writing basics"},
    {title:"Essay Writing Tips",q:"how to write a good essay school students"},
  ]},
  {name:"Social Studies",icon:"🌍",topics:[
    {title:"Our Constitution",q:"indian constitution overview for students"},
    {title:"Map Reading Skills",q:"map reading skills for beginners"},
    {title:"Ancient Civilisations",q:"ancient civilisations india for students"},
  ]},
];

// ── COLLEGE DATA ─────────────────────────────────────────────────────────────
const COL=[
  {name:"Programming",icon:"💻",topics:[
    {title:"Loops and Conditionals",q:"loops and conditionals explained for beginners"},
    {title:"Object-Oriented Programming",q:"object oriented programming basics explained"},
    {title:"Arrays vs Linked Lists",q:"arrays vs linked lists explained"},
    {title:"Recursion Made Simple",q:"recursion explained simply with examples"},
  ]},
  {name:"Engineering Maths",icon:"📐",topics:[
    {title:"Matrices and Determinants",q:"matrices and determinants explained simply"},
    {title:"Differential Equations",q:"differential equations basics engineering"},
    {title:"Probability and Statistics",q:"probability and statistics crash course"},
  ]},
  {name:"Aptitude",icon:"🧠",topics:[
    {title:"Time Speed Distance",q:"time speed distance tricks for placements"},
    {title:"Logical Reasoning",q:"logical reasoning puzzles explained"},
    {title:"Number Systems",q:"number system tricks for aptitude"},
  ]},
  {name:"Career",icon:"🎯",topics:[
    {title:"Resume Building",q:"how to build a resume for freshers"},
    {title:"Technical Interviews",q:"how to crack technical interviews tips"},
    {title:"Group Discussion Tips",q:"group discussion tips for college students"},
  ]},
];

// ── ISL DICTIONARY (50 words) ─────────────────────────────────────────────────
const ISLD=[
  // Greetings
  {cat:"Greetings",word:"Hello",sign:"Raise an open palm near your forehead and move it slightly forward, like a salute."},
  {cat:"Greetings",word:"Goodbye",sign:"Wave your open hand from side to side at shoulder height."},
  {cat:"Greetings",word:"Good morning",sign:"Touch fingertips to your chin, then sweep your hand outward and upward in an arc."},
  {cat:"Greetings",word:"Good night",sign:"Lay one flat hand across the elbow of the other arm, with fingers pointing downward."},
  {cat:"Greetings",word:"Welcome",sign:"Extend both hands forward with palms up, then draw them inward toward your chest gently."},
  // Courtesy
  {cat:"Courtesy",word:"Thank you",sign:"Touch fingertips to your chin, then move your hand forward and down toward the other person."},
  {cat:"Courtesy",word:"Please",sign:"Rub your open palm in a gentle clockwise circle over your chest."},
  {cat:"Courtesy",word:"Sorry",sign:"Rub a closed fist in a gentle circular motion over your chest."},
  {cat:"Courtesy",word:"Excuse me",sign:"Brush the fingertips of one hand across the palm of the other hand twice."},
  {cat:"Courtesy",word:"You are welcome",sign:"Extend one open hand forward with the palm up, like offering something."},
  // Responses
  {cat:"Responses",word:"Yes",sign:"Make a fist and nod it up and down, like a head nodding yes."},
  {cat:"Responses",word:"No",sign:"Bring your index and middle finger to touch your thumb repeatedly."},
  {cat:"Responses",word:"Maybe",sign:"Hold one hand flat, palm up, and tilt it side to side like a scale."},
  {cat:"Responses",word:"I understand",sign:"Tap your temple with your index finger, then nod and give a thumbs up."},
  {cat:"Responses",word:"I do not know",sign:"Shrug both shoulders while holding both hands palm-up at waist level."},
  // People
  {cat:"People",word:"Friend",sign:"Hook the index fingers of both hands together, then switch their positions."},
  {cat:"People",word:"Teacher",sign:"Touch fingertips of both hands to your temples, then move hands forward and open them."},
  {cat:"People",word:"Student",sign:"Place one flat hand on top of the other, then mime opening a book and point to yourself."},
  {cat:"People",word:"Family",sign:"Make an F shape with both hands, touch thumbs together, then sweep them outward in a circle."},
  {cat:"People",word:"Mother",sign:"Touch your thumb to your chin with fingers spread wide."},
  {cat:"People",word:"Father",sign:"Touch your thumb to your forehead with fingers spread wide."},
  {cat:"People",word:"Brother",sign:"Point to your forehead, then bring both L-shaped hands together at chest level."},
  {cat:"People",word:"Sister",sign:"Touch your chin with your thumb, then bring both L-shaped hands together at chest level."},
  // Places
  {cat:"Places",word:"School",sign:"Clap your hands twice with palms facing each other, like a small applause."},
  {cat:"Places",word:"Home",sign:"Touch your fingertips to the side of your cheek, then move them slightly lower."},
  {cat:"Places",word:"Hospital",sign:"Trace a cross shape on your upper arm with your index and middle fingers."},
  {cat:"Places",word:"Library",sign:"Move an L-shaped hand in a small circle on the open palm of the other hand."},
  {cat:"Places",word:"Bathroom",sign:"Shake a T-shaped hand side to side at waist level."},
  // Daily Needs
  {cat:"Daily Needs",word:"Water",sign:"Tap the index finger of a W-shaped hand against your chin twice."},
  {cat:"Daily Needs",word:"Food",sign:"Bring the fingertips of a closed hand to your mouth repeatedly, as if eating."},
  {cat:"Daily Needs",word:"Help",sign:"Place one closed fist on the open palm of the other hand and lift both upward together."},
  {cat:"Daily Needs",word:"Sleep",sign:"Draw your dominant hand down over your face, closing fingers as it passes, then tilt your head."},
  {cat:"Daily Needs",word:"Medicine",sign:"Rotate the middle finger of one hand on the upturned palm of the other hand."},
  {cat:"Daily Needs",word:"Money",sign:"Tap the back of a flat hand against the upturned palm of the other hand a couple of times."},
  // Classroom
  {cat:"Classroom",word:"Book",sign:"Hold both flat hands together, then open them like a book."},
  {cat:"Classroom",word:"Read",sign:"Move two fingers of one hand across the upturned palm of the other, like reading lines."},
  {cat:"Classroom",word:"Write",sign:"Mime writing on the palm of your non-dominant hand with your dominant index finger and thumb."},
  {cat:"Classroom",word:"Question",sign:"Trace a question mark in the air with your index finger."},
  {cat:"Classroom",word:"Answer",sign:"Hold one index finger near your mouth, then move it forward and down."},
  {cat:"Classroom",word:"Repeat",sign:"Make a small circular motion with your index finger pointing forward."},
  {cat:"Classroom",word:"Exam",sign:"Move both index fingers alternately down a flat palm, as if scanning exam lines."},
  // Emotions
  {cat:"Emotions",word:"Happy",sign:"Brush both open hands upward against your chest in an alternating motion."},
  {cat:"Emotions",word:"Sad",sign:"Draw both open hands slowly down your face from forehead to chin."},
  {cat:"Emotions",word:"Angry",sign:"Claw both hands in front of your face, then pull them away slightly with tension."},
  {cat:"Emotions",word:"Scared",sign:"Bring both hands up to your chest quickly with fingers spread, as if startled."},
  {cat:"Emotions",word:"Love",sign:"Cross both arms over your chest and hug yourself, then point to the other person."},
  // Numbers
  {cat:"Numbers",word:"One",sign:"Hold up your index finger alone."},
  {cat:"Numbers",word:"Two",sign:"Hold up your index and middle fingers in a V shape."},
  {cat:"Numbers",word:"Three",sign:"Hold up your thumb, index finger, and middle finger together."},
  {cat:"Numbers",word:"Four",sign:"Hold up all four fingers with your thumb folded in."},
  {cat:"Numbers",word:"Five",sign:"Show an open palm with all five fingers spread wide."},
  {cat:"Numbers",word:"Ten",sign:"Shake a thumbs-up hand side to side once."},
];

const ISL_CATS=[...new Set(ISLD.map(d=>d.cat))];

// ── ISL LESSONS ───────────────────────────────────────────────────────────────
const ISLL=[
  {title:"Everyday Greetings",steps:[
    {word:"Hello",caption:"Raise an open palm near your forehead and move it slightly forward, like a salute."},
    {word:"How are you?",caption:"Point to the person, then place your hand on your chest and tilt your head questioningly."},
    {word:"Thank you",caption:"Touch your fingertips to your chin, then move your hand forward and down."},
    {word:"Goodbye",caption:"Wave your open hand side to side at shoulder height."},
  ]},
  {title:"Classroom Phrases",steps:[
    {word:"May I ask a question?",caption:"Raise your hand, then trace a question mark in the air with your index finger."},
    {word:"I understand",caption:"Tap your temple with your index finger, then nod and give a thumbs up."},
    {word:"I do not understand",caption:"Tap your temple, then shake your open hand side to side in front of your face."},
    {word:"Repeat please",caption:"Make a small circular motion with your index finger, then point forward."},
  ]},
  {title:"Numbers 1 to 5",steps:[
    {word:"One",caption:"Hold up your index finger."},
    {word:"Two",caption:"Hold up your index and middle fingers in a V shape."},
    {word:"Three",caption:"Hold up your thumb, index, and middle fingers."},
    {word:"Four",caption:"Hold up four fingers with your thumb folded in."},
    {word:"Five",caption:"Show an open palm with all five fingers spread."},
  ]},
  {title:"Expressing Feelings",steps:[
    {word:"Happy",caption:"Brush both open hands upward on your chest alternately in a circular motion."},
    {word:"Sad",caption:"Draw both open hands slowly down your face from your forehead to your chin."},
    {word:"Angry",caption:"Claw both hands in front of your face, then pull them outward with tension."},
    {word:"Love",caption:"Cross both arms over your chest and hug yourself, then point to the other person."},
  ]},
  {title:"Asking for Help",steps:[
    {word:"Help",caption:"Place one closed fist on the open palm of your other hand and lift both upward together."},
    {word:"Please",caption:"Rub your open palm in a gentle clockwise circle over your chest."},
    {word:"Where is the washroom?",caption:"Point with your index finger while raising your eyebrows, then form a W shape with your hand."},
    {word:"I need water",caption:"Sign I by pointing to yourself, then sign Need by hooking your index finger downward, then sign Water."},
  ]},
];

// ── COMM PROMPTS ──────────────────────────────────────────────────────────────
const CPS=[
  {title:"Self Introduction",prompt:"Introduce yourself in 4-5 sentences: your name, what you study, one strength, and one goal."},
  {title:"Explain a Concept",prompt:"Explain any concept from your course to someone who has never heard of it, in very simple words."},
  {title:"Group Discussion",prompt:"Write an opening statement for a GD on whether smartphones should be allowed in classrooms."},
  {title:"Email to a Professor",prompt:"Write a short polite email asking your professor for an extension on an assignment due tomorrow."},
  {title:"Mock Interview Answer",prompt:"Answer: Tell me about a time you faced a challenge and how you handled it."},
];

// ── PRONUNCIATION ─────────────────────────────────────────────────────────────
const PRN=[
  "The sun rises in the east.",
  "Photosynthesis is the process by which plants make food.",
  "Honesty is the best policy.",
  "A triangle has three sides and three angles.",
  "The Earth revolves around the Sun.",
  "Practice makes a person perfect.",
  "Water boils at one hundred degrees Celsius.",
  "Reading every day improves vocabulary.",
  "The Constitution guarantees fundamental rights to every citizen.",
  "Slow and steady wins the race.",
  "Every student has the right to quality education.",
  "Science helps us understand the world around us.",
];

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function TopBar({title,subtitle,accent,onExit,Icon}){
  return(
    <div style={{position:"relative",overflow:"hidden",padding:"18px 24px",borderBottom:`1px solid ${BOR}`,
      background:`linear-gradient(135deg,${hex(accent,.1)} 0%,${BG} 65%)`}}>
      {Icon&&<div style={{position:"absolute",right:-8,top:-12,opacity:.06,color:accent,pointerEvents:"none"}}><Icon size={130}/></div>}
      <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.32em",fontWeight:800,color:accent,marginBottom:4}}>
            Educate Everyone &middot; {subtitle}
          </div>
          <h1 style={{fontFamily:FD,color:TX,fontSize:24,fontWeight:900,margin:0,lineHeight:1.2}}>{title}</h1>
        </div>
        <button onClick={onExit}
          style={{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,padding:"8px 16px",borderRadius:999,
            border:`1px solid ${accent}`,color:accent,background:hex(accent,.08),cursor:"pointer",boxShadow:glow(accent,6)}}>
          <LogOut size={14}/> Exit
        </button>
      </div>
    </div>
  );
}

function NavTabs({tabs,active,onChange,accent}){
  return(
    <div style={{display:"flex",gap:8,padding:"10px 20px",overflowX:"auto",borderBottom:`1px solid ${BOR}`,background:SUR,flexShrink:0}}>
      {tabs.map(t=>{
        const on=active===t.key;
        return(
          <button key={t.key} onClick={()=>onChange(t.key)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:999,fontSize:13,
              fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",border:"none",flexShrink:0,transition:"all .2s",
              ...(on
                ?{background:`linear-gradient(120deg,${accent},${hex(accent,.7)})`,color:"#000",boxShadow:glow(accent)}
                :{color:MU,background:CARD})}}>
            {t.icon}&nbsp;{t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── AI CHAT ───────────────────────────────────────────────────────────────────
// Key fixes:
//  1. msgs state is kept as a ref too so the async send() always sees fresh state
//  2. Voice uses a try/catch with a clear user-facing fallback message (no raw error)
//  3. Messages sent as [user, assistant, user, assistant...] — system is separate param
function AIChat({systemPrompt,accent,intro,ttsEnabled,suggestions,voiceEnabled}){
  const [msgs,setMsgs]=useState([{role:"assistant",content:intro}]);
  const msgsRef=useRef([{role:"assistant",content:intro}]);
  const [inp,setInp]=useState("");
  const [loading,setLoading]=useState(false);
  const [listening,setListening]=useState(false);
  const [micErr,setMicErr]=useState("");
  const recog=useRef(null);
  const endRef=useRef(null);

  useEffect(()=>{
    if(endRef.current) endRef.current.scrollIntoView({behavior:"smooth"});
  },[msgs,loading]);

  const addMsg=useCallback((msg)=>{
    msgsRef.current=[...msgsRef.current,msg];
    setMsgs([...msgsRef.current]);
  },[]);

  async function send(rawText){
    const text=(rawText!==undefined?String(rawText):inp).trim();
    if(!text||loading)return;
    // add user message
    const userMsg={role:"user",content:text};
    msgsRef.current=[...msgsRef.current,userMsg];
    setMsgs([...msgsRef.current]);
    setInp("");
    setLoading(true);

    // build API messages: skip intro assistant msg, keep real conversation
    const apiMsgs=msgsRef.current
      .filter((_,i)=>i>0)  // skip the intro
      .map(m=>({role:m.role,content:m.content}));

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:600,
          system:systemPrompt,
          messages:apiMsgs,
        }),
      });
      const data=await res.json();
      if(!res.ok||data.error){
        throw new Error(data.error?data.error.message:"HTTP "+res.status);
      }
      const reply=(data.content||[])
        .filter(b=>b.type==="text")
        .map(b=>b.text)
        .join("\n")
        .trim();
      if(!reply) throw new Error("Empty response");
      const botMsg={role:"assistant",content:reply};
      msgsRef.current=[...msgsRef.current,botMsg];
      setMsgs([...msgsRef.current]);
      if(ttsEnabled) speak(reply);
    }catch(e){
      const errMsg={role:"assistant",content:"I had trouble connecting. Please check your internet and try again."};
      msgsRef.current=[...msgsRef.current,errMsg];
      setMsgs([...msgsRef.current]);
      console.error("AI error:",e.message);
    }finally{
      setLoading(false);
    }
  }

  function toggleVoice(){
    setMicErr("");
    // Try to get mic permission first
    if(listening){
      if(recog.current){try{recog.current.stop();}catch(e){}}
      setListening(false);
      return;
    }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){
      setMicErr("Voice input needs Chrome. Please type your question instead.");
      return;
    }
    navigator.mediaDevices&&navigator.mediaDevices.getUserMedia({audio:true})
      .then(()=>{
        const r=new SR();
        r.lang="en-IN";
        r.interimResults=false;
        r.maxAlternatives=1;
        r.onstart=()=>setListening(true);
        r.onresult=e=>{
          const t=e.results[0][0].transcript;
          setListening(false);
          send(t);
        };
        r.onerror=ev=>{
          setListening(false);
          if(ev.error==="not-allowed"||ev.error==="permission-denied"){
            setMicErr("Microphone access was denied. Please allow mic access in your browser settings, then try again.");
          } else {
            setMicErr("Could not hear you clearly. Please try again or type your question.");
          }
        };
        r.onend=()=>setListening(false);
        recog.current=r;
        r.start();
      })
      .catch(()=>{
        setMicErr("Microphone access denied. Please allow mic access in your browser settings, then try again.");
      });
  }

  const showSug=msgs.length===1&&!loading&&suggestions&&suggestions.length>0;

  return(
    <div style={{display:"flex",flexDirection:"column",borderRadius:20,border:`1px solid ${BOR2}`,background:CARD,overflow:"hidden",height:480}}>
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="assistant"&&(
              <div style={{width:30,height:30,borderRadius:15,display:"flex",alignItems:"center",justifyContent:"center",
                flexShrink:0,background:`linear-gradient(135deg,${accent},${hex(accent,.5)})`,boxShadow:glow(accent,8)}}>
                <Sparkles size={14} color="#000"/>
              </div>
            )}
            <div style={{maxWidth:"76%",borderRadius:16,padding:"9px 13px",fontSize:13.5,lineHeight:1.65,
              ...(m.role==="user"
                ?{background:`linear-gradient(135deg,${accent},${hex(accent,.65)})`,color:"#000",fontWeight:600}
                :{background:SUR,color:TX,border:`1px solid ${BOR}`})}}>
              <span style={{whiteSpace:"pre-wrap"}}>{m.content}</span>
              {m.role==="assistant"&&(
                <button onClick={()=>speak(m.content)} title="Listen"
                  style={{marginLeft:6,opacity:.4,background:"none",border:"none",cursor:"pointer",
                    color:TX,verticalAlign:"middle",display:"inline-flex",padding:0}}>
                  <Volume2 size={12}/>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:5,marginLeft:38,marginTop:2,alignItems:"center"}}>
            {[0,.18,.36].map((d,i)=>(
              <span key={i} style={{display:"inline-block",width:7,height:7,borderRadius:4,
                background:accent,animation:`eeDot 1.2s ${d}s ease-in-out infinite`}}/>
            ))}
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {micErr&&(
        <div style={{margin:"0 12px 8px",padding:"8px 12px",borderRadius:10,background:hex("#FF4D4D",.12),
          border:`1px solid ${hex("#FF4D4D",.3)}`,fontSize:12,color:"#FF8080",lineHeight:1.5}}>
          {micErr}
          <button onClick={()=>setMicErr("")} style={{marginLeft:8,background:"none",border:"none",color:"#FF8080",cursor:"pointer",fontSize:14,lineHeight:1}}>x</button>
        </div>
      )}

      {showSug&&(
        <div style={{display:"flex",gap:7,padding:"0 14px 10px",flexWrap:"wrap"}}>
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>send(s)}
              style={{fontSize:11.5,fontWeight:600,padding:"5px 12px",borderRadius:999,
                border:`1px solid ${accent}`,color:accent,background:hex(accent,.07),cursor:"pointer"}}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{display:"flex",alignItems:"center",gap:7,padding:10,borderTop:`1px solid ${BOR}`}}>
        {voiceEnabled&&(
          <button onClick={toggleVoice}
            title={listening?"Stop listening":"Speak your question"}
            style={{borderRadius:999,padding:11,border:"none",cursor:"pointer",flexShrink:0,transition:"all .2s",
              background:listening?`linear-gradient(135deg,${accent},${hex(accent,.7)})`:SUR,
              color:listening?"#000":accent,
              boxShadow:listening?glow(accent):"none"}}>
            {listening?<MicOff size={17}/>:<Mic size={17}/>}
          </button>
        )}
        <input value={inp} onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder={voiceEnabled?"Speak or type your question...":"Type your question..."}
          style={{flex:1,borderRadius:999,padding:"9px 15px",fontSize:13.5,outline:"none",
            background:SUR,color:TX,border:`1px solid ${BOR2}`,fontFamily:FB}}/>
        <button onClick={()=>send()} disabled={loading}
          style={{borderRadius:999,padding:11,border:"none",cursor:"pointer",flexShrink:0,
            opacity:loading?.4:1,background:`linear-gradient(135deg,${accent},${hex(accent,.7)})`,
            boxShadow:glow(accent,8),transition:"opacity .2s"}}>
          <Send size={15} color="#000"/>
        </button>
      </div>
    </div>
  );
}

// ── VIDEO LIBRARY ─────────────────────────────────────────────────────────────
function VideoLib({subjects,accent}){
  const [open,setOpen]=useState(subjects[0]?subjects[0].name:null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {subjects.map(s=>(
        <div key={s.name} style={{borderRadius:16,border:`1px solid ${BOR2}`,background:CARD,overflow:"hidden"}}>
          <button onClick={()=>setOpen(open===s.name?null:s.name)}
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"13px 18px",textAlign:"left",fontWeight:700,fontSize:14,color:TX,cursor:"pointer",
              border:"none",background:open===s.name?hex(accent,.1):"transparent"}}>
            <span>{s.icon}&nbsp;{s.name}</span>
            <ChevronRight size={15} style={{color:accent,transform:open===s.name?"rotate(90deg)":"none",transition:"transform .2s"}}/>
          </button>
          {open===s.name&&(
            <div style={{padding:"0 14px 14px",display:"flex",flexDirection:"column",gap:7}}>
              {s.topics.map(t=>(
                <div key={t.title} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  gap:10,padding:"10px 13px",borderRadius:12,background:SUR}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:MU}}>
                    <Play size={12} style={{color:accent,flexShrink:0}}/>{t.title}
                  </div>
                  <button onClick={()=>window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(t.q),"_blank")}
                    style={{fontSize:11,fontWeight:700,padding:"5px 13px",borderRadius:999,color:"#000",
                      border:"none",cursor:"pointer",whiteSpace:"nowrap",
                      background:`linear-gradient(120deg,${accent},${hex(accent,.75)})`,boxShadow:glow(accent,4)}}>
                    Watch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── FILE HELPERS ──────────────────────────────────────────────────────────────
function fileIcon(mime){
  if(!mime) return "📄";
  if(mime.startsWith("image/"))    return "🖼️";
  if(mime==="application/pdf")     return "📕";
  if(mime.includes("word")||mime.includes("document")) return "📝";
  if(mime.includes("sheet")||mime.includes("excel"))   return "📊";
  if(mime.includes("presentation")||mime.includes("powerpoint")) return "📊";
  if(mime.startsWith("video/"))    return "🎬";
  if(mime.startsWith("audio/"))    return "🎵";
  return "📎";
}
function friendlySize(bytes){
  if(!bytes) return "";
  if(bytes<1024) return bytes+"B";
  if(bytes<1024*1024) return (bytes/1024).toFixed(1)+"KB";
  return (bytes/(1024*1024)).toFixed(1)+"MB";
}

// ── FILE PREVIEW MODAL ────────────────────────────────────────────────────────
function FileModal({file,onClose}){
  if(!file) return null;
  const isImg=file.mime&&file.mime.startsWith("image/");
  const isPdf=file.mime==="application/pdf";
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:CARD,borderRadius:20,border:`1px solid ${BOR2}`,
          maxWidth:780,width:"100%",maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 18px",borderBottom:`1px solid ${BOR}`,flexShrink:0}}>
          <div style={{fontWeight:700,fontSize:14,color:TX,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"80%"}}>
            {fileIcon(file.mime)} {file.name}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
            <a href={file.data} download={file.name}
              style={{fontSize:12,fontWeight:700,padding:"5px 13px",borderRadius:999,
                background:`linear-gradient(120deg,${AC.staff},${hex(AC.staff,.75)})`,
                color:"#000",textDecoration:"none",cursor:"pointer"}}>
              Download
            </a>
            <button onClick={onClose}
              style={{width:28,height:28,borderRadius:14,border:"none",background:SUR,
                color:MU,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
              &times;
            </button>
          </div>
        </div>
        {/* body */}
        <div style={{flex:1,overflowY:"auto",padding:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isImg&&(
            <img src={file.data} alt={file.name}
              style={{maxWidth:"100%",maxHeight:"60vh",borderRadius:12,objectFit:"contain"}}/>
          )}
          {isPdf&&(
            <iframe src={file.data} title={file.name}
              style={{width:"100%",height:"60vh",border:"none",borderRadius:12,background:"#fff"}}/>
          )}
          {!isImg&&!isPdf&&(
            <div style={{textAlign:"center",padding:40}}>
              <div style={{fontSize:56,marginBottom:14}}>{fileIcon(file.mime)}</div>
              <div style={{fontSize:15,fontWeight:700,color:TX,marginBottom:8}}>{file.name}</div>
              <div style={{fontSize:13,color:MU,marginBottom:20}}>{friendlySize(file.size)}</div>
              <a href={file.data} download={file.name}
                style={{fontSize:13,fontWeight:700,padding:"10px 22px",borderRadius:999,
                  background:`linear-gradient(120deg,${AC.staff},${hex(AC.staff,.75)})`,
                  color:"#000",textDecoration:"none"}}>
                Download file
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MATERIALS LIST ────────────────────────────────────────────────────────────
function MatList({items,accent,emptyText}){
  const [preview,setPreview]=useState(null);
  if(!items.length)return(
    <div style={{fontSize:13,textAlign:"center",padding:"36px 0",color:FA}}>{emptyText}</div>
  );
  return(
    <>
      {preview&&<FileModal file={preview} onClose={()=>setPreview(null)}/>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {items.slice().reverse().map(it=>(
          <div key={it.id} style={{padding:15,borderRadius:16,
            borderLeft:`4px solid ${accent}`,border:`1px solid ${BOR2}`,
            borderLeftStyle:"solid",background:CARD}}>
            {/* type badge */}
            <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:10,fontWeight:800,
              textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:7,padding:"3px 9px",
              borderRadius:999,color:accent,background:hex(accent,.12)}}>
              <FileText size={10}/>{TL[it.type]||it.type}{it.subject?" · "+it.subject:""}
            </div>
            <div style={{fontWeight:700,fontSize:14,color:TX,marginBottom:4}}>{it.title}</div>
            {it.content&&(
              <div style={{fontSize:13,color:MU,whiteSpace:"pre-wrap",lineHeight:1.6,marginBottom:8}}>{it.content}</div>
            )}

            {/* attached files */}
            {it.files&&it.files.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
                {it.files.map((f,fi)=>{
                  const isImg=f.mime&&f.mime.startsWith("image/");
                  return(
                    <div key={fi}
                      onClick={()=>setPreview(f)}
                      style={{cursor:"pointer",borderRadius:12,border:`1px solid ${BOR2}`,
                        overflow:"hidden",background:SUR,transition:"transform .15s",
                        ...(isImg?{width:90,height:90}:{padding:"8px 12px",display:"flex",alignItems:"center",gap:8})}}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                      onMouseLeave={e=>e.currentTarget.style.transform=""}>
                      {isImg?(
                        <img src={f.data} alt={f.name}
                          style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      ):(
                        <>
                          <span style={{fontSize:20}}>{fileIcon(f.mime)}</span>
                          <div>
                            <div style={{fontSize:11,fontWeight:700,color:TX,
                              maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                              {f.name}
                            </div>
                            <div style={{fontSize:10,color:MU}}>{friendlySize(f.size)}</div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* video link */}
            {it.videoUrl&&(
              <a href={it.videoUrl} target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,
                  padding:"5px 12px",borderRadius:999,marginBottom:8,textDecoration:"none",
                  color:"#000",background:`linear-gradient(120deg,#FF4444,#FF8800)`,boxShadow:glow("#FF6622",5)}}>
                🎬 Watch Video
              </a>
            )}

            <div style={{fontSize:11,color:FA}}>Shared by {it.author}{it.date?" · "+it.date:""}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── STAFF ─────────────────────────────────────────────────────────────────────
function StaffDash({onExit,shared,addShared}){
  const ac=AC.staff;
  const [tab,setTab]=useState("share");
  const [form,setForm]=useState({type:"material",title:"",subject:"",content:"",author:"",videoUrl:""});
  const [files,setFiles]=useState([]);   // [{name,mime,size,data}]
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const fileRef=useRef(null);

  const TYPES=[
    {key:"lessonplan",label:"📋 Lesson Plan"},
    {key:"material",  label:"📄 Material"},
    {key:"question",  label:"❓ Important Q"},
    {key:"idea",      label:"💡 Idea"},
  ];
  const ACCEPT="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.mp4,.mov,.mp3,.wav";

  function readFile(f){
    return new Promise((res)=>{
      const reader=new FileReader();
      reader.onload=e=>res({name:f.name,mime:f.type,size:f.size,data:e.target.result});
      reader.readAsDataURL(f);
    });
  }

  async function handleFiles(fileList){
    const MAX=5*1024*1024; // 5MB per file
    const toAdd=[];
    for(const f of Array.from(fileList)){
      if(f.size>MAX){alert(f.name+" is larger than 5MB and cannot be uploaded.");continue;}
      toAdd.push(await readFile(f));
    }
    setFiles(prev=>[...prev,  ...toAdd].slice(0,8)); // max 8 files
  }

  function onDrop(e){
    e.preventDefault(); setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeFile(i){setFiles(f=>f.filter((_,idx)=>idx!==i));}

  const IS={borderRadius:12,padding:"10px 14px",fontSize:13,outline:"none",
    background:SUR,color:TX,border:`1px solid ${BOR2}`,width:"100%",fontFamily:FB};

  async function submit(){
    if(!form.title.trim()||!form.author.trim())return;
    if(!form.content.trim()&&files.length===0&&!form.videoUrl.trim()){
      alert("Please add some content, a file, or a video link before sharing.");return;
    }
    setBusy(true);
    await addShared({
      ...form,
      files:[...files],
      id:Date.now()+"",
      date:new Date().toLocaleDateString()
    });
    setForm({type:form.type,title:"",subject:"",content:"",author:form.author,videoUrl:""});
    setFiles([]);
    setBusy(false); setDone(true);
    setTimeout(()=>setDone(false),3000);
  }

  const staffTabs=[
    {key:"share",  label:"Share Content",  icon:<Send size={13}/>},
    {key:"recent", label:"Recently Shared", icon:<FileText size={13}/>},
  ];

  return(
    <div style={{background:BG,minHeight:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="Staff Sharing Space" subtitle="Staff" accent={ac} onExit={onExit} Icon={Users}/>
      <NavTabs tabs={staffTabs} active={tab} onChange={setTab} accent={ac}/>

      <div style={{padding:18,maxWidth:680,margin:"0 auto",width:"100%"}}>

        {/* ── SHARE FORM ── */}
        {tab==="share"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Content type */}
            <div style={{borderRadius:20,border:`1px solid ${BOR2}`,background:CARD,padding:18,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontFamily:FD,fontSize:18,fontWeight:900,color:TX}}>What are you sharing?</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {TYPES.map(t=>(
                  <button key={t.key} onClick={()=>setForm(f=>({...f,type:t.key}))}
                    style={{padding:"7px 14px",borderRadius:999,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",transition:"all .15s",
                      ...(form.type===t.key
                        ?{background:`linear-gradient(120deg,${ac},${hex(ac,.75)})`,color:"#000",boxShadow:glow(ac,6)}
                        :{background:SUR,color:MU})}}>
                    {t.label}
                  </button>
                ))}
              </div>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                placeholder="Title *" style={IS}/>
              <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                placeholder="Subject (e.g. Mathematics, Science)" style={IS}/>
              <textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))}
                placeholder="Description or notes (optional if you are attaching a file)" rows={3}
                style={{...IS,resize:"vertical"}}/>
              <input value={form.author} onChange={e=>setForm(f=>({...f,author:e.target.value}))}
                placeholder="Your name *" style={IS}/>
            </div>

            {/* File upload */}
            <div style={{borderRadius:20,border:`1px solid ${BOR2}`,background:CARD,padding:18,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontFamily:FD,fontSize:16,fontWeight:900,color:TX}}>Attach Files</div>
              <div style={{fontSize:12,color:MU}}>Images, PDFs, Word docs, PowerPoints, Excel sheets, audio or video. Max 5MB per file, up to 8 files.</div>

              {/* drop zone */}
              <div
                onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={onDrop}
                onClick={()=>fileRef.current&&fileRef.current.click()}
                style={{border:`2px dashed ${dragOver?ac:BOR2}`,borderRadius:16,padding:"28px 16px",
                  textAlign:"center",cursor:"pointer",transition:"all .2s",
                  background:dragOver?hex(ac,.08):SUR}}>
                <div style={{fontSize:30,marginBottom:8}}>📁</div>
                <div style={{fontSize:13,fontWeight:700,color:dragOver?ac:MU}}>
                  {dragOver?"Drop files here":"Drag and drop files here, or click to browse"}
                </div>
                <div style={{fontSize:11,color:FA,marginTop:4}}>
                  Supported: Images, PDF, Word, Excel, PowerPoint, MP4, MP3, WAV, TXT
                </div>
              </div>
              <input ref={fileRef} type="file" multiple accept={ACCEPT}
                style={{display:"none"}}
                onChange={e=>handleFiles(e.target.files)}/>

              {/* file preview chips */}
              {files.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
                  {files.map((f,i)=>{
                    const isImg=f.mime&&f.mime.startsWith("image/");
                    return(
                      <div key={i} style={{position:"relative",borderRadius:12,overflow:"hidden",
                        border:`1px solid ${BOR2}`,background:SUR,
                        ...(isImg?{width:80,height:80}:{padding:"8px 10px",display:"flex",alignItems:"center",gap:7,maxWidth:200})}}>
                        {isImg?(
                          <img src={f.data} alt={f.name}
                            style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        ):(
                          <>
                            <span style={{fontSize:20,flexShrink:0}}>{fileIcon(f.mime)}</span>
                            <div style={{minWidth:0}}>
                              <div style={{fontSize:11,fontWeight:700,color:TX,
                                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                              <div style={{fontSize:10,color:MU}}>{friendlySize(f.size)}</div>
                            </div>
                          </>
                        )}
                        {/* remove button */}
                        <button onClick={()=>removeFile(i)}
                          style={{position:"absolute",top:3,right:3,width:18,height:18,borderRadius:9,
                            border:"none",background:"rgba(0,0,0,.7)",color:"#fff",cursor:"pointer",
                            fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Video URL */}
            <div style={{borderRadius:20,border:`1px solid ${BOR2}`,background:CARD,padding:18,display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontFamily:FD,fontSize:16,fontWeight:900,color:TX}}>Video Link (optional)</div>
              <div style={{fontSize:12,color:MU}}>Paste a YouTube or any video link to share with students.</div>
              <input value={form.videoUrl} onChange={e=>setForm(f=>({...f,videoUrl:e.target.value}))}
                placeholder="https://www.youtube.com/watch?v=..." style={IS}/>
              {form.videoUrl.trim()&&(
                <div style={{fontSize:12,color:ac,fontWeight:600}}>
                  Video link added — students will see a Watch Video button.
                </div>
              )}
            </div>

            {/* Submit */}
            <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:8}}>
              <button onClick={submit} disabled={busy}
                style={{padding:"12px 26px",borderRadius:999,fontSize:14,fontWeight:800,color:"#000",
                  border:"none",cursor:"pointer",opacity:busy?.4:1,
                  background:`linear-gradient(120deg,${ac},${hex(ac,.75)})`,boxShadow:glow(ac,8)}}>
                {busy?"Sharing...":"Share with students"}
              </button>
              {done&&(
                <div style={{fontSize:13,color:ac,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                  Shared successfully!
                </div>
              )}
            </div>
            <div style={{fontSize:11,color:FA}}>Content appears immediately in BPL and College student dashboards.</div>
          </div>
        )}

        {/* ── RECENT ── */}
        {tab==="recent"&&(
          <div>
            <MatList items={shared} accent={ac} emptyText="Nothing shared yet — switch to Share Content to get started!"/>
          </div>
        )}
      </div>
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────────────────────
// Fixes: uses a single absolutely-positioned container for both SVG lines AND node buttons,
// with consistent coordinate system so lines and buttons perfectly align.
const NODES=[
  {key:"bpl",    label:"BPL Student",      Icon:GraduationCap, accent:AC.bpl,    px:50,  py:5},
  {key:"vi",     label:"Visually Impaired", Icon:Eye,           accent:AC.vi,     px:88,  py:38},
  {key:"college",label:"College Student",   Icon:BookOpen,      accent:AC.college,px:72,  py:80},
  {key:"hi",     label:"Hearing Impaired",  Icon:Ear,           accent:AC.hi,     px:28,  py:80},
  {key:"staff",  label:"Staff",             Icon:Users,         accent:AC.staff,  px:12,  py:38},
];
const CARDS=[
  {key:"bpl",   label:"BPL Student",      tag:"Free self-paced learning",      accent:AC.bpl,
   Icon:GraduationCap, desc:"AI tutors, video lessons and study notes — learn anything, anytime, at no cost."},
  {key:"vi",    label:"Visually Impaired", tag:"Voice AI and biometric login",  accent:AC.vi,
   Icon:Eye,           desc:"Sign in with your fingerprint. Speak your question — the AI listens and reads answers aloud."},
  {key:"hi",    label:"Hearing Impaired",  tag:"ISL lessons, dictionary and AI",accent:AC.hi,
   Icon:Ear,           desc:"Step-by-step ISL lessons, a 50-word dictionary, and a visual AI tutor."},
  {key:"college",label:"College Student",  tag:"Open for everyone",             accent:AC.college,
   Icon:BookOpen,      desc:"Video lessons, short notes, AI helper, and a communication skills workshop."},
  {key:"staff", label:"Staff",             tag:"Share and teach",               accent:AC.staff,
   Icon:Users,         desc:"Share lesson plans, materials, important questions and ideas with every learner."},
];

function Landing({onSelect}){
  const SIZE=320; // logical size of constellation box in px
  const CX=SIZE/2, CY=SIZE/2;

  return(
    <div style={{background:BG,minHeight:"100%",overflowX:"hidden",fontFamily:FB}}>
      <div style={{position:"relative",padding:"56px 24px 32px",textAlign:"center",overflow:"hidden"}}>
        {/* bg blobs */}
        <div className="ee-blob" style={{width:300,height:300,background:BA,top:-90,left:-70}}/>
        <div className="ee-blob" style={{width:260,height:260,background:AC.vi,top:10,right:-80,animationDelay:"6s"}}/>
        <div className="ee-blob" style={{width:220,height:220,background:BB,bottom:-60,left:"38%",animationDelay:"11s"}}/>

        <div style={{position:"relative"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:999,
            border:`1px solid ${BOR2}`,background:hex(BA,.1),color:MU,fontSize:10.5,
            letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:800,marginBottom:20}}>
            <Sparkles size={11} style={{color:BA}}/> One platform — five paths
          </div>
          <h1 style={{fontFamily:FD,fontSize:"clamp(38px,7vw,68px)",fontWeight:900,margin:"0 0 10px",lineHeight:1.1}}>
            <span className="ee-grad">Educate Everyone</span>
          </h1>
          <p style={{fontSize:16,color:MU,maxWidth:440,margin:"0 auto 36px",lineHeight:1.6}}>
            Learning that adapts to you — however you read, hear, speak, or learn best.
          </p>

          {/* ── Constellation: single relative container, both SVG and buttons share same coordinate space ── */}
          <div style={{position:"relative",width:SIZE,height:SIZE,margin:"0 auto 8px"}}>
            {/* SVG lines */}
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} aria-hidden="true">
              <defs>
                {NODES.map(n=>(
                  <linearGradient key={n.key} id={"g"+n.key} gradientUnits="userSpaceOnUse"
                    x1={CX} y1={CY} x2={n.px/100*SIZE} y2={n.py/100*SIZE}>
                    <stop offset="0%" stopColor={BA} stopOpacity=".7"/>
                    <stop offset="100%" stopColor={n.accent} stopOpacity=".7"/>
                  </linearGradient>
                ))}
              </defs>
              {NODES.map((n,i)=>(
                <line key={n.key}
                  x1={CX} y1={CY}
                  x2={n.px/100*SIZE} y2={n.py/100*SIZE}
                  stroke={"url(#g"+n.key+")"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{strokeDasharray:200,strokeDashoffset:200,
                    animation:`eeDraw .9s ease ${i*.12+.2}s forwards`}}/>
              ))}
            </svg>

            {/* Centre orb — absolutely centred in the container */}
            <div className="ee-pulse" style={{
              position:"absolute",
              width:80,height:80,
              top:"50%",left:"50%",
              transform:"translate(-50%,-50%)",
              borderRadius:40,
              display:"flex",alignItems:"center",justifyContent:"center",
              background:`linear-gradient(135deg,${BA},${BB})`,
              boxShadow:`0 0 36px ${BA}66,0 0 72px ${BB}22`,
              zIndex:2}}>
              <Sparkles size={30} color="#fff"/>
            </div>

            {/* Node buttons — positioned using same px/py percentages */}
            {NODES.map((n,i)=>{
              const btnSize=52;
              return(
                <button key={n.key} onClick={()=>onSelect(n.key)}
                  title={n.label}
                  style={{
                    position:"absolute",
                    width:btnSize,height:btnSize,
                    // px/py are percentages of SIZE; offset by half button size
                    left:(n.px/100*SIZE - btnSize/2)+"px",
                    top:(n.py/100*SIZE - btnSize/2)+"px",
                    borderRadius:btnSize/2,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:`linear-gradient(135deg,${n.accent},${hex(n.accent,.8)})`,
                    boxShadow:glow(n.accent,12),
                    border:"none",cursor:"pointer",color:"#000",
                    zIndex:3,
                    animation:`eeUp .6s ease ${i*.1+.35}s both`,
                    transition:"transform .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.18)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                  <n.Icon size={22}/>
                </button>
              );
            })}
          </div>

          {/* node labels below */}
          <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:8}}>
            {NODES.map(n=>(
              <button key={n.key} onClick={()=>onSelect(n.key)}
                style={{fontSize:11,fontWeight:700,color:n.accent,background:"none",border:"none",cursor:"pointer",
                  textDecoration:"underline",textUnderlineOffset:3}}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,
        padding:"0 20px 56px",maxWidth:880,margin:"0 auto"}}>
        {CARDS.map((c,i)=>(
          <button key={c.key} onClick={()=>onSelect(c.key)}
            style={{textAlign:"left",padding:22,borderRadius:22,border:`1px solid ${BOR2}`,background:CARD,
              cursor:"pointer",animation:`eeUp .55s ease ${i*.07+.8}s both`,transition:"transform .2s,box-shadow .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=glow(c.accent,16);}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{width:46,height:46,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",
              marginBottom:14,background:`linear-gradient(135deg,${c.accent},${hex(c.accent,.6)})`,boxShadow:glow(c.accent,8)}}>
              <c.Icon size={21} color="#000"/>
            </div>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.22em",fontWeight:800,color:c.accent,marginBottom:5}}>{c.tag}</div>
            <div style={{fontFamily:FD,fontSize:19,fontWeight:900,color:TX,marginBottom:7}}>{c.label}</div>
            <div style={{fontSize:13,color:MU,lineHeight:1.6}}>{c.desc}</div>
            <div style={{display:"flex",alignItems:"center",gap:4,marginTop:14,fontSize:13,fontWeight:700,color:c.accent}}>
              Enter <ArrowRight size={13}/>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── BPL ───────────────────────────────────────────────────────────────────────
function BPL({onExit,shared}){
  const [tab,setTab]=useState("home");
  const ac=AC.bpl;
  const mats=shared.filter(s=>s.type==="material"||s.type==="lessonplan");
  const tabs=[
    {key:"home",label:"Home",icon:<Sparkles size={13}/>},
    {key:"tutor",label:"AI Tutor",icon:<MessageSquare size={13}/>},
    {key:"videos",label:"Videos",icon:<Play size={13}/>},
    {key:"notes",label:"Notes",icon:<FileText size={13}/>},
  ];
  return(
    <div style={{background:BG,minHeight:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="Your Learning Space" subtitle="BPL Student" accent={ac} onExit={onExit} Icon={GraduationCap}/>
      <NavTabs tabs={tabs} active={tab} onChange={setTab} accent={ac}/>
      <div style={{padding:18,maxWidth:680,margin:"0 auto",width:"100%"}}>
        {tab==="home"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{borderRadius:20,padding:20,background:`linear-gradient(120deg,${hex(ac,.15)},${hex(ac,.04)})`,border:`1px solid ${hex(ac,.25)}`}}>
              <div style={{fontFamily:FD,fontSize:20,fontWeight:900,color:TX,marginBottom:6}}>Welcome back</div>
              <div style={{fontSize:13,color:MU,lineHeight:1.6}}>Ask the AI tutor, watch a lesson, or browse notes shared by teachers. Everything is free.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {tabs.slice(1).map(t=>(
                <button key={t.key} onClick={()=>setTab(t.key)}
                  style={{padding:16,borderRadius:16,border:`1px solid ${BOR2}`,background:CARD,
                    display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",transition:"transform .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform=""}>
                  <div style={{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:hex(ac,.18),color:ac}}>{t.icon}</div>
                  <span style={{fontSize:12,fontWeight:700,color:MU}}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {tab==="tutor"&&(
          <AIChat accent={ac}
            suggestions={["Explain photosynthesis simply","Help me with fractions","Give 3 practice questions on tenses"]}
            intro="Hi! I am your study buddy. Ask me anything and I will explain it simply with examples and practice questions."
            systemPrompt="You are a friendly patient AI tutor for school students aged 10 to 18 in India who may not have regular school access. Explain concepts in very simple language with everyday Indian examples. Break topics into small numbered steps. Offer practice questions. Be warm and encouraging. Keep answers concise."/>
        )}
        {tab==="videos"&&<VideoLib subjects={SCH} accent={ac}/>}
        {tab==="notes"&&<MatList items={mats} accent={ac} emptyText="No notes yet. Teachers will share notes here soon."/>}
      </div>
    </div>
  );
}

// ── VISUALLY IMPAIRED ─────────────────────────────────────────────────────────
function VILogin({onSuccess}){
  const [scan,setScan]=useState(false);
  const [done,setDone]=useState(false);
  function go(){
    if(scan||done)return;
    setScan(true);
    speak("Scanning your fingerprint. Please hold still.");
    setTimeout(()=>{
      setScan(false); setDone(true);
      speak("Fingerprint recognised. Welcome back.");
      setTimeout(onSuccess,1000);
    },2000);
  }
  const ac=AC.vi;
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",textAlign:"center",padding:24,position:"relative",overflow:"hidden",
      background:BG,color:TX,fontFamily:FB}}>
      <div className="ee-blob" style={{width:380,height:380,background:ac,top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",opacity:.13}}/>
      <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.32em",fontWeight:800,color:ac}}>
          Educate Everyone &middot; Visually Impaired
        </div>
        <h1 style={{fontFamily:FD,fontSize:28,fontWeight:900,margin:0}}>Sign in with your fingerprint</h1>
        <button onClick={go} aria-label="Scan fingerprint to sign in"
          style={{width:140,height:140,borderRadius:70,display:"flex",alignItems:"center",justifyContent:"center",
            border:`4px solid ${ac}`,color:done?"#5FE0D8":ac,background:"transparent",
            boxShadow:glow(ac,22),cursor:"pointer",
            animation:scan?"eePulse 1s infinite":undefined}}>
          <Fingerprint size={70}/>
        </button>
        <p style={{fontSize:17,color:MU,margin:0}}>
          {done?"Recognised — opening your space...":scan?"Scanning...":"Tap the fingerprint icon to sign in"}
        </p>
        <button onClick={()=>speak("Tap the large fingerprint icon in the centre of the screen to sign in. The system will scan your fingerprint and open your learning space.")}
          style={{display:"flex",alignItems:"center",gap:7,fontSize:13,textDecoration:"underline",
            color:ac,background:"none",border:"none",cursor:"pointer"}}>
          <Volume2 size={15}/> Read instructions aloud
        </button>
      </div>
    </div>
  );
}

function VIDash({onExit}){
  const [tab,setTab]=useState("tutor");
  const [rate,setRate]=useState(0.85);
  const ac=AC.vi;
  const tabs=[
    {key:"tutor",label:"Voice AI Tutor",icon:<Mic size={13}/>},
    {key:"pronoun",label:"Pronunciation",icon:<Volume2 size={13}/>},
  ];
  return(
    <div style={{background:BG,minHeight:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="Audio Learning Space" subtitle="Visually Impaired" accent={ac} onExit={onExit} Icon={Eye}/>
      <NavTabs tabs={tabs} active={tab} onChange={setTab} accent={ac}/>
      <div style={{padding:18,maxWidth:640,margin:"0 auto",width:"100%"}}>
        {tab==="tutor"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{borderRadius:16,padding:14,background:hex(ac,.1),border:`1px solid ${hex(ac,.25)}`,display:"flex",gap:10,alignItems:"flex-start"}}>
              <Mic size={19} style={{color:ac,flexShrink:0,marginTop:2}}/>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:TX,marginBottom:3}}>
                  Tap the microphone button and speak your question. The AI will answer and read it aloud automatically.
                </div>
                <div style={{fontSize:12,color:MU}}>You can also type. Every reply is read out for you. Microphone needs Chrome browser and permission.</div>
              </div>
            </div>
            <button onClick={()=>speak("Welcome to the voice AI tutor. Tap the microphone button to speak any question. The AI will answer and read the reply out loud for you. You can also type in the text box.")}
              style={{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:700,
                padding:"8px 14px",borderRadius:999,background:hex(ac,.1),color:ac,
                border:`1px solid ${hex(ac,.35)}`,cursor:"pointer",width:"fit-content"}}>
              <Volume2 size={14}/> Hear instructions
            </button>
            <AIChat accent={ac} ttsEnabled voiceEnabled
              suggestions={["Explain the water cycle","What is gravity","Tell me a short story"]}
              intro="Hello! I am your voice AI tutor. Tap the microphone and speak any question, or type it below. I will listen and read my answer aloud for you."
              systemPrompt="You are a voice-first AI tutor for a visually impaired student. Write in short clear spoken-language sentences only. No bullet points, no symbols, no markdown, no tables. Explain step by step in plain spoken language. Keep every answer under 100 words so it is comfortable to listen to. Be warm and patient."/>
          </div>
        )}
        {tab==="pronoun"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{borderRadius:16,padding:14,background:hex(ac,.1),border:`1px solid ${hex(ac,.25)}`}}>
              <div style={{fontSize:14,color:TX,marginBottom:10}}>Tap any sentence to hear it read aloud. Use the speed slider to slow it down.</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:12,fontWeight:700,color:ac,whiteSpace:"nowrap"}}>Speed</span>
                <input type="range" min=".5" max="1.2" step=".05" value={rate}
                  onChange={e=>setRate(parseFloat(e.target.value))} style={{flex:1}}/>
                <span style={{fontSize:12,fontFamily:"monospace",color:MU,width:34,textAlign:"right"}}>{rate.toFixed(2)}x</span>
              </div>
            </div>
            {PRN.map((s,i)=>(
              <button key={i} onClick={()=>speak(s,rate)}
                style={{width:"100%",textAlign:"left",padding:14,borderRadius:16,
                  display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,
                  background:CARD,border:`1px solid ${BOR2}`,color:TX,fontSize:14,cursor:"pointer",
                  transition:"transform .15s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateX(3px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}>
                <span style={{lineHeight:1.5}}>{s}</span>
                <Volume2 size={19} style={{color:ac,flexShrink:0}}/>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── HEARING IMPAIRED ──────────────────────────────────────────────────────────
function HILessons({accent}){
  const [open,setOpen]=useState(null);
  const [step,setStep]=useState(0);
  if(open!==null){
    const L=ISLL[open]; const s=L.steps[step];
    const pct=((step+1)/L.steps.length)*100;
    return(
      <div>
        <button onClick={()=>{setOpen(null);setStep(0);}}
          style={{display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:700,
            color:accent,background:"none",border:"none",cursor:"pointer",marginBottom:14,padding:0}}>
          <ArrowLeft size={13}/> All lessons
        </button>
        <div style={{fontFamily:FD,fontSize:21,fontWeight:900,color:TX,marginBottom:14}}>{L.title}</div>
        <div style={{borderRadius:22,border:`1px solid ${BOR2}`,background:CARD,padding:28,
          display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:14,
          boxShadow:`inset 0 0 50px ${hex(accent,.05)}`}}>
          <div style={{width:90,height:90,borderRadius:45,display:"flex",alignItems:"center",
            justifyContent:"center",background:`linear-gradient(135deg,${hex(accent,.2)},${hex(accent,.07)})`,
            boxShadow:glow(accent,14)}}>
            <Hand size={42} style={{color:accent}}/>
          </div>
          <div style={{fontSize:22,fontWeight:900,color:TX}}>{s.word}</div>
          <div style={{fontSize:14,color:MU,lineHeight:1.65,maxWidth:380}}>{s.caption}</div>
          <div style={{width:"100%",height:5,borderRadius:999,background:BOR}}>
            <div style={{height:5,borderRadius:999,width:pct+"%",
              background:`linear-gradient(90deg,${accent},${hex(accent,.65)})`,transition:"width .35s"}}/>
          </div>
          <div style={{fontSize:12,color:FA}}>Sign {step+1} of {L.steps.length}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
          <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}
            style={{padding:"9px 20px",borderRadius:999,border:`1px solid ${accent}`,
              color:accent,background:"transparent",cursor:"pointer",opacity:step===0?.3:1,fontWeight:700,fontSize:13}}>
            Previous
          </button>
          <button onClick={()=>setStep(Math.min(L.steps.length-1,step+1))} disabled={step===L.steps.length-1}
            style={{padding:"9px 20px",borderRadius:999,border:"none",color:"#000",fontWeight:700,
              cursor:"pointer",opacity:step===L.steps.length-1?.3:1,fontSize:13,
              background:`linear-gradient(120deg,${accent},${hex(accent,.75)})`,boxShadow:glow(accent,7)}}>
            Next
          </button>
        </div>
      </div>
    );
  }
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {ISLL.map((l,i)=>(
        <button key={l.title} onClick={()=>setOpen(i)}
          style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:15,
            borderRadius:16,border:`1px solid ${BOR2}`,background:CARD,textAlign:"left",cursor:"pointer",
            transition:"transform .15s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="translateX(3px)"}
          onMouseLeave={e=>e.currentTarget.style.transform=""}>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:TX}}>{l.title}</div>
            <div style={{fontSize:12,color:FA,marginTop:2}}>{l.steps.length} signs</div>
          </div>
          <div style={{width:38,height:38,borderRadius:19,display:"flex",alignItems:"center",
            justifyContent:"center",background:hex(accent,.18),boxShadow:glow(accent,5)}}>
            <Play size={15} style={{color:accent}}/>
          </div>
        </button>
      ))}
    </div>
  );
}

function HIDict({accent}){
  const [q,setQ]=useState("");
  const [cat,setCat]=useState("All");
  const filtered=ISLD.filter(d=>{
    const matchQ=d.word.toLowerCase().includes(q.toLowerCase());
    const matchC=cat==="All"||d.cat===cat;
    return matchQ&&matchC;
  });
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,
        padding:"10px 15px",borderRadius:999,background:CARD,border:`1px solid ${BOR2}`}}>
        <Search size={14} style={{color:accent}}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search any word..."
          style={{flex:1,outline:"none",fontSize:14,background:"transparent",color:TX,border:"none",fontFamily:FB}}/>
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
        {["All",...ISL_CATS].map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            style={{fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:999,border:"none",cursor:"pointer",transition:"all .15s",
              ...(cat===c?{background:`linear-gradient(120deg,${accent},${hex(accent,.7)})`,color:"#000",boxShadow:glow(accent,5)}
                :{background:SUR,color:MU})}}>
            {c}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:10}}>
        {filtered.map(d=>(
          <div key={d.word} style={{padding:14,borderRadius:16,border:`1px solid ${BOR2}`,background:CARD,
            transition:"transform .15s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform=""}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
              <div style={{width:30,height:30,borderRadius:9,display:"flex",alignItems:"center",
                justifyContent:"center",background:hex(accent,.18)}}>
                <Hand size={14} style={{color:accent}}/>
              </div>
              <span style={{fontWeight:800,fontSize:14,color:TX}}>{d.word}</span>
              <span style={{fontSize:10,color:MU,marginLeft:"auto",fontWeight:600}}>{d.cat}</span>
            </div>
            <div style={{fontSize:12.5,color:MU,lineHeight:1.55}}>{d.sign}</div>
          </div>
        ))}
        {!filtered.length&&(
          <div style={{fontSize:13,textAlign:"center",padding:"28px 0",color:FA,gridColumn:"1/-1"}}>
            No match found. Try a different word.
          </div>
        )}
      </div>
    </div>
  );
}

function HIDash({onExit}){
  const [tab,setTab]=useState("tutor");
  const ac=AC.hi;
  const tabs=[
    {key:"tutor",label:"AI Tutor",icon:<MessageSquare size={13}/>},
    {key:"lessons",label:"ISL Lessons",icon:<Hand size={13}/>},
    {key:"dict",label:"ISL Dictionary",icon:<Search size={13}/>},
  ];
  return(
    <div style={{background:BG,minHeight:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="Sign Language Space" subtitle="Hearing Impaired" accent={ac} onExit={onExit} Icon={Ear}/>
      <NavTabs tabs={tabs} active={tab} onChange={setTab} accent={ac}/>
      <div style={{padding:18,maxWidth:680,margin:"0 auto",width:"100%"}}>
        {tab==="tutor"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{borderRadius:16,padding:14,background:hex(ac,.1),border:`1px solid ${hex(ac,.25)}`,
              display:"flex",gap:10,alignItems:"flex-start"}}>
              <Sparkles size={19} style={{color:ac,flexShrink:0,marginTop:2}}/>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:TX,marginBottom:3}}>
                  Our AI tutor explains everything in clear, simple written text — no audio required.
                </div>
                <div style={{fontSize:12,color:MU}}>
                  Type your question below. The AI replies with numbered steps and plain language you can read easily.
                </div>
              </div>
            </div>
            <AIChat accent={ac}
              suggestions={["Explain photosynthesis step by step","What is gravity","Teach me the water cycle"]}
              intro="Hello! I am your visual AI tutor. Type any question and I will explain it clearly with simple words, numbered steps, and examples you can read."
              systemPrompt="You are an AI tutor for a hearing-impaired student who cannot hear audio. Always reply with clear simple written text only. Use numbered steps and short sentences. Never say listen to, hear, or mention audio. Use plain descriptive language and visual examples. Keep responses concise and easy to read on screen."/>
          </div>
        )}
        {tab==="lessons"&&<HILessons accent={ac}/>}
        {tab==="dict"&&<HIDict accent={ac}/>}
      </div>
    </div>
  );
}

// ── COLLEGE ───────────────────────────────────────────────────────────────────
function CommSkills({accent}){
  const [sel,setSel]=useState(null);
  return sel===null?(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{fontSize:13,color:MU,marginBottom:4,lineHeight:1.6}}>
        Pick a prompt, write your response, and get AI feedback on clarity, grammar and confidence.
      </div>
      {CPS.map((p,i)=>(
        <button key={i} onClick={()=>setSel(i)}
          style={{textAlign:"left",padding:15,borderRadius:16,border:`1px solid ${BOR2}`,background:CARD,cursor:"pointer",transition:"transform .15s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="translateX(3px)"}
          onMouseLeave={e=>e.currentTarget.style.transform=""}>
          <div style={{fontWeight:700,fontSize:14,color:TX,marginBottom:4}}>{p.title}</div>
          <div style={{fontSize:13,color:MU,lineHeight:1.5}}>{p.prompt}</div>
        </button>
      ))}
    </div>
  ):(
    <div>
      <button onClick={()=>setSel(null)}
        style={{display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:700,
          color:accent,background:"none",border:"none",cursor:"pointer",marginBottom:14,padding:0}}>
        <ArrowLeft size={13}/> Choose another
      </button>
      <div style={{padding:14,borderRadius:16,marginBottom:14,
        background:hex(accent,.1),border:`1px solid ${hex(accent,.25)}`}}>
        <div style={{fontWeight:700,fontSize:14,color:TX,marginBottom:4}}>{CPS[sel].title}</div>
        <div style={{fontSize:13,color:MU,lineHeight:1.5}}>{CPS[sel].prompt}</div>
      </div>
      <AIChat accent={accent}
        intro="Write your response below and send it. I will give you specific feedback on clarity, grammar, structure and confidence."
        systemPrompt={"You are a communication skills coach for college students in India. The student is responding to this prompt: "+CPS[sel].prompt+". When they send their response, give specific encouraging feedback on clarity grammar structure and confidence. Suggest 1 to 2 concrete improvements. Keep your feedback concise and motivating."}/>
    </div>
  );
}

function CollegeDash({onExit,shared}){
  const [tab,setTab]=useState("tutor");
  const ac=AC.college;
  const mats=shared.filter(s=>s.type==="material"||s.type==="lessonplan");
  const qs=shared.filter(s=>s.type==="question");
  const tabs=[
    {key:"tutor",label:"AI Helper",icon:<MessageSquare size={13}/>},
    {key:"videos",label:"Videos",icon:<Play size={13}/>},
    {key:"mats",label:"Materials",icon:<FileText size={13}/>},
    {key:"comm",label:"Communication",icon:<Mic size={13}/>},
  ];
  return(
    <div style={{background:BG,minHeight:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="Open Learning Space" subtitle="College Student" accent={ac} onExit={onExit} Icon={BookOpen}/>
      <NavTabs tabs={tabs} active={tab} onChange={setTab} accent={ac}/>
      <div style={{padding:18,maxWidth:700,margin:"0 auto",width:"100%"}}>
        {tab==="tutor"&&(
          <AIChat accent={ac}
            suggestions={["Explain Big-O notation","Summarise the French Revolution in 5 points","Help me prep for my OOP viva"]}
            intro="Hi! I am your study helper. Ask me to explain anything, summarise a topic, or help you prepare for exams."
            systemPrompt="You are a knowledgeable AI helper for college students across all streams in India including engineering arts science and commerce. Explain concepts clearly with examples, summarise topics when asked, and help with exam preparation. Be concise, friendly, and thorough."/>
        )}
        {tab==="videos"&&<VideoLib subjects={COL} accent={ac}/>}
        {tab==="mats"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <MatList items={mats} accent={ac} emptyText="No materials yet. Check back soon."/>
            {qs.length>0&&(
              <div>
                <div style={{fontFamily:FD,fontSize:17,fontWeight:900,color:TX,marginBottom:10}}>Important Questions</div>
                <MatList items={qs} accent={ac} emptyText=""/>
              </div>
            )}
          </div>
        )}
        {tab==="comm"&&<CommSkills accent={ac}/>}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [view,setView]=useState("landing");
  const [shared,setShared]=useState([]);

  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get("ee-shared",true);
        setShared(r?JSON.parse(r.value):[]);
      }catch{setShared([]);}
    })();
  },[]);

  async function addShared(item){
    const next=[...shared,item];
    setShared(next);
    try{await window.storage.set("ee-shared",JSON.stringify(next),true);}catch{}
  }

  const exit=()=>setView("landing");

  return(
    <div style={{fontFamily:FB,background:BG,minHeight:"100vh",colorScheme:"dark"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ee-grad{background:linear-gradient(135deg,${BA},${BB});-webkit-background-clip:text;background-clip:text;color:transparent;}
        .ee-blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:.22;animation:eeDrift 20s ease-in-out infinite alternate;pointer-events:none;}
        .ee-pulse{animation:eePulse 3s ease-in-out infinite;}
        @keyframes eeDrift{0%{transform:translate(0,0) scale(1);}50%{transform:translate(24px,-18px) scale(1.08);}100%{transform:translate(-18px,14px) scale(.94);}}
        @keyframes eeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes eePulse{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.07);}}
        @keyframes eeDraw{to{stroke-dashoffset:0;}}
        @keyframes eeDot{0%,80%,100%{opacity:.15;transform:translateY(0);}40%{opacity:1;transform:translateY(-4px);}}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${BG};}
        ::-webkit-scrollbar-thumb{background:${BOR2};border-radius:99px;}
        button{font-family:${FB};}
      `}</style>
      {view==="landing"  && <Landing onSelect={setView}/>}
      {view==="bpl"      && <BPL onExit={exit} shared={shared}/>}
      {view==="vi"       && <VILogin onSuccess={()=>setView("vi-dash")}/>}
      {view==="vi-dash"  && <VIDash onExit={exit}/>}
      {view==="hi"       && <HIDash onExit={exit}/>}
      {view==="college"  && <CollegeDash onExit={exit} shared={shared}/>}
      {view==="staff"    && <StaffDash onExit={exit} shared={shared} addShared={addShared}/>}
    </div>
  );
}

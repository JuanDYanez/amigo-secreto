import React, { useState, useEffect } from 'react';
import { Gift, Users, Lock, Eye, EyeOff, UserCircle, List, CheckCircle2, ChevronRight, Shuffle, LogIn, Plus, AlertCircle, Copy, Check, Heart, Sparkles, Smile, Minus } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

// Nouns with gender/plural classification
const TOPICS = {
  Animales: [
    { name: 'León', gender: 'm', plural: false },
    { name: 'Tigre', gender: 'm', plural: false },
    { name: 'Oso', gender: 'm', plural: false },
    { name: 'Elefante', gender: 'm', plural: false },
    { name: 'Zorro', gender: 'm', plural: false },
    { name: 'Lobo', gender: 'm', plural: false },
    { name: 'Búho', gender: 'm', plural: false },
    { name: 'Delfín', gender: 'm', plural: false },
    { name: 'Panda', gender: 'm', plural: false },
    { name: 'Koala', gender: 'm', plural: false },
    { name: 'Pingüino', gender: 'm', plural: false },
    { name: 'Canguro', gender: 'm', plural: false },
    { name: 'Cebra', gender: 'f', plural: false },
    { name: 'Jirafa', gender: 'f', plural: false },
    { name: 'Mono', gender: 'm', plural: false }
  ],
  Comida: [
    { name: 'Pizza', gender: 'f', plural: false },
    { name: 'Tacos', gender: 'm', plural: true },
    { name: 'Hamburguesa', gender: 'f', plural: false },
    { name: 'Sushi', gender: 'm', plural: false },
    { name: 'Lasagna', gender: 'f', plural: false },
    { name: 'Burrito', gender: 'm', plural: false },
    { name: 'Empanada', gender: 'f', plural: false },
    { name: 'HotDog', gender: 'm', plural: false },
    { name: 'Paella', gender: 'f', plural: false },
    { name: 'Ramen', gender: 'm', plural: false },
    { name: 'Arepa', gender: 'f', plural: false },
    { name: 'Nachos', gender: 'm', plural: true },
    { name: 'PolloFrito', gender: 'm', plural: false },
    { name: 'Pasta', gender: 'f', plural: false },
    { name: 'Torta', gender: 'f', plural: false }
  ],
  Superheroes: [
    { name: 'Batman', gender: 'm', plural: false },
    { name: 'Superman', gender: 'm', plural: false },
    { name: 'Spiderman', gender: 'm', plural: false },
    { name: 'Mujer Maravilla', gender: 'f', plural: false },
    { name: 'Iron Man', gender: 'm', plural: false },
    { name: 'Thor', gender: 'm', plural: false },
    { name: 'Hulk', gender: 'm', plural: false },
    { name: 'Flash', gender: 'm', plural: false },
    { name: 'Wolverine', gender: 'm', plural: false },
    { name: 'Aquaman', gender: 'm', plural: false },
    { name: 'Cyborg', gender: 'm', plural: false },
    { name: 'Robin', gender: 'm', plural: false },
    { name: 'Batgirl', gender: 'f', plural: false },
    { name: 'Supergirl', gender: 'f', plural: false },
    { name: 'Arrow', gender: 'm', plural: false }
  ],
  Profesiones: [
    { name: 'Doctor', gender: 'm', plural: false },
    { name: 'Astronauta', gender: 'm', plural: false },
    { name: 'Detective', gender: 'm', plural: false },
    { name: 'Chef', gender: 'm', plural: false },
    { name: 'Piloto', gender: 'm', plural: false },
    { name: 'Artista', gender: 'm', plural: false },
    { name: 'Científico', gender: 'm', plural: false },
    { name: 'Ninja', gender: 'm', plural: false },
    { name: 'Pirata', gender: 'm', plural: false },
    { name: 'Mago', gender: 'm', plural: false },
    { name: 'Caballero', gender: 'm', plural: false },
    { name: 'Granjero', gender: 'm', plural: false },
    { name: 'Profesor', gender: 'm', plural: false },
    { name: 'Ingeniero', gender: 'm', plural: false },
    { name: 'Músico', gender: 'm', plural: false }
  ]
};

// Fun and funny adjectives with masculine, feminine, and plural forms
const ADJECTIVES = [
  { m: 'Borracho', f: 'Borracha', mp: 'Borrachos', fp: 'Borrachas' },
  { m: 'Somnoliento', f: 'Somnolienta', mp: 'Somnolientos', fp: 'Somnolientas' },
  { m: 'Chismoso', f: 'Chismosa', mp: 'Chismosos', fp: 'Chismosas' },
  { m: 'Confundido', f: 'Confundida', mp: 'Confundidos', fp: 'Confundidas' },
  { m: 'Dramático', f: 'Dramática', mp: 'Dramáticos', fp: 'Dramáticas' },
  { m: 'Ansioso', f: 'Ansiosa', mp: 'Ansiosos', fp: 'Ansiosas' },
  { m: 'Hambriento', f: 'Hambrienta', mp: 'Hambrientos', fp: 'Hambrientas' },
  { m: 'Llorón', f: 'Llorona', mp: 'Llorones', fp: 'Lloronas' },
  { m: 'Despistado', f: 'Despistada', mp: 'Despistados', fp: 'Despistadas' },
  { m: 'Escandaloso', f: 'Escandalosa', mp: 'Escandalosos', fp: 'Escandalosas' },
  { m: 'Vagoneta', f: 'Vagoneta', mp: 'Vagonetas', fp: 'Vagonetas' },
  { m: 'Mañoso', f: 'Mañosa', mp: 'Mañosos', fp: 'Mañosas' },
  { m: 'Brusco', f: 'Brusca', mp: 'Bruscos', fp: 'Bruscas' },
  { m: 'Perezoso', f: 'Perezosa', mp: 'Perezosos', fp: 'Perezosas' },
  { m: 'Exagerado', f: 'Exagerada', mp: 'Exagerados', fp: 'Exageradas' }
];

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "AIzaSyDtAIL1grCqg6Ef8xjazlK0SVxYceo7nWc",
  authDomain: "amigosecreto-54fd0.firebaseapp.com",
  projectId: "amigosecreto-54fd0",
  storageBucket: "amigosecreto-54fd0.firebasestorage.app",
  messagingSenderId: "291845230643",
  appId: "1:291845230643:web:4bdd59f6ad28382eba9346"
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [view, setView] = useState('LANDING'); 
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [numParticipants, setNumParticipants] = useState(3);
  const [topic, setTopic] = useState('Animales');
  const [realNames, setRealNames] = useState(['', '', '']);
  
  const [joinCode, setJoinCode] = useState('');
  const [currentGameCode, setCurrentGameCode] = useState('');
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [isRevealed, setIsRevealed] = useState(false);
  const [newWish, setNewWish] = useState('');

  // 1. Inicializar Autenticación Anónima
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          // Si existe token del entorno, úsalo
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Error de autenticación:", err);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Sincronizar Salas de Juegos
  useEffect(() => {
    if (!user) return;
    
    const gamesRef = collection(db, 'artifacts', appId, 'public', 'data', 'amigo_games');
    const unsubscribe = onSnapshot(gamesRef, 
      (snapshot) => {
        const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGames(gamesData);
      },
      (error) => {
        console.error("Error de sincronización con Firestore:", error);
      }
    );
    
    return () => unsubscribe();
  }, [user]);

  const currentGame = games.find(g => g.id === currentGameCode);
  const myPlayer = currentGame?.players.find(p => p.claimedBy === user?.uid);
  const targetPlayer = myPlayer && currentGame ? currentGame.players.find(p => p.id === myPlayer.targetId) : null;

  const handleNumChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setNumParticipants('');
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setNumParticipants(parsed);
      const clamped = Math.max(1, Math.min(50, parsed));
      setRealNames(prev => {
        if (clamped > prev.length) {
          return [...prev, ...Array(clamped - prev.length).fill('')];
        } else {
          return prev.slice(0, clamped);
        }
      });
    }
  };

  const adjustNumParticipants = (delta) => {
    const current = typeof numParticipants === 'number' ? numParticipants : 3;
    const next = Math.max(1, Math.min(50, current + delta));
    setNumParticipants(next);
    setRealNames(prev => {
      if (next > prev.length) {
        return [...prev, ...Array(next - prev.length).fill('')];
      } else {
        return prev.slice(0, next);
      }
    });
  };

  const updateName = (index, value) => {
    const newNames = [...realNames];
    newNames[index] = value;
    setRealNames(newNames);
  };

  const handleStartGame = async () => {
    const validNum = typeof numParticipants === 'number' ? numParticipants : parseInt(numParticipants, 10);
    if (isNaN(validNum) || validNum < 1 || realNames.some(name => name.trim() === '')) {
      setError("¡Por favor, llena todos los nombres reales y verifica la cantidad de participantes!");
      return;
    }
    setError('');

    const items = TOPICS[topic];
    let possibleNicknames = [];
    
    // Generar combinaciones de elementos únicos y adjetivos adaptados en género/número
    let shuffledItems = [...items].sort(() => Math.random() - 0.5);
    let shuffledAdjectives = [...ADJECTIVES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < realNames.length; i++) {
      const item = shuffledItems[i % shuffledItems.length];
      const adjObj = shuffledAdjectives[i % shuffledAdjectives.length];
      
      let chosenAdj = adjObj.m;
      if (item.plural) {
        chosenAdj = item.gender === 'f' ? adjObj.fp : adjObj.mp;
      } else {
        chosenAdj = item.gender === 'f' ? adjObj.f : adjObj.m;
      }

      possibleNicknames.push(`${item.name} ${chosenAdj}`);
    }

    // Mezclar los apodos únicos para garantizar asignación aleatoria sin repetir
    possibleNicknames = possibleNicknames.sort(() => Math.random() - 0.5);

    let newPlayers = realNames.map((name, index) => ({
      id: index.toString(),
      realName: name.trim(),
      nickname: possibleNicknames[index],
      targetId: null,
      wishes: [],
      claimedBy: null
    }));

    const shuffledIds = [...newPlayers].sort(() => Math.random() - 0.5).map(p => p.id);
    for (let i = 0; i < shuffledIds.length; i++) {
      const currentId = shuffledIds[i];
      const targetId = shuffledIds[(i + 1) % shuffledIds.length];
      const playerIndex = newPlayers.findIndex(p => p.id === currentId);
      newPlayers[playerIndex].targetId = targetId;
    }

    const newCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'amigo_games', newCode), {
        hostId: user.uid,
        topic,
        players: newPlayers,
        createdAt: new Date().toISOString()
      });
      setCurrentGameCode(newCode);
      setView('ROOM');
    } catch (err) {
      setError("Error al crear la sala. Inténtalo de nuevo.");
    }
  };

  const handleJoin = async () => {
    const code = joinCode.toUpperCase().trim();
    if (!code) return;
    
    try {
      const gameRef = doc(db, 'artifacts', appId, 'public', 'data', 'amigo_games', code);
      const gameSnap = await getDoc(gameRef);
      
      if (gameSnap.exists()) {
        setCurrentGameCode(code);
        setView('ROOM');
        setError('');
      } else {
        setError('Juego no encontrado. Por favor revisa tu código.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al buscar el juego. Intenta de nuevo.');
    }
  };

  const handleClaimIdentity = async (playerId) => {
    if (!currentGame) return;
    const updatedPlayers = currentGame.players.map(p => 
      p.id === playerId ? { ...p, claimedBy: user.uid } : p
    );
    const gameRef = doc(db, 'artifacts', appId, 'public', 'data', 'amigo_games', currentGame.id);
    try {
      await updateDoc(gameRef, { players: updatedPlayers });
    } catch (err) {
      setError("Error al reclamar la identidad.");
    }
  };

  const handleAddWish = async () => {
    if (!newWish.trim() || !currentGame || !myPlayer) return;
    const updatedPlayers = currentGame.players.map(p => 
      p.id === myPlayer.id ? { ...p, wishes: [...p.wishes, newWish.trim()] } : p
    );
    const gameRef = doc(db, 'artifacts', appId, 'public', 'data', 'amigo_games', currentGame.id);
    try {
      await updateDoc(gameRef, { players: updatedPlayers });
      setNewWish('');
    } catch (err) {
      setError("Error al agregar deseo.");
    }
  };

  const handleCopyCode = () => {
    const textArea = document.createElement("textarea");
    textArea.value = currentGameCode;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-purple-500 flex items-center justify-center font-black text-2xl text-white animate-pulse">
        <Sparkles className="mr-2" /> Cargando la diversión...
      </div>
    );
  }

  const cardColors = [
    'bg-red-500 border-red-700', 
    'bg-blue-500 border-blue-700', 
    'bg-green-500 border-green-700', 
    'bg-yellow-400 border-yellow-600 text-slate-900', 
    'bg-purple-500 border-purple-700', 
    'bg-pink-500 border-pink-700'
  ];

  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] p-8 md:p-10 max-w-md w-full border-4 border-white text-center">
          <div className="flex justify-center mb-4 relative">
            <div className="bg-yellow-400 p-5 rounded-2xl border-b-4 border-yellow-600 text-white transform rotate-3">
              <Gift size={48} />
            </div>
            <Heart size={32} className="text-pink-500 absolute -top-2 -right-2 animate-bounce" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">¡Amigo Secreto!</h1>
          <p className="text-slate-500 font-bold mb-8">¡El intercambio de regalos más divertido! 🎁💖</p>
          
          {error && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded-xl font-bold mb-6 text-left border-l-4 border-red-500">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="PIN del Juego"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none uppercase font-black text-center tracking-widest text-2xl placeholder-slate-400 transition-all"
                maxLength={4}
              />
              <button 
                onClick={handleJoin}
                disabled={!joinCode}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:border-slate-400 disabled:transform-none text-white font-black py-4 px-6 rounded-xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xl"
              >
                <LogIn size={24} /> ¡Entrar al Juego!
              </button>
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t-2 border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-slate-300 font-black">O</span>
              <div className="flex-grow border-t-2 border-slate-100"></div>
            </div>

            <button 
              onClick={() => { setError(''); setView('SETUP'); }}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-black py-4 px-6 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Plus size={24} /> Crear Nuevo Juego ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'SETUP') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] p-8 max-w-md w-full border-4 border-white">
          <button onClick={() => setView('LANDING')} className="text-purple-600 font-black mb-6 hover:text-purple-800 flex items-center gap-1 transition-colors">
            ← Olvídalo
          </button>
          <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <Smile className="text-yellow-400" size={32} /> ¡Hora de Configurar!
          </h1>
          <div className="space-y-6">
            <div>
              <label className="block font-black text-slate-700 mb-3 text-lg">¿Cuántos amigos? 👯</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => adjustNumParticipants(-1)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-black p-4 rounded-xl border-b-4 border-purple-300 active:border-b-0 active:translate-y-1 transition-all"
                  title="Restar"
                >
                  <Minus size={20} />
                </button>
                <input 
                  type="number" min="1" max="50" 
                  value={numParticipants} onChange={handleNumChange}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none font-bold text-xl text-center transition-all"
                />
                <button 
                  onClick={() => adjustNumParticipants(1)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-black p-4 rounded-xl border-b-4 border-purple-300 active:border-b-0 active:translate-y-1 transition-all"
                  title="Sumar"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block font-black text-slate-700 mb-3 text-lg">Tema de Apodos 🎭</label>
              <select 
                value={topic} onChange={(e) => setTopic(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none font-bold text-xl transition-all cursor-pointer"
              >
                {Object.keys(TOPICS).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button 
              onClick={() => { setError(''); setView('NAMES'); }}
              className="w-full mt-4 bg-pink-500 hover:bg-pink-400 text-white font-black py-4 px-6 rounded-xl border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xl"
            >
              Siguiente Paso <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'NAMES') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] p-8 max-w-md w-full border-4 border-white max-h-[90vh] flex flex-col">
          <button onClick={() => setView('SETUP')} className="text-purple-600 font-black mb-4 hover:text-purple-800 self-start transition-colors">← Volver</button>
          
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <Users className="text-blue-500" size={36} />
            <h1 className="text-3xl font-black text-slate-800">¿Quiénes juegan?</h1>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded-xl font-bold mb-4 shrink-0 border-l-4 border-red-500">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className="space-y-4 mb-6 overflow-y-auto pr-2 custom-scrollbar flex-grow">
            {realNames.map((name, index) => (
              <input 
                key={index} type="text" placeholder={`Amigo #${index + 1}`}
                value={name} onChange={(e) => updateName(index, e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none font-bold text-lg transition-all"
              />
            ))}
          </div>

          <button 
            onClick={handleStartGame}
            className="w-full shrink-0 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black py-4 px-6 rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xl"
          >
            <Shuffle size={24} /> ¡Crear Sala! ✨
          </button>
        </div>
      </div>
    );
  }

  if (view === 'ROOM') {
    if (!currentGame) return <div className="min-h-screen bg-blue-50 flex items-center justify-center font-black text-2xl text-blue-500 animate-pulse">Cargando Juego...</div>;

    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_6px_0_0_rgba(0,0,0,0.05)] border-2 border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-4 h-full bg-blue-500"></div>
            <div className="pl-4">
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm mb-1">PIN DEL JUEGO</p>
              <h2 className="text-4xl font-black flex items-center gap-4 text-slate-800">
                {currentGameCode}
                <button onClick={handleCopyCode} className="bg-slate-100 p-2 rounded-xl hover:bg-blue-100 hover:text-blue-600 text-slate-400 transition-colors active:scale-95" title="Copiar Código">
                  {copied ? <Check size={28} className="text-green-500" /> : <Copy size={28} />}
                </button>
              </h2>
            </div>
            <div className="text-center md:text-right bg-pink-100 p-4 rounded-2xl border-2 border-pink-200">
              <p className="text-pink-500 font-black text-sm uppercase mb-1">Tema</p>
              <p className="font-black text-pink-700 text-xl">{currentGame.topic} 🎭</p>
            </div>
          </div>

          {!myPlayer ? (
            <div className="bg-white rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] p-8 md:p-12 text-center max-w-2xl mx-auto border-2 border-slate-200">
              <div className="inline-block bg-green-100 p-6 rounded-full mb-6 border-4 border-green-200">
                <Smile size={64} className="text-green-500" />
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-4">¿Quién eres? 🤔</h2>
              <p className="text-slate-500 font-bold mb-8 text-lg">Toca tu nombre para unirte a la diversión. ¡Elige con cuidado!</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {currentGame.players.map((p, idx) => {
                  const colorClass = cardColors[idx % cardColors.length];
                  const isClaimed = p.claimedBy !== null;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleClaimIdentity(p.id)}
                      disabled={isClaimed}
                      className={`py-5 px-6 rounded-2xl font-black text-xl transition-all flex justify-between items-center ${
                        isClaimed 
                          ? 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed opacity-60' 
                          : `${colorClass} hover:opacity-90 active:border-b-0 active:translate-y-1 text-white border-b-4`
                      }`}
                    >
                      {p.realName}
                      {isClaimed ? <Lock size={20} /> : <ChevronRight size={24} />}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setActiveTab('PROFILE')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all border-b-4 ${activeTab === 'PROFILE' ? 'bg-purple-600 border-purple-800 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-purple-500'}`}
                >
                  <Lock size={24} /> ¡Ultra Secreto! 🕵️
                </button>
                <button 
                  onClick={() => setActiveTab('WISHLIST')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all border-b-4 ${activeTab === 'WISHLIST' ? 'bg-blue-600 border-blue-800 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-500'}`}
                >
                  <List size={24} /> Pizarra Pública 📢
                </button>
              </div>

              {activeTab === 'PROFILE' && (
                <div className="bg-white rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] border-2 border-slate-200 overflow-hidden">
                  {!isRevealed ? (
                    <div className="p-10 md:p-16 text-center max-w-lg mx-auto">
                      <Lock size={80} className="mx-auto text-slate-300 mb-8" />
                      <h2 className="text-4xl font-black text-slate-800 mb-4">Shh... ¡Es un secreto!</h2>
                      <p className="text-slate-500 font-bold mb-10 text-lg">Asegúrate de que nadie esté mirando tu pantalla antes de revelar a tu objetivo. 👀</p>
                      <button 
                        onClick={() => setIsRevealed(true)}
                        className="w-full bg-red-500 hover:bg-red-400 text-white font-black py-5 rounded-2xl border-b-8 border-red-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3 text-2xl shadow-lg"
                      >
                        <Eye size={28} /> ¡Revelar Ahora!
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 md:p-10">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-200">
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Jugando como</p>
                          <h3 className="text-2xl font-black text-slate-800">{myPlayer.realName}</h3>
                        </div>
                        <button onClick={() => setIsRevealed(false)} className="w-full md:w-auto flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-200 bg-slate-100 px-6 py-4 rounded-2xl font-black transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1">
                          <EyeOff size={20} /> Ocultar Pantalla
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-3xl shadow-lg border-4 border-white transform md:-rotate-2 text-center">
                          <p className="text-sm font-black text-blue-200 uppercase tracking-widest mb-2">Tu Identidad Secreta</p>
                          <p className="text-3xl md:text-4xl font-black text-white">{myPlayer.nickname}</p>
                          <p className="font-bold text-blue-100 mt-4 bg-blue-700 bg-opacity-30 p-3 rounded-xl inline-block text-sm">¡Usa esto para publicar tus deseos! 🤫</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-8 rounded-3xl shadow-lg border-4 border-white transform md:rotate-2 relative text-center">
                          <Heart size={40} className="text-white opacity-30 absolute top-4 right-4" fill="currentColor"/>
                          <p className="text-sm font-black text-pink-200 uppercase tracking-widest mb-2">Le darás un regalo a</p>
                          <p className="text-3xl md:text-4xl font-black text-white">{targetPlayer?.nickname}</p>
                          <p className="font-bold text-pink-100 mt-4 bg-pink-700 bg-opacity-30 p-3 rounded-xl inline-block text-sm">¡Revisa sus deseos en la pizarra! 🎁</p>
                        </div>
                      </div>

                      <div className="border-t-4 border-slate-100 pt-10">
                        <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2"><Sparkles className="text-yellow-500"/> Mi Lista de Deseos</h3>
                        <p className="font-bold text-slate-500 mb-6">Agrega cosas que te encantaría recibir. ¡Los demás solo verán tu apodo! 💖</p>
                        
                        <ul className="mb-6 space-y-3">
                          {myPlayer.wishes.length === 0 ? (
                            <li className="text-slate-400 font-bold italic bg-slate-50 p-4 rounded-xl">Nada agregado aún... ¡No seas tímido/a!</li>
                          ) : (
                            myPlayer.wishes.map((wish, i) => (
                              <li key={i} className="flex items-center gap-3 text-slate-700 font-bold bg-purple-50 p-4 rounded-xl border-2 border-purple-100">
                                <Heart size={20} className="text-pink-500 shrink-0" fill="currentColor"/> {wish}
                              </li>
                            ))
                          )}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <input 
                            type="text" placeholder="Ej. ¡Un oso de peluche gigante! 🧸"
                            value={newWish} onChange={(e) => setNewWish(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWish()}
                            className="flex-1 px-5 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none font-bold text-lg"
                          />
                          <button 
                            onClick={handleAddWish}
                            className="bg-green-500 hover:bg-green-400 text-white font-black px-8 py-4 rounded-2xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all text-xl"
                          >
                            Agregar +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'WISHLIST' && (
                <div className="bg-white rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] border-2 border-slate-200 p-6 md:p-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="bg-yellow-400 p-4 rounded-2xl border-b-4 border-yellow-600 text-slate-900 transform -rotate-6">
                      <List size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-800">Pizarra Pública 📢</h2>
                      <p className="font-bold text-slate-500 mt-1">¡Aquí puedes ver los deseos de la persona a la que le darás tu regalo!</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-1 gap-6 max-w-xl mx-auto">
                    {targetPlayer && (() => {
                      const idx = currentGame.players.findIndex(p => p.id === targetPlayer.id);
                      const colorClass = cardColors[idx % cardColors.length];
                      const isYellow = colorClass.includes('bg-yellow');
                      
                      return (
                      <div key={targetPlayer.id} className={`${colorClass} p-8 rounded-3xl shadow-xl border-b-8 relative transform`}>
                        <span className="absolute -top-4 right-4 font-black bg-white text-slate-900 px-4 py-1.5 rounded-full text-sm shadow-md border-2 border-slate-200 z-10">
                          🎁 Tu Amigo Secreto
                        </span>
                        <h3 className={`font-black text-3xl mb-6 text-center ${isYellow ? 'text-slate-900' : 'text-white'}`}>
                          {targetPlayer.nickname}
                        </h3>
                        
                        <div className={`rounded-2xl p-6 min-h-[140px] text-left ${isYellow ? 'bg-yellow-100/50' : 'bg-black/10'}`}>
                          {targetPlayer.wishes.length === 0 ? (
                            <p className={`font-bold italic text-base text-center py-6 ${isYellow ? 'text-slate-600' : 'text-white/80'}`}>Tu amigo secreto aún no ha agregado deseos... 💭</p>
                          ) : (
                            <ul className="space-y-4">
                              {targetPlayer.wishes.map((wish, idx) => (
                                <li key={idx} className={`flex items-start gap-3 font-bold text-lg ${isYellow ? 'text-slate-800' : 'text-white'}`}>
                                  <Gift size={22} className={`shrink-0 mt-1 ${isYellow ? 'text-pink-500' : 'text-white/90'}`} />
                                  <span>{wish}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )})()}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
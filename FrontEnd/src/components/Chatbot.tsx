import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

// --- THEME COLOR DEFINITIONS ---
// Primary Color: rgba(255, 209, 36) -> #FFD124
const PRIMARY_COLOR_HEX = '#ffd124';
const PRIMARY_COLOR_HOVER = '#e6bd1f'; // Slightly darker for hover
const PRIMARY_COLOR_RING = 'rgba(255, 209, 36, 0.5)'; // For focus ring

// --- ICONS (Minimalist Style) ---

// NEW: Message Button Icon (Chat Bubble) for the closed toggle state
const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2h8v2H6zm10-3H6V9h10v2zm0-3H6V6h10v2z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 5l-.582.582" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-5h-.582" />
    </svg>
);

const MinimizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 10-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
        <path d="M12 16a4 4 0 0 1-4-4V8a4 4 0 0 1 8 0v4a4 4 0 0 1-4 4z" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="10" y1="22" x2="14" y2="22" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="4" fill="red" />
    </svg>
);

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.986 3.986 0 0013 10a3.986 3.986 0 00-1.172-2.828a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const StopCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H7z" clipRule="evenodd" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

// --- Custom Components ---
const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-2 bg-white rounded-xl rounded-bl-none text-gray-800 border border-gray-100 shadow-md">
        <span className="text-sm">Typing...</span>
        <div className="flex items-center space-x-1 ml-2">
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
    </div>
);

// --- Main Chatbot Component ---
export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I'm the official UoG CS AI assistant. I can answer questions about course prerequisites, faculty office hours, and final project guidelines. How can I help you today?", sender: 'bot' }
    ]);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- State for Voice Input ---
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeechApiAvailable, setIsSpeechApiAvailable] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // --- State for Text-to-Speech (TTS) ---
    const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
    const [isSpeechSynthesisAvailable, setIsSpeechSynthesisAvailable] = useState(false);

    // --- Authentication State ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check authentication status
    useEffect(() => {
        const checkAuthStatus = () => {
            const user = localStorage.getItem("user");
            setIsLoggedIn(!!user);
            
            // Close chat if user logs out while chat is open
            if (!user && isOpen) {
                setIsOpen(false);
            }
        };

        // Check initially
        checkAuthStatus();

        // Listen for storage changes (login/logout from other tabs/components)
        const handleStorageChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically in case of same-tab changes
        const interval = setInterval(checkAuthStatus, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    // --- Combined useEffect for both Speech APIs and TTS cleanup ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSpeechApiAvailable(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsRecording(true);
                setInputValue("Listening...");
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setSpeakingIndex(null);
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setInputValue(finalTranscript || interimTranscript || "Listening...");
            };

            recognition.onend = () => {
                setIsRecording(false);
                if (inputValue === "Listening...") {
                    setInputValue("");
                }
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech Recognition Error:", event.error);
                if (event.error === 'not-allowed') {
                    alert("Microphone access was denied. Please allow it in your browser settings.");
                }
                setIsRecording(false);
                setInputValue("");
            };

            recognitionRef.current = recognition;
        } else {
            setIsSpeechApiAvailable(false);
        }

        if ('speechSynthesis' in window) {
            setIsSpeechSynthesisAvailable(true);
        } else {
            console.warn("Speech Synthesis API is not supported in this browser.");
        }

        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };

    }, [inputValue]);

    const toggleChat = () => {
        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            navigate('/login');
            return;
        }
        setIsOpen(!isOpen);
    };

    const handleRefreshChat = () => {
        if (!isLoggedIn) return;
        
        if (isRecording) recognitionRef.current?.stop();
        if (isSpeechSynthesisAvailable) window.speechSynthesis.cancel();
        setSpeakingIndex(null);

        setMessages([{
            text: "Welcome back! I'm the official UoG CS AI assistant. I can answer questions about course prerequisites, faculty office hours, and final project guidelines. How can I help you today?",
            sender: 'bot'
        }]);
        setInputValue('');
        setIsLoading(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) return;
        
        const textToSend = inputValue;
        if (!textToSend.trim() || isLoading || isRecording || inputValue === "Listening...") return;

        if (isSpeechSynthesisAvailable) {
            window.speechSynthesis.cancel();
            setSpeakingIndex(null);
        }

        const userMessage: Message = { text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const botResponseText = await getChatbotResponse(textToSend);
            const botMessage: Message = { text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMessage: Message = { text: "I apologize, I'm currently having trouble connecting to the university's knowledge base. Please try again in a moment.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceClick = () => {
        if (!isLoggedIn) return;
        
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            if (isSpeechSynthesisAvailable) window.speechSynthesis.cancel();
            setSpeakingIndex(null);

            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error("Error starting speech recognition:", e);
            }
        }
    };

    const handleSpeak = (text: string, index: number) => {
        if (!isLoggedIn || !isSpeechSynthesisAvailable || isLoading) return;
        const synth = window.speechSynthesis;

        if (synth.speaking && speakingIndex === index) {
            synth.cancel();
            setSpeakingIndex(null);
            return;
        }

        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
            setSpeakingIndex(null);
        };
        utterance.onerror = () => {
            setSpeakingIndex(null);
        };

        synth.speak(utterance);
        setSpeakingIndex(index);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Chat Window - Only show if user is logged in AND chat is open */}
            {isLoggedIn && isOpen && (
                <div className={`transition-all duration-500 ease-in-out opacity-100 translate-y-0 origin-bottom-right absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-xl shadow-2xl flex flex-col h-[65vh] border border-gray-100`}>

                    {/* Header */}
                    <div className="flex flex-col p-0 border-b border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center px-4 pt-4 pb-2">
                            <div className="flex items-center space-x-2">
                                {/* Chatbot Icon: Now uses PRIMARY_COLOR */}
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PRIMARY_COLOR_HEX }}></div>
                                <h3 className="font-semibold text-gray-800 text-base">
                                    UoG CS Bot
                                </h3>
                            </div>
                            {/* Buttons: Use hover color for contrast */}
                            <div className="flex items-center space-x-2 text-gray-400">
                                <button
                                    onClick={handleRefreshChat}
                                    className="p-0.5 rounded transition-colors"
                                    onMouseEnter={(e) => e.currentTarget.style.color = PRIMARY_COLOR_HEX}
                                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                                    aria-label="Chat refresh button"
                                >
                                    <RefreshIcon />
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                    onClick={toggleChat}
                                    className="p-0.5 rounded transition-colors"
                                    onMouseEnter={(e) => e.currentTarget.style.color = PRIMARY_COLOR_HEX}
                                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                                    aria-label="Button for minimizing the widget"
                                >
                                    <MinimizeIcon />
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                    onClick={toggleChat}
                                    className="p-0.5 rounded transition-colors"
                                    onMouseEnter={(e) => e.currentTarget.style.color = PRIMARY_COLOR_HEX}
                                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                                    aria-label="Close Chat"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* Status and Date */}
                        <div className="flex flex-col items-start px-4 pb-3 text-xs text-gray-400">
                            <span className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                                <span className="text-xs italic">We're online ...</span>
                            </span>
                            <span className="text-gray-400 mt-1">October 15, 2024</span>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50">
                        <div className="flex flex-col space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >

                                    {/* Message Bubble (User message uses PRIMARY_COLOR) */}
                                    <div className={`max-w-[80%] p-3 text-sm shadow-md transition-all duration-300 ${msg.sender === 'user'
                                            ? 'text-black rounded-xl rounded-br-sm' // Set text color to black for contrast on yellow
                                            : 'bg-white text-gray-800 rounded-xl rounded-tl-sm border border-gray-100'
                                        }`}
                                        style={msg.sender === 'user' ? { backgroundColor: PRIMARY_COLOR_HEX } : {}}>
                                        <p>{msg.text}</p>
                                    </div>

                                    {/* Speak Button (Bot messages uses PRIMARY_COLOR for hover) */}
                                    {msg.sender === 'bot' && isSpeechSynthesisAvailable && (
                                        <button
                                            onClick={() => handleSpeak(msg.text, index)}
                                            aria-label={speakingIndex === index ? "Stop speaking" : "Read message aloud"}
                                            className="w-6 h-6 flex-shrink-0 text-gray-400 disabled:text-gray-200 transition-colors mt-2"
                                            style={speakingIndex === index ? { color: PRIMARY_COLOR_HEX } : {}}
                                            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = PRIMARY_COLOR_HEX; }}
                                            onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = speakingIndex === index ? PRIMARY_COLOR_HEX : ''; }}
                                            disabled={isLoading}
                                        >
                                            {speakingIndex === index ? <StopCircleIcon /> : <SpeakerIcon />}
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <TypingIndicator />
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={isRecording ? "Listening..." : (isLoading ? "Please wait..." : "Enter message")}
                                // Input focus ring uses PRIMARY_COLOR_RING
                                className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-full text-gray-800 focus:outline-none focus:ring-1 transition-shadow placeholder-gray-400"
                                style={{ '--tw-ring-color': PRIMARY_COLOR_RING } as React.CSSProperties}
                                disabled={isLoading || isRecording}
                            />
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">

                                {/* Voice Button */}
                                {isSpeechApiAvailable && (
                                    <button
                                        type="button"
                                        onClick={handleVoiceClick}
                                        disabled={isLoading}
                                        aria-label={isRecording ? "Stop Recording" : "Start Voice Input"}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                                            ${isRecording
                                                ? 'text-red-500 animate-pulse'
                                                : 'text-gray-500'
                                            }
                                            disabled:text-gray-300
                                        `}
                                        onMouseEnter={(e) => { if (!isRecording) e.currentTarget.style.color = PRIMARY_COLOR_HEX; }}
                                        onMouseLeave={(e) => { if (!isRecording) e.currentTarget.style.color = ''; }}
                                    >
                                        {isRecording ? <StopIcon /> : <MicrophoneIcon />}
                                    </button>
                                )}

                                {/* Send Button (Filled with PRIMARY_COLOR) */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim() || isRecording || inputValue === "Listening..."}
                                    aria-label="Send Message"
                                    className="text-black w-10 h-10 rounded-full flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-lg"
                                    style={{ backgroundColor: PRIMARY_COLOR_HEX }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR_HOVER}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR_HEX}
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button - ALWAYS VISIBLE */}
            <button
                onClick={toggleChat}
                aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
                className={`w-14 h-14 rounded-full shadow-xl transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 flex items-center justify-center border-2 ${
                    !isLoggedIn ? 'bg-gray-100 border-gray-300' : 'bg-white'
                }`}
                style={{
                    borderColor: isLoggedIn ? PRIMARY_COLOR_HEX : '#d1d5db',
                    color: isLoggedIn ? PRIMARY_COLOR_HEX : '#9ca3af',
                    boxShadow: isLoggedIn ? `0 4px 10px ${PRIMARY_COLOR_RING}` : '0 4px 10px rgba(0,0,0,0.1)',
                    '--tw-ring-color': isLoggedIn ? PRIMARY_COLOR_RING : '#9ca3af',
                } as React.CSSProperties}
            >
                {isOpen ? (
                    <CloseIcon />
                ) : !isLoggedIn ? (
                    // Show lock icon when not logged in
                    <LockIcon />
                ) : (
                    <MessageIcon />
                )}
            </button>

            {/* Tooltip for non-logged-in users */}
            {!isLoggedIn && (
                <div className="absolute bottom-20 right-0 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap opacity-90">
                    Login to use chatbot
                    <div className="absolute top-full right-6 border-4 border-transparent border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
}
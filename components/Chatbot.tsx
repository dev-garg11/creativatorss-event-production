'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  getChatbotResponse,
  INITIAL_SUGGESTIONS,
  INITIAL_SUGGESTIONS_EN,
  INITIAL_SUGGESTIONS_HI,
  ChatResponse,
  ActionButton
} from '../data/chatbotKnowledge';
import { site } from '../data/site';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: ActionButton[];
  suggestions?: string[];
  lang?: 'hi' | 'en';
}

// Clean markdown for text-to-speech
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[•\-\*]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Active Chat Language mode ('hi' | 'en')
  const [chatLang, setChatLang] = useState<'hi' | 'en'>('hi');

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isVoiceStarting, setIsVoiceStarting] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const voiceStartIdRef = useRef(0);

  const showVoiceFeedback = (message: string, duration = 5000) => {
    setVoiceFeedback(message);
    if (duration > 0) {
      window.setTimeout(() => setVoiceFeedback(''), duration);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize welcome message
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialGreeting: ChatMessage = {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Namaste & Welcome! 👋 **Creativatorss Event & Production** mein aapka swagat hai!\n\nMain aapka personal event assistant hoon — **main Hindi aur English dono samajhta hoon aur baat kar sakta hoon**.\n\nAap Creativatorss ki kisi bhi service (**Weddings, Corporate Events, Fashion Shows, Brand Shoots, Artist & Celebrity Management, Pricing & Office Locations**) ke baare mein pooch sakte hain.\n\nAap niche type kar sakte hain ya 🎙️ **Mic icon** daba kar direct bol sakte hain!`,
      timestamp: timeStr,
      suggestions: [
        '✨ Hamari Services kya hain?',
        '💍 Wedding Planning details',
        '🏢 Corporate Events & Conferences',
        '💰 Event ka kitna kharcha hota hai?',
        '📍 Office kahan par hai?',
        '🇬🇧 Chat in English'
      ],
      actions: [
        {
          label: '💬 Chat on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hello Creativatorss! I would like to inquire about event management services.')}`,
          icon: 'whatsapp'
        },
        {
          label: 'View All Services',
          type: 'link',
          href: '/services',
          icon: 'external'
        }
      ],
      lang: 'hi'
    };
    setMessages([initialGreeting]);

    // Show popup teaser bubble after 2.5 seconds if chat not open
    const timer = setTimeout(() => {
      setShowWelcomeBubble(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowWelcomeBubble(false);
      setHasOpenedBefore(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      stopListening();
      stopSpeaking();
    }
  }, [isOpen]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  // Text-To-Speech function
  const speakText = (text: string, lang: 'hi' | 'en' = 'en', messageId?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (isSpeaking === messageId) {
      setIsSpeaking(null);
      return;
    }

    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en'));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      if (messageId) setIsSpeaking(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(null);
  };

  // Speech Recognition (Voice Input) functions
  const startListening = () => {
    stopSpeaking();

    const SpeechRecognition = typeof window !== 'undefined'
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;

    if (!SpeechRecognition) {
      showVoiceFeedback('Voice input ke liye Chrome, Edge ya Safari use kijiye.');
      return;
    }

    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
      showVoiceFeedback('Mic ke liye website HTTPS ya localhost par kholni hogi.');
      return;
    }

    setIsVoiceStarting(true);
    // Start directly from the button click. SpeechRecognition owns the browser
    // microphone permission flow; awaiting getUserMedia here can lose the
    // user gesture and make recognition fail with a misleading permission error.
    setVoiceFeedback(voiceLang === 'hi-IN' ? 'Mic start ho raha hai...' : 'Starting microphone...');
    const voiceStartId = ++voiceStartIdRef.current;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* already stopped */ }
        recognitionRef.current = null;
      }

      if (voiceStartIdRef.current !== voiceStartId) return;

      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setIsVoiceStarting(false);
        setVoiceFeedback(voiceLang === 'hi-IN' ? '🎙️ Sun raha hoon... Boliye ✨' : '🎙️ Listening... Speak now ✨');
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        let isFinalResult = false;

        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinalResult = true;
          }
        }

        if (fullTranscript) {
          setInputText(fullTranscript);
        }

        if (isFinalResult && fullTranscript.trim()) {
          setVoiceFeedback('Processing your question...');
          setTimeout(() => {
            handleSendMessage(fullTranscript.trim());
            stopListening();
          }, 350);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted' && recognitionRef.current !== recognition) return;
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setIsVoiceStarting(false);
        if (event.error === 'audio-capture') {
          showVoiceFeedback('Mic detect nahi hua. Windows/browser me microphone enabled hai?');
        } else if (event.error === 'network') {
          showVoiceFeedback('Voice service connect nahi ho paayi. Internet check karke dobara try karein.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          showVoiceFeedback('⚠️ Mic blocked hai. URL bar ke lock/mic icon par click karke Allow karein.');
        } else if (event.error === 'no-speech') {
          showVoiceFeedback('Aawaz nahi suni. Please mic ke paas bolkar dobara try karein.', 3000);
        } else {
          setVoiceFeedback('');
        }
      };

      recognition.onend = () => {
        if (recognitionRef.current !== recognition) return;
        setIsListening(false);
        setIsVoiceStarting(false);
        if (recognitionRef.current === recognition) {
          recognitionRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition start error:', err);
      setIsListening(false);
      setIsVoiceStarting(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        showVoiceFeedback('⚠️ Mic permission denied hai. URL bar ke lock/mic icon se Allow karke page reload karein.');
      } else if (err?.name === 'NotFoundError') {
        showVoiceFeedback('Mic nahi mila. Windows me microphone connect karke dobara try karein.');
      } else if (err?.name === 'NotReadableError') {
        showVoiceFeedback('Mic kisi aur app me use ho raha hai. Use band karke dobara try karein.');
      } else {
        showVoiceFeedback('Mic start nahi ho paaya. HTTPS/localhost par kholkar dobara try karein.');
      }
    }
  };

  const stopListening = () => {
    voiceStartIdRef.current += 1;
    if (recognitionRef.current) {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      try { recognition.abort(); } catch { /* already stopped */ }
    }
    setIsListening(false);
    setIsVoiceStarting(false);
    window.setTimeout(() => setVoiceFeedback(''), 1000);
  };

  const toggleListening = () => {
    if (isListening || isVoiceStarting) {
      if (inputText.trim()) {
        handleSendMessage(inputText.trim());
      }
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleLanguage = () => {
    const nextLang = chatLang === 'hi' ? 'en' : 'hi';
    setChatLang(nextLang);
    setVoiceLang(nextLang === 'hi' ? 'hi-IN' : 'en-IN');

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const switchMsg: ChatMessage = {
      id: `lang-switch-${Date.now()}`,
      sender: 'bot',
      text: nextLang === 'hi'
        ? `🙏 **Namaste! Main ab aapse Hindi aur Hinglish mein baat karunga.**\n\nAap Creativatorss ki kisi bhi service ya event ke baare mein pooch sakte hain:\n• 💍 **Wedding Planning**\n• 🏢 **Corporate Events & Conferences**\n• 🌟 **Celebrity & Artist Booking**\n• 💰 **Event ka Kharcha aur Custom Quote**\n• 📍 **Office Address & Cities Coverage**\n\nAap kya jaanna chahte hain?`
        : `✨ **Switched to English!**\n\nHow can I help you with Creativatorss event production services today? Feel free to ask about weddings, corporate summits, artist management, or pricing.`,
      timestamp: timeStr,
      suggestions: (nextLang === 'hi' ? INITIAL_SUGGESTIONS_HI : INITIAL_SUGGESTIONS_EN).map(s => s.query),
      lang: nextLang
    };
    setMessages(prev => [...prev, switchMsg]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Direct language switcher chip triggers
    let activeLang = chatLang;
    if (text === '🇮🇳 हिंदी में बात करें' || text.toLowerCase() === 'hindi me baat karo') {
      activeLang = 'hi';
      setChatLang('hi');
      setVoiceLang('hi-IN');
    } else if (text === '🇬🇧 Chat in English' || text.toLowerCase() === 'speak in english') {
      activeLang = 'en';
      setChatLang('en');
      setVoiceLang('en-IN');
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic typing delay
    setTimeout(() => {
      const botResponse: ChatResponse = getChatbotResponse(text, activeLang);

      // Auto sync active session language if user spoke/typed in Hindi or English
      if (botResponse.lang && botResponse.lang !== activeLang) {
        setChatLang(botResponse.lang);
        setVoiceLang(botResponse.lang === 'hi' ? 'hi-IN' : 'en-IN');
      }

      const newBotMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: newBotMsgId,
        sender: 'bot',
        text: botResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: botResponse.actions,
        suggestions: botResponse.suggestions,
        lang: botResponse.lang
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // If voice output is enabled, read the answer aloud!
      if (isVoiceOutputEnabled) {
        speakText(botResponse.text, botResponse.lang, newBotMsgId);
      }
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    stopSpeaking();
    stopListening();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: chatLang === 'hi'
          ? `Chat reset ho gayi hai. 🙏 Aap Creativatorss ke kisi bhi event ya service ke baare mein pooch sakte hain. Boliye ya type kijiye!`
          : `Chat has been reset. How can I help you with your event today? You can type or use the mic to speak!`,
        timestamp: timeStr,
        suggestions: (chatLang === 'hi' ? INITIAL_SUGGESTIONS_HI : INITIAL_SUGGESTIONS_EN).map(s => s.query),
        lang: chatLang
      }
    ]);
  };

  // Helper to render bold text, bullet points and markdown links nicely
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="chatbot-empty-line" />;
      }

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim());

      const parts: React.ReactNode[] = [];
      const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        const token = match[0];
        if (token.startsWith('**') && token.endsWith('**')) {
          parts.push(
            <strong key={`bold-${lineIdx}-${match.index}`} className="chatbot-bold-text">
              {token.slice(2, -2)}
            </strong>
          );
        } else if (token.startsWith('[') && token.includes('](')) {
          const title = token.substring(1, token.indexOf(']('));
          const url = token.substring(token.indexOf('](') + 2, token.length - 1);
          parts.push(
            <a
              key={`link-${lineIdx}-${match.index}`}
              href={url}
              target={url.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="chatbot-inline-link"
            >
              {title}
            </a>
          );
        }
        lastIndex = match.index + token.length;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={lineIdx} className={`chatbot-text-line ${isBullet ? 'chatbot-bullet-line' : ''}`}>
          {parts}
        </p>
      );
    });
  };

  if (!mounted) return null;

  return (
    <div className="chatbot-root">
      {/* 1. Floating Welcome Bubble Teaser (appears when chat is closed) */}
      {!isOpen && showWelcomeBubble && (
        <div className="chatbot-teaser-bubble">
          <div className="chatbot-teaser-content" onClick={() => setIsOpen(true)}>
            <div className="chatbot-teaser-avatar">
              <Bot size={16} />
            </div>
            <div className="chatbot-teaser-text">
              <strong>Creativatorss AI</strong>
              <span>Have an event query? Click to chat! ✨</span>
            </div>
          </div>
          <button
            type="button"
            className="chatbot-teaser-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowWelcomeBubble(false);
            }}
            aria-label="Close notification"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* 2. Floating Launcher Button */}
      <button
        type="button"
        className={`chatbot-launcher-btn ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat with Creativatorss Assistant'}
      >
        {isOpen ? (
          <X size={24} className="chatbot-icon-rotate" />
        ) : (
          <>
            <MessageSquare size={24} />
            {!hasOpenedBefore && <span className="chatbot-unread-dot" />}
          </>
        )}
      </button>

      {/* 3. Chat Window Drawer / Card */}
      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="Creativatorss AI Chatbot">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-wrap">
                <div className="chatbot-avatar">
                  <Bot size={18} />
                </div>
                <span className="chatbot-status-indicator" title="Online" />
              </div>
              <div>
                <div className="chatbot-title">
                  Creativatorss Assistant <Sparkles size={13} className="chatbot-gold-icon" />
                </div>
                <div className="chatbot-subtitle">
                  <span className="chatbot-live-dot" /> Online • Voice & Text Enabled
                </div>
              </div>
            </div>

            <div className="chatbot-header-actions">
              {/* Language Switch Button */}
              <button
                type="button"
                className="chatbot-lang-toggle-btn"
                onClick={toggleLanguage}
                title={chatLang === 'hi' ? 'Switch to English' : 'हिंदी / Hinglish में बात करें'}
                aria-label="Toggle language between Hindi and English"
              >
                {chatLang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
              </button>

              {/* Text-To-Speech Readout Toggle */}
              <button
                type="button"
                className={`chatbot-action-icon-btn ${isVoiceOutputEnabled ? 'is-voice-active' : ''}`}
                onClick={() => {
                  if (isVoiceOutputEnabled) stopSpeaking();
                  setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
                }}
                title={isVoiceOutputEnabled ? 'Voice output ON (Click to mute)' : 'Voice output OFF (Click to hear answers)'}
                aria-label={isVoiceOutputEnabled ? 'Voice output ON' : 'Voice output OFF'}
              >
                {isVoiceOutputEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              {/* Reset Chat */}
              <button
                type="button"
                className="chatbot-action-icon-btn"
                onClick={resetChat}
                title="Restart Chat"
                aria-label="Restart chat"
              >
                <RotateCcw size={15} />
              </button>

              {/* Close */}
              <button
                type="button"
                className="chatbot-action-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                aria-label="Close chat"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chatbot-messages-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-msg-row ${msg.sender === 'user' ? 'chatbot-msg-user' : 'chatbot-msg-bot'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="chatbot-msg-avatar">
                    <Bot size={14} />
                  </div>
                )}

                <div className="chatbot-msg-content-wrap">
                  <div className="chatbot-bubble">
                    {renderFormattedText(msg.text)}

                    {/* Interactive Action Buttons if provided */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="chatbot-actions-cluster">
                        {msg.actions.map((act, actIdx) => {
                          if (act.type === 'whatsapp') {
                            return (
                              <a
                                key={actIdx}
                                href={act.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chatbot-action-pill chatbot-action-whatsapp"
                              >
                                <span>{act.label}</span>
                                <ExternalLink size={11} />
                              </a>
                            );
                          }
                          if (act.type === 'call') {
                            return (
                              <a
                                key={actIdx}
                                href={act.href}
                                className="chatbot-action-pill chatbot-action-call"
                              >
                                <Phone size={12} />
                                <span>{act.label}</span>
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={actIdx}
                              href={act.href || '/contact'}
                              className="chatbot-action-pill chatbot-action-link"
                              onClick={() => {
                                if (window.innerWidth < 768) setIsOpen(false);
                              }}
                            >
                              <span>{act.label}</span>
                              <ExternalLink size={11} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="chatbot-msg-footer">
                    <span className="chatbot-timestamp">{msg.timestamp}</span>

                    {/* Speaker Readout Button on Bot Messages */}
                    {msg.sender === 'bot' && (
                      <button
                        type="button"
                        className={`chatbot-speak-bubble-btn ${isSpeaking === msg.id ? 'is-speaking' : ''}`}
                        onClick={() => speakText(msg.text, msg.lang, msg.id)}
                        title={isSpeaking === msg.id ? 'Stop listening' : 'Listen to this answer'}
                        aria-label="Listen to answer"
                      >
                        <Volume2 size={11} />
                        {isSpeaking === msg.id && <span className="chatbot-sound-indicator">Speaking...</span>}
                      </button>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="chatbot-suggestions-row">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          className="chatbot-suggestion-chip"
                          onClick={() => handleSendMessage(sug)}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chatbot-msg-row chatbot-msg-bot">
                <div className="chatbot-msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="chatbot-bubble chatbot-typing-bubble">
                  <div className="chatbot-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ / Topics Pills at Bottom */}
          <div className="chatbot-quick-bar">
            <span className="chatbot-quick-label">{chatLang === 'hi' ? 'Topic:' : 'Topics:'}</span>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage(chatLang === 'hi' ? 'Aap kya kya services dete hain?' : 'What services do you provide?')}
            >
              {chatLang === 'hi' ? '✨ Services' : '✨ Services'}
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage(chatLang === 'hi' ? 'Wedding planning ki jankari chahiye' : 'Wedding Planning details')}
            >
              {chatLang === 'hi' ? '💍 Wedding' : '💍 Wedding'}
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage(chatLang === 'hi' ? 'Corporate events aur conferences' : 'Corporate events and conferences')}
            >
              {chatLang === 'hi' ? '🏢 Corporate' : '🏢 Corporate'}
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage(chatLang === 'hi' ? 'Celebrity aur artist booking' : 'Celebrity and artist booking')}
            >
              {chatLang === 'hi' ? '🌟 Artists' : '🌟 Artists'}
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage(chatLang === 'hi' ? 'Event ka kitna kharcha hota hai?' : 'How much does an event cost?')}
            >
              {chatLang === 'hi' ? '💰 Kharcha' : '💰 Pricing'}
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage(chatLang === 'hi' ? 'Aapka office kahan par hai?' : 'Where is your office located?')}
            >
              {chatLang === 'hi' ? '📍 Office' : '📍 Address'}
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage(chatLang === 'hi' ? 'Creativatorss team se kaise contact karein?' : 'Creativatorss team se kaise contact karein?')}
            >
              {chatLang === 'hi' ? '📞 Contact' : '📞 Contact'}
            </button>
          </div>

          {/* Voice Listening Feedback Banner */}
          {(isListening || voiceFeedback) && (
            <div className="chatbot-voice-banner">
              <div className="chatbot-voice-pulse-ring" />
              <div className="chatbot-voice-wave">
                <span />
                <span />
                <span />
                <span />
              </div>
              <span className="chatbot-voice-text">{voiceFeedback || 'Listening... Speak in Hindi or English'}</span>
              
              <div className="chatbot-voice-lang-toggle">
                <button
                  type="button"
                  className={voiceLang === 'hi-IN' ? 'is-active' : ''}
                  onClick={() => setVoiceLang('hi-IN')}
                  title="Hindi & Hinglish voice recognition"
                >
                  Hindi
                </button>
                <button
                  type="button"
                  className={voiceLang === 'en-IN' ? 'is-active' : ''}
                  onClick={() => setVoiceLang('en-IN')}
                  title="English voice recognition"
                >
                  English
                </button>
              </div>

              <button
                type="button"
                className="chatbot-voice-close"
                onClick={stopListening}
                aria-label="Stop listening"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="chatbot-footer">
            <div className="chatbot-input-wrap">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? (chatLang === 'hi' ? '🎙️ Sun raha hoon... Boliye ✨' : '🎙️ Listening... Speak now ✨')
                    : (chatLang === 'hi' ? 'Creativatorss ke baare me puchein ya mic dabayein...' : 'Ask about events or tap mic to speak...')
                }
                className="chatbot-input"
                maxLength={400}
              />

              {/* Direct WhatsApp shortcut */}
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I have an event inquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chatbot-input-whatsapp-btn"
                title="Direct WhatsApp"
                aria-label="Direct WhatsApp"
              >
                💬
              </a>

              {/* Microphone Voice Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`chatbot-mic-btn ${isListening || isVoiceStarting ? 'is-listening' : ''}`}
                title={isListening || isVoiceStarting ? 'Stop listening (Tap to cancel)' : 'Speak to AI Assistant (Voice Input)'}
                aria-label={isListening || isVoiceStarting ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening || isVoiceStarting ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="chatbot-send-btn"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="chatbot-footer-brand">
              <span>Creativatorss Event & Production · Voice & Text Assistant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

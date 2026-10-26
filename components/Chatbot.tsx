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
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize welcome message
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialGreeting: ChatMessage = {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Hello! 👋 Welcome to **Creativatorss Event & Production**!\n\nI am your dedicated virtual assistant. I can help you with all questions regarding our website and services — including **Luxury Weddings, Corporate Events, Fashion Shows, Brand Shoots, Artist & Celebrity Management, Pricing & Office Locations** (I support both English & Hindi).\n\nHow can I help you with your event today? You can type below or tap the 🎙️ **Mic icon** to speak directly!`,
      timestamp: timeStr,
      suggestions: [
        '✨ What services do you offer?',
        '💍 Wedding Planning details',
        '🏢 Corporate Events & Conferences',
        '💰 How to get a custom quote?',
        '📍 Where is your office located?'
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
      ]
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
      alert('Voice input is not supported by your browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback(voiceLang === 'hi-IN' ? 'Sun raha hoon... Boliye ✨' : 'Listening... Speak now ✨');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setInputText(transcript);

        if (event.results[current].isFinal) {
          setVoiceFeedback('Processing your question...');
          setTimeout(() => {
            handleSendMessage(transcript);
            stopListening();
          }, 450);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceFeedback('Microphone permission blocked. Please allow mic in browser settings.');
          setTimeout(() => setVoiceFeedback(''), 4000);
        } else {
          setVoiceFeedback('');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start error:', err);
      setIsListening(false);
      setVoiceFeedback('');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    setVoiceFeedback('');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

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
      const botResponse: ChatResponse = getChatbotResponse(text);
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
        text: `Chat has been reset. How can I help you with your event today? You can type or use the mic to speak!`,
        timestamp: timeStr,
        suggestions: INITIAL_SUGGESTIONS.map(s => s.query)
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
            <span className="chatbot-quick-label">Topics:</span>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage('What services do you provide?')}
            >
              Services
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage('Wedding Planning details')}
            >
              Wedding
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage('Corporate events and conferences')}
            >
              Corporate
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage('Celebrity and artist booking')}
            >
              Artists
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage('Where is your office located?')}
            >
              Address
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage('How much does an event cost?')}
            >
              Pricing
            </button>
            <button
              type="button"
              className="chatbot-quick-pill"
              onClick={() => handleSendMessage('Creativatorss team se kaise contact karein?')}
            >
              Contact
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
                placeholder={isListening ? '🎙️ Listening... Bolna shuru kijiye...' : 'Poochiye ya mic daba kar boliye...'}
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
                className={`chatbot-mic-btn ${isListening ? 'is-listening' : ''}`}
                title={isListening ? 'Stop listening (Tap to cancel)' : 'Speak to AI Assistant (Voice Input)'}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
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

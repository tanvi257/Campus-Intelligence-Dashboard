"use client";

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Dashboard.module.css';
import chatStyles from '@/styles/ChatAssistant.module.css';

// --- Inline SVG Icons for premium appearance without dependencies ---
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);

const CoffeeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const GraduationCapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const SparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"></path></svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export default function Home() {
  // --- States ---
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);
  
  // MCP Connection Status
  const [mcpStatus, setMcpStatus] = useState({ connected: false, servers: {} });
  
  // Chat States
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your Unified Campus AI Assistant. I can dynamically fetch live data from our library catalog, cafeteria menu, events roster, and academic portal using the Model Context Protocol (MCP). How can I help you today?',
      toolCalls: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeToolCalls, setActiveToolCalls] = useState([]);
  
  // Widget 1: Library States
  const [libQuery, setLibQuery] = useState('');
  const [libResults, setLibResults] = useState([]);
  const [libLoading, setLibLoading] = useState(false);
  const [checkoutBookId, setCheckoutBookId] = useState('');
  const [checkoutStudentId, setCheckoutStudentId] = useState('');
  const [libSuccessMsg, setLibSuccessMsg] = useState('');

  // Widget 2: Cafeteria States
  const [cafDay, setCafDay] = useState('');
  const [cafMeal, setCafMeal] = useState('lunch');
  const [cafMenu, setCafMenu] = useState(null);
  const [cafLoading, setCafLoading] = useState(false);
  const [cafCrowd, setCafCrowd] = useState(null);

  // Widget 3: Events States
  const [eventCat, setEventCat] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [rsvpEventId, setRsvpEventId] = useState('');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpStudentId, setRsvpStudentId] = useState('');
  const [rsvpResult, setRsvpResult] = useState(null);

  // Widget 4: Academics States
  const [courseCode, setCourseCode] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [acadCalendar, setAcadCalendar] = useState([]);

  const messagesEndRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    // Load API Key from LocalStorage on mount
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowSettings(true);
    }
    const savedModel = localStorage.getItem('gemini_model_name');
    if (savedModel) {
      setModelName(savedModel);
    }
    
    // Initial fetch for all widgets
    fetchMcpStatus();
    fetchLibraryBooks('Algorithms');
    fetchCafeteriaMenu();
    fetchCafeteriaCrowd();
    fetchEvents('');
    fetchAcademicCalendar('midterm');

    // Poll MCP server status every 6 seconds
    const statusInterval = setInterval(fetchMcpStatus, 6000);
    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    // Scroll chat to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeToolCalls]);

  // --- Toast Trigger ---
  const triggerToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- API Integrations ---

  // 1. Fetch MCP Server status details
  const fetchMcpStatus = async () => {
    try {
      const res = await fetch('/api/mcp-status');
      const data = await res.json();
      if (data.status === 'success') {
        const servers = data.servers || {};
        const connected = Object.values(servers).some(s => s.connected);
        setMcpStatus({ connected, servers });
      }
    } catch (err) {
      console.error("Failed to fetch MCP status", err);
    }
  };

  // Helper: call MCP tool directly from UI
  const executeWidgetTool = async (toolName, args) => {
    const res = await fetch('/api/widget-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolName, args })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Widget execution failed.');
    }
    return await res.json();
  };

  // 2. Library Widget Logic
  const fetchLibraryBooks = async (query) => {
    setLibLoading(true);
    try {
      const res = await executeWidgetTool('search_books', { query: query || 'cs' });
      if (Array.isArray(res)) {
        setLibResults(res);
      } else {
        setLibResults([]);
      }
    } catch (err) {
      console.error(err);
      setLibResults([]);
    } finally {
      setLibLoading(false);
    }
  };

  const handleCheckoutBook = async (e) => {
    e.preventDefault();
    if (!checkoutBookId || !checkoutStudentId) {
      triggerToast("Please provide Book ID and Student ID.", "error");
      return;
    }
    try {
      const res = await executeWidgetTool('checkout_book', {
        bookId: checkoutBookId,
        studentId: checkoutStudentId
      });
      if (res.status === 'Success') {
        setLibSuccessMsg(res.message);
        triggerToast("Book checked out successfully!");
        fetchLibraryBooks(libQuery || 'cs');
        setCheckoutBookId('');
        // Append checkout context to assistant chat dynamically
        setMessages(prev => [
          ...prev,
          { role: 'user', content: `Check out book ID ${checkoutBookId} for Student ${checkoutStudentId}` },
          { 
            role: 'assistant', 
            content: `**Book Checkout Confirmed**\n\n${res.message}\n\n* **Due Date**: ${res.dueDate}\n* **Collection Location**: ${res.instructions}\n\n(Processed via Library MCP Server)`,
            toolCalls: [{ name: 'checkout_book', args: { bookId: checkoutBookId, studentId: checkoutStudentId }, status: 'success', result: JSON.stringify(res) }]
          }
        ]);
      } else {
        triggerToast(res, "error");
      }
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  // 3. Cafeteria Widget Logic
  const fetchCafeteriaMenu = async (day = '') => {
    setCafLoading(true);
    try {
      const res = await executeWidgetTool('get_menu', { day: day || undefined, meal: cafMeal || undefined });
      setCafMenu(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCafLoading(false);
    }
  };

  const fetchCafeteriaCrowd = async () => {
    try {
      const res = await executeWidgetTool('check_crowd_level', {});
      setCafCrowd(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCafeteriaMenu(cafDay);
  }, [cafDay, cafMeal]);

  // 4. Events Widget Logic
  const fetchEvents = async (category = '') => {
    setEventsLoading(true);
    try {
      const res = await executeWidgetTool('get_upcoming_events', { category: category || undefined });
      if (Array.isArray(res)) {
        setEventsList(res);
      } else {
        setEventsList([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(eventCat);
  }, [eventCat]);

  const handleRsvpEvent = async (e) => {
    e.preventDefault();
    if (!rsvpEventId || !rsvpName || !rsvpStudentId) {
      triggerToast("Please fill all registration fields.", "error");
      return;
    }
    try {
      const res = await executeWidgetTool('register_for_event', {
        eventId: rsvpEventId,
        studentName: rsvpName,
        studentId: rsvpStudentId
      });
      setRsvpResult(res);
      triggerToast(`Registration ${res.status}!`);
      fetchEvents(eventCat);
      
      // Append event ticket context to chatbot conversation
      setMessages(prev => [
        ...prev,
        { role: 'user', content: `Register me for Event ${rsvpEventId}` },
        { 
          role: 'assistant', 
          content: `**Event Registration Complete**\n\n* **Status**: ${res.status}\n* **Ticket Code**: \`${res.ticketCode || 'N/A'}\`\n* **Confirmation**: ${res.message}\n* **Venue**: ${res.eventDetails?.location || 'Campus'}\n* **Instructions**: ${res.instructions || ''}\n\n(Processed via Events MCP Server)`,
          toolCalls: [{ name: 'register_for_event', args: { eventId: rsvpEventId, studentName: rsvpName, studentId: rsvpStudentId }, status: 'success', result: JSON.stringify(res) }]
        }
      ]);
      setRsvpEventId('');
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  // 5. Academics Widget Logic
  const handleCourseSearch = async (e) => {
    e.preventDefault();
    if (!courseCode) return;
    setCourseLoading(true);
    try {
      const res = await executeWidgetTool('get_course_details', { courseCode });
      setCourseDetails(res);
    } catch (err) {
      triggerToast(err.message, "error");
      setCourseDetails(null);
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchAcademicCalendar = async (query = 'midterm') => {
    try {
      const res = await executeWidgetTool('search_academic_calendar', { query });
      if (Array.isArray(res)) {
        setAcadCalendar(res);
      } else {
        setAcadCalendar([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Chat Assistant Message Dispatch
  const handleSendMessage = async (e, forcedText = '') => {
    if (e) e.preventDefault();
    const textToSend = forcedText || inputMessage;
    if (!textToSend.trim()) return;

    if (!apiKey) {
      triggerToast("API Key is missing! Set it in settings first.", "error");
      setShowSettings(true);
      return;
    }

    const newHistory = [...messages];
    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);
    setActiveToolCalls([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory,
          modelName: modelName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Chat error occurred.');
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          toolCalls: data.toolCalls || []
        }
      ]);
      
      // Refresh status if tools were run
      if (data.toolCalls && data.toolCalls.length > 0) {
        fetchMcpStatus();
        fetchLibraryBooks(libQuery);
        fetchCafeteriaCrowd();
      }
    } catch (err) {
      triggerToast(err.message, "error");
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Sorry, I hit an error: ${err.message}. Please check your API key configuration.`, isError: true }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const saveSettings = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      localStorage.setItem('gemini_model_name', modelName);
      triggerToast("Gemini API Key saved successfully.");
      setShowSettings(false);
      fetchMcpStatus();
    } else {
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('gemini_model_name');
      triggerToast("API Key removed.", "error");
    }
  };

  const insertSuggestion = (text) => {
    handleSendMessage(null, text);
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Toast Alert */}
      {toast && (
        <div className={styles.toast} style={{ borderLeftColor: toast.type === 'error' ? 'var(--accent-pink)' : 'var(--accent-cyan)' }}>
          <SparklesIcon />
          <span>{toast.message}</span>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>C</div>
          <div className={styles.titleContainer}>
            <h1 id="main-title">Campus Intelligence Portal</h1>
            <p className={styles.subtitle}>Real-time Model Context Protocol (MCP) Dashboard</p>
          </div>
        </div>
        
        <div className={styles.headerMeta}>
          <div className={styles.statusIndicator}>
            <div className={`${styles.statusDot} ${!mcpStatus.connected ? styles.disconnected : ''}`} />
            <span>
              {mcpStatus.connected 
                ? `MCP Active: ${Object.keys(mcpStatus.servers).length} Microservices` 
                : 'MCP Disconnected'
              }
            </span>
          </div>
          
          <button 
            id="settings-btn"
            className={styles.settingsButton}
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon />
            <span>Configure AI</span>
          </button>
        </div>
      </header>

      {/* --- MAIN GRID --- */}
      <div className={styles.mainGrid}>
        
        {/* Left Side: Dynamic Widgets */}
        <section className={styles.widgetsColumn} aria-label="Campus Data Source Widgets">
          
          {/* Widget 1: Campus Library Catalog */}
          <article className={`${styles.widgetCard} glass-panel`} id="library-widget">
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>
                <BookIcon />
                <span>Campus Library DB</span>
              </div>
              <span className={styles.widgetBadge}>MCP: Library Server</span>
            </div>
            
            <div className={styles.widgetContent}>
              {/* Search Books */}
              <div className={styles.inputGroup}>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Search books (e.g. algorithms, physics)..." 
                  value={libQuery}
                  onChange={(e) => setLibQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchLibraryBooks(libQuery)}
                  id="library-search-input"
                />
                <button className={styles.button} onClick={() => fetchLibraryBooks(libQuery)}>
                  <SearchIcon />
                </button>
              </div>

              {/* Book Results */}
              <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '0.5rem' }}>
                {libLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>Querying Library Server...</p>
                ) : libResults.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {libResults.map(book => (
                      <div key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{book.title}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {book.id} | {book.author}</p>
                        </div>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.15rem 0.4rem', 
                          borderRadius: '4px',
                          background: book.available === 'Yes' ? 'rgba(0, 245, 212, 0.15)' : 'rgba(241, 91, 181, 0.15)',
                          color: book.available === 'Yes' ? 'var(--accent-cyan)' : 'var(--accent-pink)',
                          border: `1px solid ${book.available === 'Yes' ? 'rgba(0, 245, 212, 0.3)' : 'rgba(241, 91, 181, 0.3)'}`
                        }}>
                          {book.available === 'Yes' ? 'Available' : 'Borrowed'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>No search results loaded.</p>
                )}
              </div>

              {/* Fast Checkout Form */}
              <form onSubmit={handleCheckoutBook} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>Quick Student Checkout Slip</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Book ID (e.g. cs-101)" 
                    className={styles.input} 
                    value={checkoutBookId}
                    onChange={(e) => setCheckoutBookId(e.target.value)}
                    id="checkout-book-id"
                  />
                  <input 
                    type="text" 
                    placeholder="Student ID" 
                    className={styles.input} 
                    value={checkoutStudentId}
                    onChange={(e) => setCheckoutStudentId(e.target.value)}
                    id="checkout-student-id"
                  />
                </div>
                <button type="submit" className={styles.button} style={{ width: '100%', marginTop: '0.25rem' }}>
                  Issue Checkout Request
                </button>
              </form>
            </div>
          </article>

          {/* Widget 2: Cafeteria Food Menu */}
          <article className={`${styles.widgetCard} glass-panel`} id="cafeteria-widget">
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>
                <CoffeeIcon />
                <span>Cafeteria Live</span>
              </div>
              <span className={styles.widgetBadge}>MCP: Cafeteria Server</span>
            </div>

            <div className={styles.widgetContent}>
              {/* Live Crowd Level */}
              {cafCrowd && (
                <div className={styles.crowdContainer}>
                  <div className={styles.crowdMetric}>
                    <span className={styles.crowdLabel}>ESTIMATED CROWD LEVEL</span>
                    <span className={`${styles.crowdVal} ${
                      cafCrowd.crowdLevel === 'High' ? styles.high : 
                      cafCrowd.crowdLevel === 'Moderate' ? styles.moderate : styles.low
                    }`}>
                      {cafCrowd.crowdLevel} ({cafCrowd.estimatedWaitTime} wait)
                    </span>
                  </div>
                  <button className={styles.buttonSecondary} onClick={fetchCafeteriaCrowd} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    Refresh Wait
                  </button>
                </div>
              )}

              {/* Day / Session Selector */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  className={styles.input} 
                  value={cafDay} 
                  onChange={(e) => setCafDay(e.target.value)}
                  id="cafeteria-day-select"
                >
                  <option value="">Today</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                </select>
                
                <select 
                  className={styles.input} 
                  value={cafMeal} 
                  onChange={(e) => setCafMeal(e.target.value)}
                  id="cafeteria-meal-select"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>

              {/* Daily Special */}
              {cafMenu?.todaysSpecial && (
                <div style={{ background: 'rgba(0, 245, 212, 0.05)', border: '1px solid rgba(0, 245, 212, 0.2)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Chef's Choice:</span> {cafMenu.todaysSpecial}
                </div>
              )}

              {/* Menu List */}
              <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '0.5rem' }}>
                {cafLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>Reading Cafeteria Menu...</p>
                ) : cafMenu?.items ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {cafMenu.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                        <span>
                          {item.name}
                          {item.vegetarian && <span style={{ color: '#22c55e', fontSize: '0.7rem', marginLeft: '0.5rem', fontWeight: 'bold' }}>● VEG</span>}
                        </span>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>No menu loaded for selected session.</p>
                )}
              </div>
            </div>
          </article>

          {/* Widget 3: Club Events & RSVP */}
          <article className={`${styles.widgetCard} glass-panel`} id="events-widget">
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>
                <CalendarIcon />
                <span>Events & Workshops</span>
              </div>
              <span className={styles.widgetBadge}>MCP: Events Server</span>
            </div>

            <div className={styles.widgetContent}>
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {['', 'Tech', 'Cultural', 'Sports', 'Academic'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setEventCat(cat)}
                    style={{
                      background: eventCat === cat ? 'var(--accent-purple)' : 'rgba(255,255,255,0.03)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-glass)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat || 'All Categories'}
                  </button>
                ))}
              </div>

              {/* Event Listings */}
              <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '0.5rem' }}>
                {eventsLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>Querying Events Registry...</p>
                ) : eventsList.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {eventsList.map(ev => (
                      <div key={ev.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{ev.title}</span>
                          <span style={{ color: 'var(--accent-purple)', fontSize: '0.7rem', fontWeight: 'bold' }}>{ev.category}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date: {ev.date} | Room: {ev.location}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Seats Left: {ev.seatsLeft}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>No events found.</p>
                )}
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRsvpEvent} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>Quick Event RSVP Ticket</p>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input type="text" placeholder="Event ID" className={styles.input} value={rsvpEventId} onChange={(e) => setRsvpEventId(e.target.value)} id="rsvp-event-id" />
                  <input type="text" placeholder="Full Name" className={styles.input} value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} id="rsvp-student-name" />
                </div>
                <input type="text" placeholder="Enrollment/Student ID" className={styles.input} value={rsvpStudentId} onChange={(e) => setRsvpStudentId(e.target.value)} id="rsvp-student-id" />
                <button type="submit" className={styles.button} style={{ width: '100%', marginTop: '0.25rem' }}>
                  Book My Seats
                </button>
              </form>
            </div>
          </article>

          {/* Widget 4: Academics & Calendar */}
          <article className={`${styles.widgetCard} glass-panel`} id="academics-widget">
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>
                <GraduationCapIcon />
                <span>Academics & Exams</span>
              </div>
              <span className={styles.widgetBadge}>MCP: Academics Server</span>
            </div>

            <div className={styles.widgetContent}>
              {/* Course Lookup */}
              <form onSubmit={handleCourseSearch} className={styles.inputGroup}>
                <input 
                  type="text" 
                  placeholder="Enter Course Code (e.g. CS-301)..." 
                  className={styles.input} 
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  id="academics-course-input"
                />
                <button type="submit" className={styles.button}>
                  Lookup
                </button>
              </form>

              {/* Course Details Result */}
              {courseDetails ? (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.85rem' }}>
                  <p style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{courseDetails.code}: {courseDetails.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>Instructor: {courseDetails.instructor} | Credits: {courseDetails.credits}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Room: {courseDetails.room} | Timings: {courseDetails.schedule}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.4rem', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                    Syllabus: {courseDetails.syllabus}
                  </p>
                </div>
              ) : courseLoading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Searching Course Syllabus...</p>
              ) : null}

              {/* Holiday and Academic Highlights */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--accent-purple)' }}>Academic Highlights & recess</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {acadCalendar.map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.15)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>{item.event}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.type}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Dates: {item.dateRange}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>{item.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Right Side: Chat Assistant Panel */}
        <section className={chatStyles.chatPanel} aria-label="AI Assistant Panel">
          <div className={chatStyles.chatHeader}>
            <SparklesIcon />
            <div className={chatStyles.chatTitle}>
              <span>Campus AI Assistant</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Gemini LLM Router</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className={chatStyles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} className={`${chatStyles.messageWrapper} ${msg.role === 'user' ? chatStyles.user : chatStyles.assistant}`}>
                <span className={chatStyles.messageSender}>
                  {msg.role === 'user' ? 'Student' : 'Campus Assistant'}
                </span>
                
                {/* Display Tool call details if assistant used tools */}
                {msg.toolCalls && msg.toolCalls.map((tc, tcIdx) => (
                  <div key={tcIdx} className={chatStyles.toolCallContainer}>
                    <div className={chatStyles.toolCallHeader}>
                      <span className={chatStyles.serverBadge}>MCP ROUTING</span>
                      <span className={`${chatStyles.toolStatus} ${chatStyles[tc.status || 'success']}`}>
                        {tc.status === 'running' ? 'EXECUTING...' : 'SUCCESS'}
                      </span>
                    </div>
                    <div>
                      <strong>Tool Call:</strong> <code>{tc.name}</code>
                    </div>
                    {tc.args && (
                      <div>
                        <strong>Arguments:</strong> <code>{JSON.stringify(tc.args)}</code>
                      </div>
                    )}
                    {tc.result && (
                      <div className={chatStyles.toolDetails}>
                        <strong>Live Data:</strong>
                        <pre style={{ marginTop: '0.2rem', padding: '0.4rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflowX: 'auto' }}>
                          {tc.result.substring(0, 400)}{tc.result.length > 400 ? '...' : ''}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}

                <div className={chatStyles.messageBubble} style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Active Tool Calls (while thinking) */}
            {activeToolCalls.length > 0 && activeToolCalls.map((tc, idx) => (
              <div key={idx} className={chatStyles.toolCallContainer} style={{ alignSelf: 'flex-start', width: '85%' }}>
                <div className={chatStyles.toolCallHeader}>
                  <span className={chatStyles.serverBadge}>MCP PROCESS</span>
                  <span className={`${chatStyles.toolStatus} ${chatStyles.running}`}>CONNECTING STDOUT...</span>
                </div>
                <div>
                  <strong>Executing Tool:</strong> <code>{tc.name}</code>
                </div>
              </div>
            ))}

            {isSending && activeToolCalls.length === 0 && (
              <div className={chatStyles.typingIndicator}>
                <div className={chatStyles.typingDot} />
                <div className={chatStyles.typingDot} />
                <div className={chatStyles.typingDot} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Inputs */}
          <div className={chatStyles.chatInputForm}>
            <form onSubmit={handleSendMessage} className={chatStyles.inputWrapper}>
              <input 
                type="text" 
                className={chatStyles.textInput} 
                placeholder={apiKey ? "Ask about books, menus, events, or exam codes..." : "Please configure your Gemini API key..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSending || !apiKey}
                id="assistant-chat-input"
              />
              <button 
                type="submit" 
                className={chatStyles.sendButton} 
                disabled={isSending || !inputMessage.trim() || !apiKey}
                id="assistant-chat-send"
              >
                <SendIcon />
              </button>
            </form>
            
            {/* Quick Suggestion Tags */}
            <div className={chatStyles.suggestions}>
              <button className={chatStyles.suggestionTag} onClick={() => insertSuggestion("Is Introduction to Algorithms available?")}>Book check</button>
              <button className={chatStyles.suggestionTag} onClick={() => insertSuggestion("What is for lunch today?")}>Today's menu</button>
              <button className={chatStyles.suggestionTag} onClick={() => insertSuggestion("How crowded is the cafeteria right now?")}>Cafeteria queue</button>
              <button className={chatStyles.suggestionTag} onClick={() => insertSuggestion("What is the exam schedule for CS-301?")}>Exam rooms</button>
              <button className={chatStyles.suggestionTag} onClick={() => insertSuggestion("Show upcoming Tech events")}>Tech Fest RSVPs</button>
            </div>
          </div>
        </section>

      </div>

      {/* --- SETTINGS DRAWER OVERLAY --- */}
      {showSettings && (
        <>
          <div className={styles.drawerOverlay} onClick={() => setShowSettings(false)} />
          <div className={styles.settingsDrawer} id="settings-drawer">
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>AI Assistant Settings</h2>
              <button className={styles.closeButton} onClick={() => setShowSettings(false)}>&times;</button>
            </div>
            
            <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="gemini-key-input">Gemini API Key</label>
                <input 
                  type="password" 
                  id="gemini-key-input"
                  className={styles.input} 
                  placeholder="Paste your AIzaSy... key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Your API key is saved locally in your browser cache. It is never stored on the server.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Model Router</label>
                <select 
                  className={styles.input} 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  id="gemini-model-select"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Stable)</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Frontier - Fast & Smart)</option>
                  <option value="gemini-3.1-pro">Gemini 3.1 Pro (Deep Reasoning)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Server Status</label>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>Library MCP:</span> 
                    <span style={{ color: mcpStatus.servers.library?.connected ? 'var(--accent-cyan)' : 'var(--accent-pink)' }}>
                      {mcpStatus.servers.library?.connected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>Cafeteria MCP:</span> 
                    <span style={{ color: mcpStatus.servers.cafeteria?.connected ? 'var(--accent-cyan)' : 'var(--accent-pink)' }}>
                      {mcpStatus.servers.cafeteria?.connected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>Events MCP:</span> 
                    <span style={{ color: mcpStatus.servers.events?.connected ? 'var(--accent-cyan)' : 'var(--accent-pink)' }}>
                      {mcpStatus.servers.events?.connected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Academics MCP:</span> 
                    <span style={{ color: mcpStatus.servers.academics?.connected ? 'var(--accent-cyan)' : 'var(--accent-pink)' }}>
                      {mcpStatus.servers.academics?.connected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.button} style={{ marginTop: '1rem' }} id="settings-save-btn">
                Save and Connect
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  );
}

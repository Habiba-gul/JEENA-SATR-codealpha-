import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  MessageSquare, 
  User as UserIcon, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Check, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Star, 
  Tag, 
  Truck, 
  Database, 
  Send, 
  Sparkles, 
  Award,
  Clock,
  ExternalLink,
  BookMarked,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { 
  Book, 
  CartItem, 
  ChatMessage, 
  ChatThread, 
  Order, 
  OrderItem,
  User, 
  UserRole,
  Review
} from './types';
import { 
  BOOKS, 
  LITERARY_QUOTES, 
  INITIAL_CHAT_THREADS, 
  INITIAL_ORDERS 
} from './data';
import BookCover from './components/BookCover';
import AdminBlueprint from './components/AdminBlueprint';
import { 
  isSupabaseConfigured, 
  fetchBooksFromSupabase, 
  insertReviewToSupabase, 
  fetchOrdersFromSupabase, 
  createOrderInSupabase, 
  updateOrderStatusInSupabase, 
  fetchChatThreadsFromSupabase, 
  upsertChatThreadInSupabase, 
  insertChatMessageToSupabase 
} from './lib/supabase.ts';

export default function App() {
  // --- APPLICATION STATE ---
  const [currentView, setCurrentView] = useState<'splash' | 'auth' | 'main' | 'messages_hub' | 'categories_page' | 'product_detail' | 'cart' | 'account'>('splash');
  
  // Database status indicator state
  const [dbStatus, setDbStatus] = useState<'offline' | 'connecting' | 'connected' | 'error'>('offline');
  
  // Mouse position state for interactive background bloom
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  // User Session
  const [user, setUser] = useState<User>({
    fullName: 'Haris Ahmed',
    email: 'haris@example.com',
    role: 'standard',
    isLoggedIn: false
  });

  // Selected book for Product Detail Page
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jeena_satr_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Default initial cart items
    return [
      { bookId: "u1", quantity: 1, selected: true },
      { bookId: "m1", quantity: 1, selected: true }
    ];
  });

  // Chat message threads
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('jeena_satr_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_CHAT_THREADS; }
    }
    return INITIAL_CHAT_THREADS;
  });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState('');

  // Active sub-tab inside Messages Hub: 'chats' | 'orders' | 'categories' | 'deals'
  const [messagesSubTab, setMessagesSubTab] = useState<'chats' | 'orders' | 'categories' | 'deals'>('chats');

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jeena_satr_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_ORDERS; }
    }
    return INITIAL_ORDERS;
  });

  // Books state (supporting added dynamic reviews)
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('jeena_satr_books');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return BOOKS; }
    }
    return BOOKS;
  });

  // Category select state for Categories page
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Authentication credentials states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>('standard');

  // Custom user feedback states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  // Sticky Dev Hub drawer state
  const [showDevHub, setShowDevHub] = useState(false);

  // Message chat auto-scroll ref
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem('jeena_satr_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jeena_satr_chats', JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem('jeena_satr_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('jeena_satr_books', JSON.stringify(books));
  }, [books]);

  // --- SUPABASE SYNCHRONIZATION ---
  useEffect(() => {
    const syncWithSupabase = async () => {
      const configured = isSupabaseConfigured();
      if (!configured) {
        setDbStatus('offline');
        return;
      }

      setDbStatus('connecting');
      try {
        // Load Books from Supabase if connected
        const fetchedBooks = await fetchBooksFromSupabase();
        if (fetchedBooks && fetchedBooks.length > 0) {
          setBooks(fetchedBooks);
        }

        // If user is logged in, sync their orders and chats from Supabase
        if (user.isLoggedIn && user.email) {
          const fetchedOrders = await fetchOrdersFromSupabase(user.email);
          if (fetchedOrders) {
            setOrders(fetchedOrders);
          }

          const fetchedThreads = await fetchChatThreadsFromSupabase(user.email);
          if (fetchedThreads && fetchedThreads.length > 0) {
            setChatThreads(fetchedThreads);
          } else {
            // Seed initial threads to Supabase if none exist
            for (const thread of INITIAL_CHAT_THREADS) {
              await upsertChatThreadInSupabase(thread, user.email);
              for (const msg of thread.messages) {
                await insertChatMessageToSupabase(thread.id, msg, thread.lastMessage);
              }
            }
          }
        }
        setDbStatus('connected');
      } catch (err) {
        console.error("Failed to sync with Supabase:", err);
        setDbStatus('error');
      }
    };

    syncWithSupabase();
  }, [user.isLoggedIn, user.email]);

  // --- AUTO-SCROLL TO BOTTOM OF CHAT ---
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThreadId, chatThreads]);

  // --- SPLASH SCREEN TRANSITION ---
  useEffect(() => {
    if (currentView === 'splash') {
      const timer = setTimeout(() => {
        // If user already logged in, go to main, else go to auth
        if (user.isLoggedIn) {
          setCurrentView('main');
        } else {
          setCurrentView('auth');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentView, user.isLoggedIn]);

  // --- AUTHENTICATION FLOWS ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword || (isRegisterMode && !authName)) {
      alert("Please fill in all required fields.");
      return;
    }

    const finalName = isRegisterMode ? authName : (authEmail.split('@')[0]);
    setUser({
      fullName: finalName.charAt(0).toUpperCase() + finalName.slice(1),
      email: authEmail,
      role: authRole,
      isLoggedIn: true
    });
    setCurrentView('main');
  };

  const handleLogout = () => {
    setUser((prev: User) => ({ ...prev, isLoggedIn: false }));
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setCurrentView('auth');
  };

  // --- CART MANAGEMENT ---
  const handleAddToCart = (bookId: string) => {
    setCart((prev: CartItem[]) => {
      const existing = prev.find((item: CartItem) => item.bookId === bookId);
      if (existing) {
        return prev.map((item: CartItem) => item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { bookId, quantity: 1, selected: true }];
    });
    alert(`"${books.find((b: Book) => b.id === bookId)?.title}" added to your literary Cart!`);
  };

  const handleRemoveFromCart = (bookId: string) => {
    setCart((prev: CartItem[]) => prev.filter((item: CartItem) => item.bookId !== bookId));
  };

  const handleUpdateQuantity = (bookId: string, delta: number) => {
    setCart((prev: CartItem[]) => prev.map((item: CartItem) => {
      if (item.bookId === bookId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    }));
  };

  const handleToggleSelectCartItem = (bookId: string) => {
    setCart((prev: CartItem[]) => prev.map((item: CartItem) => item.bookId === bookId ? { ...item, selected: !item.selected } : item));
  };

  // --- DYNAMIC CART CALCULATION ---
  const selectedCartItems = cart.filter((item: CartItem) => item.selected);
  const cartSubtotal = selectedCartItems.reduce((acc: number, item: CartItem) => {
    const book = books.find((b: Book) => b.id === item.bookId);
    if (!book) return acc;
    const price = book.isPromo && book.discountPrice ? book.discountPrice : book.price;
    return acc + (price * item.quantity);
  }, 0);
  
  const shippingCharge = selectedCartItems.length > 0 ? 150 : 0;
  const cartTotal = cartSubtotal + shippingCharge;

  // --- CHECKOUT PROCESS ---
  const handleCheckout = async () => {
    if (selectedCartItems.length === 0) {
      alert("Please select at least one book to purchase.");
      return;
    }

    const orderItems = selectedCartItems.map((item: CartItem) => {
      const book = books.find((b: Book) => b.id === item.bookId)!;
      return {
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.isPromo && book.discountPrice ? book.discountPrice : book.price,
        quantity: item.quantity
      };
    });

    const newOrder: Order = {
      id: `JS-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'ordered',
      items: orderItems,
      subtotal: cartSubtotal,
      shipping: shippingCharge,
      total: cartTotal
    };

    // If Supabase is configured, sync order online
    if (isSupabaseConfigured()) {
      await createOrderInSupabase(newOrder, user.email);
      
      const sysMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'system',
        text: `Success! Order ${newOrder.id} has been registered in the system. Check the tracking timeline under your Orders section.`,
        timestamp: 'Just now'
      };
      await insertChatMessageToSupabase('t2', sysMsg, `Success! Order ${newOrder.id} has been registered in the system.`);
    }

    setOrders((prev: Order[]) => [newOrder, ...prev]);
    // Clear purchased items from active cart
    setCart((prev: CartItem[]) => prev.filter((item: CartItem) => !item.selected));
    
    // Auto add a greeting system message in Chats
    setChatThreads((prev: ChatThread[]) => prev.map((t: ChatThread) => {
      if (t.id === 't2') {
        return {
          ...t,
          unreadCount: t.unreadCount + 1,
          lastMessage: `Success! Order ${newOrder.id} has been registered in the system.`,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'system',
              text: `Success! Order ${newOrder.id} has been registered in the system. Check the tracking timeline under your Orders section.`,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return t;
    }));

    alert(`Order registered successfully! Order ID: ${newOrder.id}. Go to Messages > Orders tab to track its status.`);
    setMessagesSubTab('orders');
    setCurrentView('messages_hub');
  };

  // --- SUBMIT BOOK REVIEW ---
  const handleAddReview = async (e: React.FormEvent, bookId: string) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      user: user.fullName || "Grateful Reader",
      rating: reviewRating,
      text: reviewText,
      date: new Date().toISOString().split('T')[0]
    };

    // If Supabase is configured, sync review online
    if (isSupabaseConfigured()) {
      await insertReviewToSupabase(bookId, newReview);
    }

    setBooks((prev: Book[]) => prev.map((book: Book) => {
      if (book.id === bookId) {
        const updatedReviews = [newReview, ...book.reviews];
        // calculate new average rating
        const avg = parseFloat(((updatedReviews.reduce((sum: number, r: Review) => sum + r.rating, 0)) / updatedReviews.length).toFixed(1));
        return {
          ...book,
          reviews: updatedReviews,
          rating: avg
        };
      }
      return book;
    }));

    // Update selected book view to reflect the added review instantly
    setSelectedBook((prev: Book | null) => {
      if (!prev) return null;
      const updatedReviews = [newReview, ...prev.reviews];
      const avg = parseFloat(((updatedReviews.reduce((sum: number, r: Review) => sum + r.rating, 0)) / updatedReviews.length).toFixed(1));
      return {
        ...prev,
        reviews: updatedReviews,
        rating: avg
      };
    });

    setReviewText('');
    setReviewMessage('Thank you for sharing your literary thoughts!');
    setTimeout(() => setReviewMessage(''), 3000);
  };

  // --- SEND CHAT MESSAGE ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeThreadId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (isSupabaseConfigured()) {
      await insertChatMessageToSupabase(activeThreadId, newMsg, typedMessage);
    }

    setChatThreads((prev: ChatThread[]) => prev.map((t: ChatThread) => {
      if (t.id === activeThreadId) {
        const updatedMsgs = [...t.messages, newMsg];
        return {
          ...t,
          lastMessage: typedMessage,
          messages: updatedMsgs
        };
      }
      return t;
    }));

    const userQuery = typedMessage;
    setTypedMessage('');

    // Simulated automated peer reply to sustain the bookstore experience
    setTimeout(async () => {
      let responseText = "That sounds fascinating! Let me verify our catalog archives for you.";
      if (userQuery.toLowerCase().includes('peer') || userQuery.toLowerCase().includes('kamil')) {
        responseText = "Peer-e-Kamil is actually our best seller this week. It highlights Sufism and spiritual journeys beautifully. Would you like me to reserve a hardback?";
      } else if (userQuery.toLowerCase().includes('shipping') || userQuery.toLowerCase().includes('order')) {
        responseText = "Our shipments typically arrive in 2-3 business days. You can view real-time state timelines in the 'Orders' tab of this Hub!";
      } else if (userQuery.toLowerCase().includes('discount') || userQuery.toLowerCase().includes('deal')) {
        responseText = "Check the 'Deals' panel right here! We currently have English classic novels and science-fiction bestsellers up to 30% off.";
      }

      const autoReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'peer',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (isSupabaseConfigured()) {
        await insertChatMessageToSupabase(activeThreadId, autoReply, responseText);
      }

      setChatThreads((prev: ChatThread[]) => prev.map((t: ChatThread) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: responseText,
            messages: [...t.messages, autoReply]
          };
        }
        return t;
      }));
    }, 1500);
  };

  // --- ADMIN FUNCTION: TOGGLE ORDER STATE FOR TESTING ---
  const handleAdminToggleOrderStatus = async (orderId: string) => {
    let nextStatus: 'ordered' | 'shipping' | 'delivered' = 'ordered';

    setOrders((prev: Order[]) => prev.map((ord: Order) => {
      if (ord.id === orderId) {
        if (ord.status === 'ordered') nextStatus = 'shipping';
        else if (ord.status === 'shipping') nextStatus = 'delivered';
        else nextStatus = 'ordered';
        
        return { ...ord, status: nextStatus };
      }
      return ord;
    }));

    if (isSupabaseConfigured()) {
      await updateOrderStatusInSupabase(orderId, nextStatus);
    }
  };

  // --- BOOK SEARCH FILTERING ---
  const filteredBooks = books.filter((book: Book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query)
    );
  });

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
      className="min-h-screen bg-[#F7F3EC] text-[#222222] font-sans relative flex flex-col justify-between overflow-x-hidden select-none"
    >
      
      {/* 1. Global background decorative layout components */}
      <div className="absolute inset-0 bg-interactive-dots pointer-events-none z-0" />
      
      {/* Elegant soft peach/pink background floating orbs */}
      <div className="absolute top-1/4 left-10 w-44 h-44 rounded-full bg-[#ffccd5]/15 filter blur-3xl pointer-events-none z-0 animate-float-1" />
      <div className="absolute top-2/3 right-10 w-60 h-60 rounded-full bg-[#ffccd5]/10 filter blur-3xl pointer-events-none z-0 animate-float-2" />
      <div className="absolute bottom-10 left-1/3 w-52 h-52 rounded-full bg-[#ffccd5]/10 filter blur-3xl pointer-events-none z-0 animate-float-3" />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-lg mx-auto bg-[#F7F3EC] shadow-2xl border-x border-[#E7DDD7] min-h-screen pb-24">
        
        {/* --- GLOBAL APPLET HEADER --- */}
        {currentView !== 'splash' && currentView !== 'auth' && (
          <header className="sticky top-0 bg-[#F7F3EC]/95 backdrop-blur-md border-b border-[#E7DDD7] px-4 py-3 z-30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentView('main')}>
              <div className="w-7 h-7 bg-[#2B2B2B] text-[#F7F3EC] rounded flex items-center justify-center font-serif font-bold text-sm relative overflow-hidden">
                <img 
                  src="/images/logo.jpg" 
                  alt="Jeena Satr Logo" 
                  className="w-full h-full object-cover z-10" 
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="absolute z-0">JS</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-base tracking-wide leading-none text-[#222222]">Jeena Satr</h1>
                <p className="text-[9px] text-[#7A3E48] font-mono tracking-widest leading-none mt-0.5">BOOKSTORE</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role badge with Database connection state */}
              <span className="font-mono text-[9px] px-2 py-0.5 border border-[#E7DDD7] text-[#7A3E48] rounded-full uppercase bg-white/60 font-semibold shadow-sm flex items-center gap-1.5">
                <div 
                  className={`w-1.5 h-1.5 rounded-full ${
                    dbStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]' : 
                    dbStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 
                    dbStatus === 'error' ? 'bg-red-500' : 'bg-stone-400'
                  }`}
                  title={
                    dbStatus === 'connected' ? 'Supabase Online DB Connected' : 
                    dbStatus === 'connecting' ? 'Connecting to Supabase...' : 
                    dbStatus === 'error' ? 'Supabase Connection Error' : 'Offline / LocalStorage Fallback Mode'
                  }
                />
                {user.role === 'admin' ? 'Curator (Admin)' : 'Reader'}
              </span>

              {/* Dev Hub toggle */}
              <button 
                onClick={() => setShowDevHub(!showDevHub)}
                className="p-1.5 hover:bg-[#2B2B2B]/5 border border-[#E7DDD7] rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                title="Open Django Models & Blueprint Developer Viewer"
              >
                <Database className="w-4 h-4 text-[#7A3E48]" />
                <span className="hidden sm:inline text-[10px] font-mono font-medium text-[#222222]">Dev Hub</span>
              </button>
            </div>
          </header>
        )}

        {/* --- SCREEN WORKSPACES --- */}

        {/* 1. SPLASH SCREEN */}
        {currentView === 'splash' && (
          <div id="splash-screen" className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
            {/* Minimal Concentric Circles & Book Icon */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <div className="absolute inset-0 border border-[#7A3E48]/10 rounded-full animate-pulse" />
              <div className="absolute inset-4 border border-[#7A3E48]/25 rounded-full" />
              <div className="absolute inset-8 border border-[#7A3E48]/40 rounded-full flex items-center justify-center" />
              <BookOpen className="w-12 h-12 text-[#7A3E48] z-10" />
            </div>

            <h1 className="font-serif font-bold text-4xl text-[#222222] tracking-wide mb-2">Jeena Satr</h1>
            <div className="w-12 h-[1px] bg-[#7A3E48] my-2" />
            <p className="font-serif italic text-sm text-[#666666] tracking-wide">
              "Satr ba satr jeena..."
            </p>
            <p className="font-mono text-[10px] uppercase text-[#7A3E48] font-bold tracking-widest mt-6">
              CURATED LITERATURE PORTAL
            </p>

            {/* Spinner indicator */}
            <div className="mt-12 flex items-center gap-1 text-[11px] font-mono text-[#666666]">
              <Clock className="w-3.5 h-3.5 animate-spin text-[#7A3E48]" />
              <span>Cataloguing thoughts...</span>
            </div>
          </div>
        )}

        {/* 2. AUTHENTICATION PAGE */}
        {currentView === 'auth' && (
          <div id="auth-page" className="flex-1 flex flex-col justify-center px-4 py-8 animate-fade-in">
            {/* Elegant Soft Dusty Rose Card */}
            <div className="bg-[#D9B3B8] border border-[#E7DDD7] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              
              {/* Subtle design highlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A3E48]/5 rounded-full filter blur-xl pointer-events-none" />
              
              <div className="text-center mb-6 relative z-10">
                <div className="w-14 h-14 bg-[#2B2B2B] text-[#F7F3EC] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md border border-[#7A3E48]/20">
                  <BookOpen className="w-7 h-7 text-[#D9B3B8]" />
                </div>
                <h2 className="font-serif font-bold text-2xl text-[#222222] tracking-tight">Access Jeena Satr</h2>
                <p className="text-xs text-[#222222]/80 mt-1.5 font-sans">
                  Enter your literary credentials to log in or join our readers guild.
                </p>
              </div>

              {/* Tabbed Picker - More Prominent Active Tab */}
              <div className="flex border-2 border-[#2B2B2B] rounded-2xl overflow-hidden mb-6 bg-[#F7F3EC] p-1 gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-serif font-bold tracking-wide transition-all ${
                    !isRegisterMode 
                      ? 'bg-[#2B2B2B] text-[#F7F3EC] shadow-md transform scale-[1.02]' 
                      : 'hover:bg-[#2B2B2B]/5 text-[#222222] hover:text-[#7A3E48]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-serif font-bold tracking-wide transition-all ${
                    isRegisterMode 
                      ? 'bg-[#2B2B2B] text-[#F7F3EC] shadow-md transform scale-[1.02]' 
                      : 'hover:bg-[#2B2B2B]/5 text-[#222222] hover:text-[#7A3E48]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Role dial selection */}
              <div className="mb-6 p-4 rounded-2xl border border-[#2B2B2B]/15 bg-white/40 backdrop-blur-xs">
                <span className="font-mono text-[10px] uppercase text-[#7A3E48] block mb-2 font-bold tracking-wider">
                  Select Your Access Role
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthRole('standard')}
                    className={`flex-1 py-2.5 border-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      authRole === 'standard'
                        ? 'border-[#2B2B2B] bg-[#2B2B2B] text-[#F7F3EC]'
                        : 'border-[#E7DDD7] bg-[#FFFFFF] hover:border-[#7A3E48]/40 text-[#222222]'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Standard Reader
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthRole('admin')}
                    className={`flex-1 py-2.5 border-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      authRole === 'admin'
                        ? 'border-[#2B2B2B] bg-[#2B2B2B] text-[#F7F3EC]'
                        : 'border-[#E7DDD7] bg-[#FFFFFF] hover:border-[#7A3E48]/40 text-[#222222]'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Platform Curator
                  </button>
                </div>
                <p className="text-[10px] text-[#222222]/80 mt-2.5 font-sans leading-relaxed border-t border-[#2B2B2B]/10 pt-2">
                  {authRole === 'admin' 
                    ? "✓ Curator mode allows simulated database table inspection and logistical order shipping updates."
                    : "✓ Standard Reader mode provides catalog browse, chat assistant, and custom review submittals."}
                </p>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
                {isRegisterMode && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#7A3E48] font-bold mb-1 tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthName(e.target.value)}
                      placeholder="e.g. Nimra Jamil"
                      className="w-full px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#E7DDD7] rounded-xl text-sm focus:outline-none focus:border-[#7A3E48] text-[#222222] transition-colors shadow-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase text-[#7A3E48] font-bold mb-1 tracking-wide">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthEmail(e.target.value)}
                    placeholder="name@literary.com"
                    className="w-full px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#E7DDD7] rounded-xl text-sm focus:outline-none focus:border-[#7A3E48] text-[#222222] transition-colors shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#7A3E48] font-bold mb-1 tracking-wide">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={authPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#E7DDD7] rounded-xl text-sm focus:outline-none focus:border-[#7A3E48] pr-10 text-[#222222] transition-colors shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#222222]/50 hover:text-[#7A3E48] p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-5 bg-[#2B2B2B] text-[#F7F3EC] hover:bg-[#1A1A1A] active:bg-black focus:ring-2 focus:ring-[#7A3E48]/50 transition-all rounded-xl text-xs font-serif font-semibold tracking-wider uppercase cursor-pointer shadow-md"
                >
                  {isRegisterMode ? 'Complete Registration' : 'Secure Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-[#2B2B2B]/10 pt-4">
                <span className="text-[11px] font-serif text-[#222222]/85 italic block leading-relaxed">
                  "Books are the quietest and most constant of friends."
                </span>
                <button 
                  onClick={() => {
                    setUser({ fullName: 'Anonymous Reader', email: 'guest@jeenasatr.com', role: 'standard', isLoggedIn: true });
                    setCurrentView('main');
                  }}
                  className="mt-2.5 text-xs font-mono text-[#7A3E48] font-bold underline hover:text-[#2B2B2B] transition-colors"
                >
                  Skip as Guest Reader
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. MAIN HOME PAGE */}
        {currentView === 'main' && (
          <div id="home-page" className="flex-1 flex flex-col p-4 space-y-6">
            
            {/* Top search & Welcome header */}
            <div className="space-y-4">
              <div className="text-left">
                <p className="font-serif italic text-xs text-[#2B2B2B]/60">Assalam-o-Alaikum,</p>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-[#2B2B2B] mt-0.5">
                  Welcome to Jeena Satr
                </h2>
                <p className="text-xs text-[#2B2B2B]/60">
                  Explore our carefully catalogued literary editions.
                </p>
              </div>

              {/* Search input bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  placeholder="Search novels, authors, category..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-[#2B2B2B]/15 rounded-xl text-xs focus:outline-none focus:border-[#2B2B2B] focus:bg-white text-[#2B2B2B] transition-all placeholder-[#2B2B2B]/40"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B2B2B]/40" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-[#2B2B2B]/10 hover:bg-[#2B2B2B]/20 px-1.5 py-0.5 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* scrolling ticker of literary quotes */}
            <div className="relative overflow-hidden bg-[#2B2B2B] text-white py-2 rounded-lg border-y border-[#2B2B2B]/20">
              <div className="animate-ticker">
                {/* Double output for continuous loop effect */}
                {[...LITERARY_QUOTES, ...LITERARY_QUOTES].map((quote, idx) => (
                  <span key={idx} className="font-serif italic text-xs mx-12 whitespace-nowrap text-[#F7F3EC] tracking-wide">
                    {quote}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Categories Filter Badges */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
              {['All Books', 'Urdu Novels', 'English Novels', 'Science Fiction', 'Motivational', 'Funny Comics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (cat === 'All Books') {
                      setSelectedCategoryFilter(null);
                    } else {
                      setSelectedCategoryFilter(cat);
                    }
                    setCurrentView('categories_page');
                  }}
                  className="px-3 py-1.5 bg-white/60 border border-[#2B2B2B]/10 rounded-full text-[10.5px] font-sans font-medium whitespace-nowrap hover:border-[#2B2B2B] hover:bg-white transition-all cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog list section */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-serif text-lg font-bold tracking-tight text-[#2B2B2B]">
                  {searchQuery ? `Search Results (${filteredBooks.length})` : 'Curated Master Selection'}
                </h3>
                {!searchQuery && (
                  <button 
                    onClick={() => {
                      setSelectedCategoryFilter(null);
                      setCurrentView('categories_page');
                    }}
                    className="font-mono text-[10px] uppercase text-[#2B2B2B] font-semibold tracking-wider flex items-center hover:underline"
                  >
                    View All Categories <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {filteredBooks.length === 0 ? (
                <div className="bg-white/40 border border-dashed border-[#2B2B2B]/15 rounded-xl p-8 text-center">
                  <p className="text-sm font-serif italic text-[#2B2B2B]/60">
                    "No matches found in our catalog archive."
                  </p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs font-mono text-[#2B2B2B] underline hover:no-underline"
                  >
                    Reset Search Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  {filteredBooks.filter((b: Book) => searchQuery ? true : b.featured).map((book: Book) => {
                    const hasDiscount = book.isPromo && book.discountPrice;
                    return (
                      <div 
                        key={book.id}
                        onClick={() => {
                          setSelectedBook(book);
                          setSelectedCoverIndex(0);
                          setCurrentView('product_detail');
                        }}
                        className="group flex flex-col justify-between p-3 bg-white/40 border border-[#2B2B2B]/5 rounded-xl hover:bg-white/80 transition-all duration-300 hover:shadow-md cursor-pointer"
                      >
                        {/* Book cover container */}
                        <div className="flex justify-center py-4 bg-stone-100/50 rounded-lg mb-3 relative overflow-hidden">
                          <BookCover 
                            title={book.title} 
                            author={book.author} 
                            coverColor={book.coverColor} 
                            coverPattern={book.coverPattern}
                            category={book.category}
                            size="md"
                            coverImages={book.coverImages}
                          />
                          {book.isPromo && (
                            <span className="absolute top-2 left-2 bg-[#2B2B2B] text-[#F7F3EC] text-[8px] font-mono uppercase px-1.5 py-0.5 rounded tracking-wider flex items-center gap-0.5">
                              <Tag className="w-2 h-2" />
                              DEAL
                            </span>
                          )}
                        </div>

                        {/* Text info */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#2B2B2B]/50">
                            {book.category}
                          </span>
                          <h4 className="font-serif font-bold text-xs text-[#2B2B2B] line-clamp-1 group-hover:underline">
                            {book.title}
                          </h4>
                          <p className="font-serif italic text-[10.5px] text-[#2B2B2B]/60 line-clamp-1">
                            {book.author}
                          </p>
                        </div>

                        {/* Price & Rating layout */}
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#2B2B2B]/5">
                          <div className="flex flex-col">
                            {hasDiscount ? (
                              <>
                                <span className="font-mono text-[10px] text-[#2B2B2B]/40 line-through">
                                  Rs. {book.price}
                                </span>
                                <span className="font-mono text-xs font-bold text-[#2B2B2B]">
                                  Rs. {book.discountPrice}
                                </span>
                              </>
                            ) : (
                              <span className="font-mono text-xs font-bold text-[#2B2B2B]">
                                Rs. {book.price}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] flex items-center gap-0.5 bg-white/80 px-1.5 py-0.5 rounded border border-[#2B2B2B]/5">
                            ★ {book.rating}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Literary Banner */}
            <div className="bg-[#2B2B2B]/5 border border-[#2B2B2B]/10 rounded-xl p-4 flex gap-4 items-center">
              <div className="bg-[#2B2B2B] text-[#F7F3EC] p-2.5 rounded-lg">
                <BookMarked className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-xs">Custom Bookmark Gift Included</h4>
                <p className="text-[10px] text-[#2B2B2B]/60 mt-0.5">
                  Get a hand-painted wooden bookmark with elegant Urdu calligraphy on every purchase.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* 4. MESSAGES HUB */}
        {currentView === 'messages_hub' && (
          <div id="messages-hub" className="flex-1 flex flex-col p-4 space-y-4">
            
            {/* Messages Hub Navigation Grid Panels */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              <button
                onClick={() => setMessagesSubTab('chats')}
                className={`py-2 px-1 border rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  messagesSubTab === 'chats'
                    ? 'border-[#2B2B2B] bg-[#2B2B2B] text-[#F7F3EC]'
                    : 'border-[#2B2B2B]/10 bg-white/40 text-[#2B2B2B] hover:border-[#2B2B2B]/30'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-[9px] font-mono tracking-wider uppercase font-semibold">Chats</span>
              </button>

              <button
                onClick={() => setMessagesSubTab('orders')}
                className={`py-2 px-1 border rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  messagesSubTab === 'orders'
                    ? 'border-[#2B2B2B] bg-[#2B2B2B] text-[#F7F3EC]'
                    : 'border-[#2B2B2B]/10 bg-white/40 text-[#2B2B2B] hover:border-[#2B2B2B]/30'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-[9px] font-mono tracking-wider uppercase font-semibold">Orders</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategoryFilter(null);
                  setCurrentView('categories_page');
                }}
                className="py-2 px-1 border border-[#2B2B2B]/10 bg-white/40 rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#2B2B2B]/30 transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#2B2B2B]" />
                <span className="text-[9px] font-mono tracking-wider uppercase font-semibold text-[#2B2B2B]">Categories</span>
              </button>

              <button
                onClick={() => setMessagesSubTab('deals')}
                className={`py-2 px-1 border rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  messagesSubTab === 'deals'
                    ? 'border-[#2B2B2B] bg-[#2B2B2B] text-[#F7F3EC]'
                    : 'border-[#2B2B2B]/10 bg-white/40 text-[#2B2B2B] hover:border-[#2B2B2B]/30'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span className="text-[9px] font-mono tracking-wider uppercase font-semibold">Deals</span>
              </button>
            </div>

            {/* --- WORKSPACE SUB-PANELS --- */}

            {/* PANEL A: CHATS */}
            {messagesSubTab === 'chats' && (
              <div className="flex-1 flex flex-col min-h-[400px]">
                {!activeThreadId ? (
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#2B2B2B] mb-1">
                      Your P2P Literary Concierges ({chatThreads.length})
                    </h4>
                    
                    {chatThreads.map((thread: ChatThread) => (
                      <div
                        key={thread.id}
                        onClick={() => {
                          setActiveThreadId(thread.id);
                          // Reset unread count
                          setChatThreads((prev: ChatThread[]) => prev.map((t: ChatThread) => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
                        }}
                        className="p-3.5 bg-white/50 border border-[#2B2B2B]/10 rounded-xl hover:bg-white hover:border-[#2B2B2B]/30 transition-all cursor-pointer flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#2B2B2B] text-[#F7F3EC] flex items-center justify-center font-serif text-sm font-semibold mt-0.5">
                          {thread.contactName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h5 className="font-serif font-semibold text-xs text-[#2B2B2B]">
                              {thread.contactName}
                            </h5>
                            <span className="font-mono text-[8px] text-[#2B2B2B]/50">
                              {thread.contactRole}
                            </span>
                          </div>
                          <p className="text-xs text-[#2B2B2B]/70 truncate mt-1">
                            {thread.lastMessage}
                          </p>
                        </div>
                        {thread.unreadCount > 0 && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#2B2B2B] animate-ping self-center" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Active Chat Thread Viewport
                  <div className="flex-1 flex flex-col bg-white/50 border border-[#2B2B2B]/15 rounded-xl overflow-hidden min-h-[380px]">
                    {/* Active Chat Header */}
                    <div className="bg-[#2B2B2B] text-[#F7F3EC] p-3 flex items-center justify-between">
                      <button 
                        onClick={() => setActiveThreadId(null)}
                        className="p-1 hover:bg-white/10 rounded-lg text-[#F7F3EC]"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div className="text-center">
                        <h4 className="font-serif font-bold text-xs">
                          {chatThreads.find((t: ChatThread) => t.id === activeThreadId)?.contactName}
                        </h4>
                        <p className="text-[8px] font-mono tracking-widest text-[#F7F3EC]/60 uppercase">
                          {chatThreads.find((t: ChatThread) => t.id === activeThreadId)?.contactRole}
                        </p>
                      </div>
                      <div className="w-6" /> {/* spacer */}
                    </div>

                    {/* Chat Bubble Scrollable Frame */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[300px]">
                      {chatThreads.find((t: ChatThread) => t.id === activeThreadId)?.messages.map((msg: ChatMessage) => {
                        const isUser = msg.sender === 'user';
                        const isSystem = msg.sender === 'system';
                        return (
                          <div 
                            key={msg.id}
                            className={`flex flex-col ${isUser ? 'items-end' : isSystem ? 'items-center' : 'items-start'}`}
                          >
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                              isUser 
                                ? 'bg-[#2B2B2B] text-[#F7F3EC] rounded-tr-none' 
                                : isSystem
                                ? 'bg-amber-100 text-[#2B2B2B] border border-amber-300 text-center font-serif italic'
                                : 'bg-white text-[#2B2B2B] border border-[#2B2B2B]/15 rounded-tl-none'
                            }`}>
                              <p>{msg.text}</p>
                            </div>
                            <span className="font-mono text-[8px] text-[#2B2B2B]/40 mt-1 px-1">
                              {msg.timestamp}
                            </span>
                          </div>
                        );
                      })}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Quick suggestion tags */}
                    <div className="px-3 py-1.5 border-t border-[#2B2B2B]/10 flex gap-1 overflow-x-auto bg-[#C49A9A]/40">
                      {[
                        "Any discounts on Peer-e-Kamil?",
                        "Is free bookmark included?",
                        "How to track my order shipment?"
                      ].map((promptText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTypedMessage(promptText)}
                          className="px-2.5 py-1 bg-white border border-[#2B2B2B]/10 rounded-full text-[9px] whitespace-nowrap hover:border-[#2B2B2B] transition-all"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>

                    {/* Chat Typing Input */}
                    <form onSubmit={handleSendMessage} className="p-2 border-t border-[#2B2B2B]/10 bg-white flex gap-2">
                      <input
                        type="text"
                        value={typedMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTypedMessage(e.target.value)}
                        placeholder="Type literary reply..."
                        className="flex-1 px-3 py-1.5 bg-stone-100 border border-[#2B2B2B]/10 rounded-lg text-xs focus:outline-none focus:border-[#2B2B2B]"
                      />
                      <button 
                        type="submit"
                        className="p-2 bg-[#2B2B2B] text-[#F7F3EC] hover:bg-[#1A1A1A] transition-colors rounded-lg flex items-center justify-center cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* PANEL B: ORDERS (Timeline Tracker: Ordered -> Shipping -> Delivered) */}
            {messagesSubTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">
                    Your Purchase History & Logistics Tracking
                  </h4>
                  {user.role === 'admin' && (
                    <span className="font-mono text-[8.5px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase">
                      Admin Controller Active
                    </span>
                  )}
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white/40 border border-dashed border-[#2B2B2B]/15 rounded-xl p-8 text-center">
                    <p className="text-sm font-serif italic text-[#2B2B2B]/60">
                      "No historical records or active order timelines exist yet."
                    </p>
                    <button 
                      onClick={() => setCurrentView('main')}
                      className="mt-3 text-xs font-mono text-[#2B2B2B] underline hover:no-underline"
                    >
                      Shop Books & Checkout
                    </button>
                  </div>
                ) : (
                  orders.map((order: Order) => (
                    <div key={order.id} className="p-4 bg-white/50 border border-[#2B2B2B]/10 rounded-xl space-y-4">
                      
                      {/* Order Title Info */}
                      <div className="flex justify-between items-start border-b border-[#2B2B2B]/10 pb-2">
                        <div>
                          <span className="font-mono text-xs font-bold">{order.id}</span>
                          <span className="text-[10px] text-[#2B2B2B]/50 block mt-0.5">Ordered: {order.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-[#2B2B2B]">Rs. {order.total}</span>
                          <span className="text-[9px] text-[#2B2B2B]/60 block mt-0.5">Includes Rs. 150 shipping</span>
                        </div>
                      </div>

                      {/* Purchased Item Sublist */}
                      <div className="space-y-1.5 pl-2 border-l-2 border-[#2B2B2B]/15">
                        {order.items.map((it: OrderItem, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs font-sans">
                            <span className="text-[#2B2B2B]/80">
                              {it.quantity} x <span className="font-serif font-medium">{it.title}</span>
                            </span>
                            <span className="font-mono text-xs text-[#2B2B2B]/70">Rs. {it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Interactive Logistics Timeline Grid: Ordered -> Shipping -> Delivered */}
                      <div className="pt-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#2B2B2B]/60 block mb-3 font-semibold">
                          Logistical Delivery Timeline
                        </span>
                        
                        <div className="relative flex justify-between items-center px-4">
                          {/* Connecting lines */}
                          <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-[#2B2B2B]/20 -translate-y-1/2 z-0" />
                          <div 
                            className="absolute top-1/2 left-4 h-[2px] bg-[#2B2B2B] -translate-y-1/2 z-0 transition-all duration-500" 
                            style={{ 
                              width: order.status === 'ordered' ? '0%' : order.status === 'shipping' ? '50%' : '100%' 
                            }} 
                          />

                          {/* Node 1: Ordered */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                              order.status === 'ordered' || order.status === 'shipping' || order.status === 'delivered'
                                ? 'bg-[#2B2B2B] text-[#F7F3EC] border-[#2B2B2B]'
                                : 'bg-white text-[#2B2B2B]/50 border-stone-300'
                            }`}>
                              ✓
                            </div>
                            <span className="text-[9px] font-mono mt-1.5 uppercase tracking-wide font-semibold">Ordered</span>
                          </div>

                          {/* Node 2: Shipping */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                              order.status === 'shipping' || order.status === 'delivered'
                                ? 'bg-[#2B2B2B] text-[#F7F3EC] border-[#2B2B2B]'
                                : 'bg-white text-[#2B2B2B]/40 border-stone-300'
                            }`}>
                              🚚
                            </div>
                            <span className="text-[9px] font-mono mt-1.5 uppercase tracking-wide font-semibold">Shipping</span>
                          </div>

                          {/* Node 3: Delivered */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                              order.status === 'delivered'
                                ? 'bg-[#2B2B2B] text-[#F7F3EC] border-[#2B2B2B]'
                                : 'bg-white text-[#2B2B2B]/40 border-stone-300'
                            }`}>
                              🎁
                            </div>
                            <span className="text-[9px] font-mono mt-1.5 uppercase tracking-wide font-semibold">Delivered</span>
                          </div>
                        </div>

                        {/* Interactive Admin Logistics modifier toggle */}
                        {user.role === 'admin' && (
                          <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-lg text-center">
                            <button
                              onClick={() => handleAdminToggleOrderStatus(order.id)}
                              className="text-[10px] font-mono font-semibold text-amber-800 uppercase hover:underline cursor-pointer"
                            >
                              ⚙ Simulate Next Shipping State (Current: <span className="underline">{order.status}</span>)
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* PANEL D: DEALS (Promotional Books list) */}
            {messagesSubTab === 'deals' && (
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">
                  Jeena Satr Promotional Bestsellers
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {books.filter((b: Book) => b.isPromo).map((book: Book) => {
                    const discountPercent = Math.round(((book.price - book.discountPrice!) / book.price) * 100);
                    return (
                      <div
                        key={book.id}
                        onClick={() => {
                          setSelectedBook(book);
                          setSelectedCoverIndex(0);
                          setCurrentView('product_detail');
                        }}
                        className="bg-white/50 border border-[#2B2B2B]/15 rounded-xl p-3 flex flex-col justify-between hover:bg-white cursor-pointer transition-all"
                      >
                        <div className="flex justify-center bg-stone-100/50 rounded-lg p-2 relative">
                          <BookCover 
                            title={book.title} 
                            author={book.author} 
                            coverColor={book.coverColor} 
                            coverPattern={book.coverPattern}
                            category={book.category}
                            size="sm"
                            coverImages={book.coverImages}
                          />
                          <span className="absolute top-1 left-1 bg-[#2B2B2B] text-[#F7F3EC] text-[8px] font-mono px-1 rounded">
                            -{discountPercent}%
                          </span>
                        </div>
                        <div className="mt-2 text-left">
                          <h5 className="font-serif font-bold text-xs truncate text-[#2B2B2B]">{book.title}</h5>
                          <p className="font-serif italic text-[10px] text-[#2B2B2B]/60 truncate">{book.author}</p>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="font-mono text-xs font-bold text-[#2B2B2B]">Rs. {book.discountPrice}</span>
                            <span className="font-mono text-[9px] text-[#2B2B2B]/40 line-through">Rs. {book.price}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 5. CATEGORIES PAGE */}
        {currentView === 'categories_page' && (
          <div id="categories-page" className="flex-1 flex flex-col p-4 space-y-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentView('main')}
                className="p-1 hover:bg-[#2B2B2B]/5 rounded-lg text-[#2B2B2B]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B]">
                Book Categories
              </h2>
            </div>

            {/* Horizontal Filter Badges */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  selectedCategoryFilter === null 
                    ? 'bg-[#2B2B2B] text-[#F7F3EC]' 
                    : 'bg-white/60 border border-[#2B2B2B]/10 text-[#2B2B2B]'
                }`}
              >
                All Categories
              </button>
              {['Urdu Novels', 'English Novels', 'Science Fiction', 'Motivational', 'Funny Comics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
                    selectedCategoryFilter === cat 
                      ? 'bg-[#2B2B2B] text-[#F7F3EC]' 
                      : 'bg-white/60 border border-[#2B2B2B]/10 text-[#2B2B2B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid displays */}
            <div className="space-y-6">
              {['Urdu Novels', 'English Novels', 'Science Fiction', 'Motivational', 'Funny Comics']
                .filter((cat: string) => selectedCategoryFilter === null || selectedCategoryFilter === cat)
                .map((categoryName) => {
                  const categoryBooks = books.filter((b: Book) => b.category === categoryName);
                  return (
                    <div key={categoryName} className="space-y-3">
                      <div className="flex justify-between items-baseline border-b border-[#2B2B2B]/10 pb-1.5">
                        <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
                          {categoryName}
                        </h3>
                        <span className="font-mono text-[10px] text-[#2B2B2B]/60">
                          {categoryBooks.length} Editions Available
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {categoryBooks.map((book: Book) => (
                          <div
                            key={book.id}
                            onClick={() => {
                              setSelectedBook(book);
                              setSelectedCoverIndex(0);
                              setCurrentView('product_detail');
                            }}
                            className="p-2 bg-white/40 border border-[#2B2B2B]/5 rounded-xl hover:bg-white transition-all flex items-center gap-3 cursor-pointer"
                          >
                            <BookCover 
                              title={book.title} 
                              author={book.author} 
                              coverColor={book.coverColor} 
                              coverPattern={book.coverPattern}
                              category={book.category}
                              size="sm"
                              coverImages={book.coverImages}
                            />
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="font-serif font-bold text-[11px] text-[#2B2B2B] line-clamp-1">{book.title}</h4>
                              <p className="font-serif italic text-[10px] text-[#2B2B2B]/60 truncate">{book.author}</p>
                              <span className="font-mono text-[11px] font-semibold text-[#2B2B2B] mt-1 block">
                                Rs. {book.isPromo ? book.discountPrice : book.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 6. PRODUCT DETAIL PAGE */}
        {currentView === 'product_detail' && selectedBook && (
          <div id="product-detail-page" className="flex-1 flex flex-col p-4 space-y-6">
            
            {/* Navigation back and details */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  // Go back to Home or Categories depending on where we came from
                  setCurrentView('main');
                }}
                className="p-1.5 hover:bg-[#2B2B2B]/5 rounded-lg text-[#2B2B2B] flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Catalog
              </button>

              <span className="font-mono text-[9px] px-2 py-0.5 border border-[#2B2B2B]/20 rounded bg-white/30">
                {selectedBook.category}
              </span>
            </div>

            {/* Cover Multi-Style Carousel Block */}
            <div className="bg-stone-100/60 rounded-2xl p-6 border border-[#2B2B2B]/5 flex flex-col items-center">
              <div className="mb-4">
                <BookCover 
                  title={selectedBook.title}
                  author={selectedBook.author}
                  coverColor={selectedBook.coverColor}
                  coverPattern={
                    selectedCoverIndex === 1 ? 'lines' :
                    selectedCoverIndex === 2 ? 'circle' :
                    selectedBook.coverPattern
                  }
                  category={selectedBook.category}
                  size="lg"
                  image={selectedBook.coverImages[selectedCoverIndex]}
                />
              </div>

              {/* Carousel Indicators / Controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCoverIndex((prev: number) => (prev === 0 ? selectedBook.coverImages.length - 1 : prev - 1))}
                  className="p-1 border border-[#2B2B2B]/20 bg-white hover:bg-stone-50 rounded-full cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1.5">
                  {selectedBook.coverImages.map((_: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCoverIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedCoverIndex === idx ? 'bg-[#2B2B2B] w-4' : 'bg-[#2B2B2B]/20'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCoverIndex((prev: number) => (prev === selectedBook.coverImages.length - 1 ? 0 : prev + 1))}
                  className="p-1 border border-[#2B2B2B]/20 bg-white hover:bg-stone-50 rounded-full cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-[#2B2B2B]/50 font-mono mt-2 uppercase tracking-widest">
                Edition {selectedCoverIndex + 1}
              </span>
            </div>

            {/* Book Metadata & Prices */}
            <div className="text-left space-y-2">
              <h2 className="font-serif font-bold text-2xl tracking-tight text-[#2B2B2B]">
                {selectedBook.title}
              </h2>
              <p className="font-serif italic text-base text-[#2B2B2B]/70">
                by {selectedBook.author}
              </p>

              {/* Price Tag layouts */}
              <div className="flex items-baseline gap-2 pt-1">
                {selectedBook.isPromo && selectedBook.discountPrice ? (
                  <>
                    <span className="font-mono text-xl font-bold text-[#2B2B2B]">Rs. {selectedBook.discountPrice}</span>
                    <span className="font-mono text-xs text-[#2B2B2B]/40 line-through">Rs. {selectedBook.price}</span>
                    <span className="font-mono text-[9px] bg-[#2B2B2B] text-[#F7F3EC] px-1.5 py-0.5 rounded ml-2 uppercase">
                      PROMO DISCOUNT ACTIVE
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-xl font-bold text-[#2B2B2B]">Rs. {selectedBook.price}</span>
                )}
              </div>

              {/* Rating and Reviews header summary */}
              <div className="flex items-center gap-1.5 font-mono text-xs pt-1.5">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 fill-current ${
                        i < Math.round(selectedBook.rating) ? 'text-amber-500' : 'text-stone-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="font-bold">{selectedBook.rating}</span>
                <span className="text-[#2B2B2B]/40">({selectedBook.reviews.length} reviews)</span>
              </div>
            </div>

            {/* Description Block */}
            <div className="border-t border-[#2B2B2B]/10 pt-4 text-left">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2B2B2B]/60 mb-1.5">
                Archival Synopsis
              </h4>
              <p className="text-xs leading-relaxed text-[#2B2B2B]/80 font-sans">
                {selectedBook.description}
              </p>
            </div>

            {/* Main Action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAddToCart(selectedBook.id)}
                className="flex-1 py-3 bg-[#2B2B2B] text-[#F7F3EC] hover:bg-[#1A1A1A] transition-all rounded-xl text-xs font-serif font-semibold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
              </button>
            </div>

            {/* Reviews Section with dynamic submissions */}
            <div className="border-t border-[#2B2B2B]/10 pt-4 space-y-4 text-left">
              <h4 className="font-serif font-semibold text-sm text-[#2B2B2B]">
                Reader Assessments & Discussion ({selectedBook.reviews.length})
              </h4>

              {/* Review submit form */}
              <form onSubmit={(e: React.FormEvent) => handleAddReview(e, selectedBook.id)} className="bg-white/40 border border-[#2B2B2B]/10 p-3 rounded-xl space-y-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#2B2B2B]/60 block font-semibold">
                  Share Your Personal Assessment
                </span>
                
                {reviewMessage && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {reviewMessage}
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-[#2B2B2B]/70">Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReviewRating(val)}
                        className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${val <= reviewRating ? 'text-amber-500 fill-current' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={reviewText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewText(e.target.value)}
                    placeholder="Type book review, thoughts..."
                    className="flex-1 px-3 py-1.5 bg-white border border-[#2B2B2B]/10 rounded-lg text-xs focus:outline-none focus:border-[#2B2B2B] text-[#2B2B2B]"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-[#2B2B2B] text-[#F7F3EC] hover:bg-[#1A1A1A] transition-colors rounded-lg text-[10.5px] font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* Scrollable list of reviews */}
              {selectedBook.reviews.length === 0 ? (
                <p className="text-xs font-serif italic text-[#2B2B2B]/50 text-center py-2">
                  "No assessments have been recorded yet for this edition."
                </p>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {selectedBook.reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white/40 border border-[#2B2B2B]/5 rounded-xl space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-serif font-bold text-xs text-[#2B2B2B]">{rev.user}</span>
                        <span className="font-mono text-[9px] text-[#2B2B2B]/40">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500 pb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-2.5 h-2.5 fill-current ${i < rev.rating ? 'text-amber-500' : 'text-stone-300'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-[#2B2B2B]/80 leading-relaxed font-sans">{rev.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 7. SHOPPING CART PAGE */}
        {currentView === 'cart' && (
          <div id="cart-page" className="flex-1 flex flex-col p-4 space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] text-left">
              Shopping Cart
            </h2>

            {cart.length === 0 ? (
              <div className="bg-white/40 border border-dashed border-[#2B2B2B]/15 rounded-xl p-12 text-center my-auto space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#2B2B2B]/30 mx-auto" />
                <div>
                  <p className="text-sm font-serif italic text-[#2B2B2B]/60">
                    "Your shopping cart is empty of volumes."
                  </p>
                  <p className="text-[11px] text-[#2B2B2B]/50 mt-1">
                    Explore books to add selected items to your checkout cart.
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('main')}
                  className="px-4 py-2 bg-[#2B2B2B] text-[#F7F3EC] rounded-xl text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                {/* List items with checkbox support */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {cart.map((item: CartItem) => {
                    const book = books.find((b: Book) => b.id === item.bookId);
                    if (!book) return null;
                    const activePrice = book.isPromo && book.discountPrice ? book.discountPrice : book.price;
                    
                    return (
                      <div 
                        key={item.bookId}
                        className="p-3 bg-white/50 border border-[#2B2B2B]/10 rounded-xl flex items-center gap-3 hover:bg-white transition-all"
                      >
                        {/* Checkbox support for selective items */}
                        <button
                          type="button"
                          onClick={() => handleToggleSelectCartItem(item.bookId)}
                          className={`w-4.5 h-4.5 rounded border flex items-center justify-center cursor-pointer ${
                            item.selected 
                              ? 'bg-[#2B2B2B] border-[#2B2B2B] text-[#F7F3EC]' 
                              : 'border-[#2B2B2B]/30 bg-white hover:border-[#2B2B2B]'
                          }`}
                        >
                          {item.selected && <Check className="w-3 h-3 stroke-[3px]" />}
                        </button>

                        {/* Little Book Cover Thumbnail */}
                        <div 
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedBook(book);
                            setSelectedCoverIndex(0);
                            setCurrentView('product_detail');
                          }}
                        >
                          <BookCover 
                            title={book.title} 
                            author={book.author} 
                            coverColor={book.coverColor} 
                            coverPattern={book.coverPattern}
                            category={book.category}
                            size="sm"
                          />
                        </div>

                        {/* Metadata details */}
                        <div className="flex-1 min-w-0 text-left">
                          <h4 
                            className="font-serif font-bold text-xs text-[#2B2B2B] truncate cursor-pointer hover:underline"
                            onClick={() => {
                              setSelectedBook(book);
                              setSelectedCoverIndex(0);
                              setCurrentView('product_detail');
                            }}
                          >
                            {book.title}
                          </h4>
                          <p className="font-serif italic text-[10px] text-[#2B2B2B]/60 truncate">by {book.author}</p>
                          
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="font-mono text-xs font-semibold text-[#2B2B2B]">Rs. {activePrice}</span>
                            {book.isPromo && (
                              <span className="font-mono text-[9px] text-[#2B2B2B]/40 line-through">Rs. {book.price}</span>
                            )}
                          </div>
                        </div>

                        {/* Controls for quantity and remove */}
                        <div className="flex flex-col items-end gap-2.5">
                          {/* Quantity +/- selectors */}
                          <div className="flex items-center border border-[#2B2B2B]/15 rounded-lg overflow-hidden bg-white/80">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.bookId, -1)}
                              className="p-1 hover:bg-stone-100 text-[#2B2B2B] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-[#2B2B2B]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.bookId, 1)}
                              className="p-1 hover:bg-stone-100 text-[#2B2B2B] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete item button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.bookId)}
                            className="text-[9px] font-mono text-red-700 uppercase tracking-wider hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & checkout calculations footer */}
                <div className="space-y-4 bg-white/40 border border-[#2B2B2B]/10 rounded-xl p-4">
                  <div className="space-y-2 text-left">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#2B2B2B]/60 block font-semibold border-b border-[#2B2B2B]/10 pb-1">
                      Checkout Cost Assessment
                    </span>

                    <div className="flex justify-between text-xs">
                      <span className="text-[#2B2B2B]/70">Selected Volumes Subtotal</span>
                      <span className="font-mono text-xs">Rs. {cartSubtotal}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-[#2B2B2B]/70">Standard Shipping Charges</span>
                      <span className="font-mono text-xs">Rs. {shippingCharge}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold border-t border-dashed border-[#2B2B2B]/10 pt-2">
                      <span className="text-[#2B2B2B]">Grand Total Assessment</span>
                      <span className="font-mono text-sm">Rs. {cartTotal}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3 bg-[#2B2B2B] text-[#F7F3EC] hover:bg-[#1A1A1A] transition-colors rounded-xl text-xs font-serif font-semibold tracking-wider uppercase cursor-pointer"
                  >
                    Confirm Literary Checkout (Rs. {cartTotal})
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* 8. ACCOUNT DETAILS PROFILE & INTEGRATION PLAYGROUND */}
        {currentView === 'account' && (
          <div id="account-page" className="flex-1 flex flex-col p-4 space-y-6">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] text-left">
              Your Literary Account
            </h2>

            {/* Profile detail card */}
            <div className="bg-white/50 border border-[#2B2B2B]/15 rounded-xl p-4 flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-[#2B2B2B] text-[#F7F3EC] flex items-center justify-center font-serif text-lg font-bold">
                {user.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">
                  {user.fullName}
                </h4>
                <p className="text-xs text-[#2B2B2B]/60 truncate mt-0.5">
                  Email: {user.email}
                </p>
                <div className="flex gap-1.5 mt-1.5">
                  <span className="font-mono text-[8px] bg-[#2B2B2B]/10 px-1.5 py-0.5 rounded border border-[#2B2B2B]/15 uppercase">
                    Role: {user.role === 'admin' ? 'Curator (Admin)' : 'Reader'}
                  </span>
                  <span className="font-mono text-[8px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded uppercase">
                    Authorized
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated app details list */}
            <div className="bg-white/30 border border-[#2B2B2B]/10 rounded-xl p-4 space-y-2 text-xs text-left">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#2B2B2B]/60 block font-semibold mb-2">
                Jeena Satr Applet Details
              </span>
              <div className="flex justify-between py-1 border-b border-[#2B2B2B]/5">
                <span className="text-[#2B2B2B]/70">Application Version</span>
                <span className="font-mono font-medium">1.0.4 Production</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2B2B2B]/5">
                <span className="text-[#2B2B2B]/70">Database Engine</span>
                <span className="font-mono font-medium text-emerald-800">PostgreSQL (Django Schema)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#2B2B2B]/70">Environment API State</span>
                <span className="font-mono font-medium text-emerald-800">Operational</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowDevHub(!showDevHub)}
                className="w-full py-2.5 bg-white border border-[#2B2B2B] text-[#2B2B2B] hover:bg-[#2B2B2B]/5 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Database className="w-4 h-4" /> 
                {showDevHub ? 'Close Django Dev Hub' : 'Inspect Django models.py & Blueprint'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 rounded-xl text-xs font-mono font-semibold cursor-pointer transition-colors"
              >
                Sign Out / Reset Credentials
              </button>
            </div>

            {/* Micro-credit block */}
            <div className="text-center pt-4">
              <span className="font-serif italic text-xs text-[#2B2B2B]/50 block">
                "Jeena Satr - Where words capture the essence of being."
              </span>
              <span className="font-mono text-[8px] text-[#2B2B2B]/30 uppercase block mt-1">
                © 2026 JEENA SATR READERS REVOLUTION
              </span>
            </div>
          </div>
        )}

      </div>

      {/* --- FLOATING DJANGO DEV BLUEPRINT DRAWER PANEL --- */}
      {showDevHub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F7F3EC] rounded-3xl border-2 border-[#7A3E48] p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowDevHub(false)}
              className="absolute top-4 right-4 bg-[#2B2B2B] text-[#F7F3EC] hover:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer"
            >
              Close Hub Panel
            </button>
            
            <div className="mb-4">
              <span className="font-mono text-[10px] uppercase text-emerald-800 tracking-widest font-bold">
                PLATFORM EXPORT BLUEPRINT ENGINE
              </span>
              <h2 className="font-serif font-bold text-3xl mt-1 text-[#2B2B2B]">Jeena Satr Backend Schemas</h2>
            </div>

            <AdminBlueprint />
          </div>
        </div>
      )}

      {/* --- STICKY BOTTOM NAVIGATION BAR --- */}
      {currentView !== 'splash' && currentView !== 'auth' && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3EC]/98 backdrop-blur-md border-t-2 border-[#7A3E48]/20 py-2.5 max-w-lg mx-auto shadow-[0_-5px_20px_rgba(122,62,72,0.08)]">
          <div className="flex justify-around items-center">
            
            {/* Nav Tab 1: Home */}
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentView('main');
              }}
              className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-all ${
                currentView === 'main' ? 'text-[#7A3E48] scale-105' : 'text-[#666666] hover:text-[#7A3E48]'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Home</span>
            </button>

            {/* Nav Tab 2: Messages */}
            <button
              onClick={() => {
                setActiveThreadId(null);
                setMessagesSubTab('chats');
                setCurrentView('messages_hub');
              }}
              className={`flex flex-col items-center gap-1 p-2 cursor-pointer relative transition-all ${
                currentView === 'messages_hub' ? 'text-[#7A3E48] scale-105' : 'text-[#666666] hover:text-[#7A3E48]'
              }`}
            >
              <MessageSquare className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Messages</span>
              {chatThreads.some((t: ChatThread) => t.unreadCount > 0) && (
                <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-[#7A3E48]" />
              )}
            </button>

            {/* Nav Tab 3: Cart */}
            <button
              onClick={() => setCurrentView('cart')}
              className={`flex flex-col items-center gap-1 p-2 cursor-pointer relative transition-all ${
                currentView === 'cart' ? 'text-[#7A3E48] scale-105' : 'text-[#666666] hover:text-[#7A3E48]'
              }`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-0.5 right-3 bg-[#7A3E48] text-[#F7F3EC] text-[8.5px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Nav Tab 4: Account */}
            <button
              onClick={() => setCurrentView('account')}
              className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-all ${
                currentView === 'account' ? 'text-[#7A3E48] scale-105' : 'text-[#666666] hover:text-[#7A3E48]'
              }`}
            >
              <UserIcon className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Account</span>
            </button>

          </div>
        </nav>
      )}

    </div>
  );
}

import { createClient } from '@supabase/supabase-js';
import { Book, Review, Order, OrderItem, ChatThread, ChatMessage, CartItem } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Safely initialize the client so it does not crash if keys are missing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is connected and ready
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

// ==========================================
// DATABASE OPERATION APIS
// ==========================================

/**
 * Fetch all books from Supabase with their associated reviews
 */
export async function fetchBooksFromSupabase(): Promise<Book[] | null> {
  if (!supabase) return null;
  try {
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select('*')
      .order('title', { ascending: true });

    if (booksError) throw booksError;
    if (!booksData) return [];

    // Fetch all reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*');

    if (reviewsError) throw reviewsError;

    // Map database models back to front-end Book types
    return booksData.map((b: any) => {
      const bookReviews = (reviewsData || [])
        .filter((r: any) => r.book_id === b.id)
        .map((r: any) => ({
          id: r.id,
          user: r.username,
          rating: r.rating,
          text: r.text,
          date: r.date
        }));

      return {
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        price: Number(b.price),
        description: b.description,
        rating: Number(b.rating),
        featured: b.featured,
        isPromo: b.is_promo,
        discountPrice: b.discount_price ? Number(b.discount_price) : undefined,
        coverColor: b.cover_color,
        coverPattern: b.cover_pattern,
        coverImages: b.cover_images || [],
        reviews: bookReviews
      };
    });
  } catch (error) {
    console.error('Error fetching books from Supabase:', error);
    return null;
  }
}

/**
 * Insert a new review for a book
 */
export async function insertReviewToSupabase(bookId: string, review: Review): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        id: review.id,
        book_id: bookId,
        username: review.user,
        rating: review.rating,
        text: review.text,
        date: review.date
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error inserting review to Supabase:', error);
    return false;
  }
}

/**
 * Fetch all orders for a specific user email
 */
export async function fetchOrdersFromSupabase(userEmail: string): Promise<Order[] | null> {
  if (!supabase) return null;
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_email', userEmail)
      .order('date', { ascending: false });

    if (ordersError) throw ordersError;
    if (!ordersData || ordersData.length === 0) return [];

    // Fetch all items for these orders
    const orderIds = ordersData.map((o: any) => o.id);
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (itemsError) throw itemsError;

    return ordersData.map((o: any) => {
      const orderItems = (itemsData || [])
        .filter((it: any) => it.order_id === o.id)
        .map((it: any) => ({
          bookId: it.book_id,
          title: it.title,
          author: it.author,
          price: Number(it.price),
          quantity: it.quantity
        }));

      return {
        id: o.id,
        date: o.date,
        status: o.status as 'ordered' | 'shipping' | 'delivered',
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        total: Number(o.total),
        items: orderItems
      };
    });
  } catch (error) {
    console.error('Error fetching orders from Supabase:', error);
    return null;
  }
}

/**
 * Create a new order and its items
 */
export async function createOrderInSupabase(order: Order, userEmail: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    // 1. Insert order record
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: order.id,
        date: order.date,
        status: order.status,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        user_email: userEmail
      });

    if (orderError) throw orderError;

    // 2. Insert order items
    const itemsToInsert = order.items.map((it: OrderItem) => ({
      order_id: order.id,
      book_id: it.bookId,
      title: it.title,
      author: it.author,
      price: it.price,
      quantity: it.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;
    return true;
  } catch (error) {
    console.error('Error creating order in Supabase:', error);
    return false;
  }
}

/**
 * Update an order's shipping status (Admin feature)
 */
export async function updateOrderStatusInSupabase(orderId: string, status: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order status in Supabase:', error);
    return false;
  }
}

/**
 * Fetch chat threads and messages for a specific user email
 */
export async function fetchChatThreadsFromSupabase(userEmail: string): Promise<ChatThread[] | null> {
  if (!supabase) return null;
  try {
    const { data: threadsData, error: threadsError } = await supabase
      .from('chat_threads')
      .select('*')
      .eq('user_email', userEmail)
      .order('id', { ascending: true });

    if (threadsError) throw threadsError;
    if (!threadsData || threadsData.length === 0) return null;

    const threadIds = threadsData.map((t: any) => t.id);
    const { data: messagesData, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .in('thread_id', threadIds)
      .order('id', { ascending: true });

    if (messagesError) throw messagesError;

    return threadsData.map((t: any) => {
      const threadMsgs = (messagesData || [])
        .filter((msg: any) => msg.thread_id === t.id)
        .map((msg: any) => ({
          id: msg.id,
          sender: msg.sender as 'user' | 'peer' | 'system',
          text: msg.text,
          timestamp: msg.timestamp
        }));

      return {
        id: t.id,
        contactName: t.contact_name,
        contactRole: t.contact_role,
        lastMessage: t.last_message,
        unreadCount: t.unread_count,
        messages: threadMsgs
      };
    });
  } catch (error) {
    console.error('Error fetching chat threads from Supabase:', error);
    return null;
  }
}

/**
 * Sync or create chat thread
 */
export async function upsertChatThreadInSupabase(thread: ChatThread, userEmail: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('chat_threads')
      .upsert({
        id: thread.id,
        contact_name: thread.contactName,
        contact_role: thread.contactRole,
        last_message: thread.lastMessage,
        unread_count: thread.unreadCount,
        user_email: userEmail
      }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error upserting chat thread:', error);
    return false;
  }
}

/**
 * Insert a chat message and update thread's last message
 */
export async function insertChatMessageToSupabase(threadId: string, message: ChatMessage, lastMessageText: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert({
        id: message.id,
        thread_id: threadId,
        sender: message.sender,
        text: message.text,
        timestamp: message.timestamp
      });

    if (msgError) throw msgError;

    const { error: threadError } = await supabase
      .from('chat_threads')
      .update({ last_message: lastMessageText })
      .eq('id', threadId);

    if (threadError) throw threadError;

    return true;
  } catch (error) {
    console.error('Error saving chat message to Supabase:', error);
    return false;
  }
}

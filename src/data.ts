import { Book, ChatThread, Order } from './types';

export const LITERARY_QUOTES = [
  "“A room without books is like a body without a soul.” — Marcus Tullius Cicero",
  "“The reading of all good books is like a conversation with the finest minds of past centuries.” — René Descartes",
  "“I have always imagined that Paradise will be a kind of library.” — Jorge Luis Borges",
  "“There is no friend as loyal as a book.” — Ernest Hemingway",
  "“Books are a uniquely portable magic.” — Stephen King",
  "“Reading is an exercise in empathy; an exercise in walking in someone else’s shoes.” — Malorie Blackman",
  "“Satr ba satr jeena hi toh safar hai.” — Literary Proverb",
];

export const BOOKS: Book[] = [
  // URDU NOVELS
  {
    id: "u1",
    title: "Peer-e-Kamil",
    author: "Umera Ahmed",
    category: "Urdu Novels",
    price: 850,
    description: "A legendary contemporary Urdu masterpiece focusing on the spiritual and psychological journey of two individuals tracing a path to ultimate truth.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-slate-900",
    coverPattern: "lines",
    coverImages: [
      "/images/urdu novel/Peer-e-Kamil (Umera Ahmed) 1.jpg",
      "/images/urdu novel/Peer-e-Kamil (Umera Ahmed) 2.jpg",
      "/images/urdu novel/Peer-e-Kamil (Umera Ahmed) 3.jpg"
    ],
    reviews: [
      { id: "r1", user: "Amna Khan", rating: 5, text: "A life-changing book. The depth of characters is unparalleled.", date: "2026-06-25" },
      { id: "r2", user: "Zainab R.", rating: 5, text: "Umera Ahmed's absolute masterpiece. Beautifully packaged.", date: "2026-07-02" }
    ]
  },
  {
    id: "u2",
    title: "Jannat Kay Pattay",
    author: "Nimra Ahmed",
    category: "Urdu Novels",
    price: 950,
    description: "An engrossing tale of secret services, intelligence, trust, friendship, and spiritual enlightenment centering around Haya and Jihan.",
    rating: 4.8,
    featured: true,
    isPromo: true,
    discountPrice: 850,
    coverColor: "bg-emerald-950",
    coverPattern: "floral",
    coverImages: [
      "/images/urdu novel/Jannat Kay Pattay (Nimra Ahmed) 1.jpg",
      "/images/urdu novel/Jannat Kay Pattay (Nimra Ahmed) 2.jpg",
      "/images/urdu novel/Jannat Kay Pattay (Nimra Ahmed) 3.jpg"
    ],
    reviews: [
      { id: "r3", user: "Haris J.", rating: 4, text: "Intriguing story and great pacing. Highly recommended.", date: "2026-05-18" }
    ]
  },
  {
    id: "u4",
    title: "Namal",
    author: "Nimra Ahmed",
    category: "Urdu Novels",
    price: 1100,
    description: "A powerful, sprawling legal thriller that exposes societal corruption, manipulation, and family ties, referencing Surah An-Naml.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-red-950",
    coverPattern: "lines",
    coverImages: [
      "/images/urdu novel/Namal (Nimra Ahmed) 1.jpg",
      "/images/urdu novel/Namal (Nimra Ahmed) 2.jpg"
    ],
    reviews: [
      { id: "r4", user: "Fatima Ali", rating: 5, text: "Best legal thriller in Urdu literature! Plot twists are insane.", date: "2026-07-10" }
    ]
  },
  {
    id: "u5",
    title: "Amar Bail",
    author: "Umera Ahmed",
    category: "Urdu Novels",
    price: 890,
    description: "A heart-wrenching tale depicting bureaucracy, power, toxic family environments, and the heavy price of deep-rooted relationships.",
    rating: 4.8,
    featured: false,
    isPromo: false,
    coverColor: "bg-amber-950",
    coverPattern: "wave",
    coverImages: [
      "/images/urdu novel/Amar Bail (Umera Ahmed).jpg"
    ],
    reviews: []
  },
  {
    id: "u6",
    title: "Mushaf",
    author: "Nimra Ahmed",
    category: "Urdu Novels",
    price: 650,
    description: "A beautiful story of how a girl discovers the true guidance of the Quran and how it radically transforms her difficult life.",
    rating: 4.7,
    featured: false,
    isPromo: true,
    discountPrice: 580,
    coverColor: "bg-blue-950",
    coverPattern: "floral",
    coverImages: [
      "/images/urdu novel/Mushaf (Nimra Ahmed).jpg"
    ],
    reviews: []
  },
  {
    id: "u10",
    title: "Aangan",
    author: "Khadija Mastoor",
    category: "Urdu Novels",
    price: 750,
    description: "Set in the backdrop of the partition of India, representing the domestic and emotional cages of the women of that era.",
    rating: 4.6,
    featured: false,
    isPromo: false,
    coverColor: "bg-orange-950",
    coverPattern: "minimal",
    coverImages: [
      "/images/urdu novel/Aangan (Khadija Mastoor).jpg"
    ],
    reviews: []
  },
  {
    id: "u11",
    title: "Bakht",
    author: "Mehrunnisa Shahmeer",
    category: "Urdu Novels",
    price: 820,
    description: "A beautifully written Urdu novel exploring destiny, human choices, and social issues in modern society.",
    rating: 4.5,
    featured: false,
    isPromo: false,
    coverColor: "bg-indigo-950",
    coverPattern: "circle",
    coverImages: [
      "/images/urdu novel/Bakht  Mehrunnisa Shahmeer.jpg"
    ],
    reviews: []
  },
  {
    id: "u12",
    title: "Aab-e-Hayat",
    author: "Umera Ahmed",
    category: "Urdu Novels",
    price: 980,
    description: "The highly anticipated sequel to Peer-e-Kamil, following the lives of Salar and Imama as they face new trials and spiritual heights.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-slate-800",
    coverPattern: "lines",
    coverImages: [
      "/images/urdu novel/aab e hayat novel  Umera Ahmed.jpg"
    ],
    reviews: []
  },

  // ENGLISH NOVELS
  {
    id: "e1",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "English Novels",
    price: 600,
    description: "An inspiring fable about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    rating: 4.7,
    featured: true,
    isPromo: false,
    coverColor: "bg-amber-800",
    coverPattern: "circle",
    coverImages: [
      "/images/english novel/The Alchemist (Paulo Coelho).jpg"
    ],
    reviews: [
      { id: "r6", user: "Dave M.", rating: 4, text: "A quick, motivational read. Follow your personal legend!", date: "2026-07-05" }
    ]
  },
  {
    id: "e2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "English Novels",
    price: 750,
    description: "The classic tale of childhood, racial injustice, and moral growth in the American South, viewed through Scout Finch's eyes.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-teal-900",
    coverPattern: "lines",
    coverImages: [
      "/images/english novel/To Kill a Mockingbird (Harper Lee).jpg"
    ],
    reviews: []
  },
  {
    id: "e3",
    title: "1984",
    author: "George Orwell",
    category: "English Novels",
    price: 650,
    description: "A chilling dystopian novel examining mass surveillance, state control, and the destruction of individual truth.",
    rating: 4.8,
    featured: true,
    isPromo: true,
    discountPrice: 500,
    coverColor: "bg-red-900",
    coverPattern: "minimal",
    coverImages: [
      "/images/english novel/1984 (George Orwell).jpg"
    ],
    reviews: []
  },
  {
    id: "e4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "English Novels",
    price: 700,
    description: "A beautiful exploration of wealth, love, and the disillusionment of the American Dream in the roaring twenties.",
    rating: 4.6,
    featured: false,
    isPromo: false,
    coverColor: "bg-indigo-950",
    coverPattern: "wave",
    coverImages: [
      "/images/english novel/The Great Gatsby (F. Scott Fitzgerald).jpg"
    ],
    reviews: []
  },
  {
    id: "e10",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    category: "English Novels",
    price: 850,
    description: "A powerful novel of friendship, betrayal, guilt, and redemption set in war-torn Afghanistan.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-amber-900",
    coverPattern: "lines",
    coverImages: [
      "/images/english novel/The Kite Runner (Khaled Hosseini).jpg"
    ],
    reviews: []
  },

  // MOTIVATIONAL
  {
    id: "m1",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Motivational",
    price: 750,
    description: "An incredibly practical framework to improve every single day by compounding tiny 1% daily changes.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-slate-800",
    coverPattern: "lines",
    coverImages: [
      "/images/motivational/Atomic Habits (James Clear).jpg"
    ],
    reviews: []
  },
  {
    id: "m2",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen Covey",
    category: "Motivational",
    price: 800,
    description: "A holistic, integrated, principle-centered approach for solving personal and professional problems.",
    rating: 4.7,
    featured: false,
    isPromo: false,
    coverColor: "bg-blue-900",
    coverPattern: "circle",
    coverImages: [
      "/images/motivational/The 7 Habits of Highly Effective People (Stephen Covey).jpg"
    ],
    reviews: []
  },
  {
    id: "m3",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Motivational",
    price: 500,
    description: "The original personal success handbook, compiled from interviews with the most successful historical giants.",
    rating: 4.5,
    featured: false,
    isPromo: true,
    discountPrice: 400,
    coverColor: "bg-yellow-800",
    coverPattern: "minimal",
    coverImages: [
      "/images/motivational/Think and Grow Rich (Napoleon Hill).jpg"
    ],
    reviews: []
  },
  {
    id: "m4",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    category: "Motivational",
    price: 720,
    description: "A guide to spiritual enlightenment, showing how letting go of the ego and past/future invites peace.",
    rating: 4.8,
    featured: true,
    isPromo: false,
    coverColor: "bg-emerald-900",
    coverPattern: "wave",
    coverImages: [
      "/images/motivational/The Power of Now (Eckhart Tolle).jpg"
    ],
    reviews: []
  },
  {
    id: "m5",
    title: "Can't Hurt Me",
    author: "David Goggins",
    category: "Motivational",
    price: 850,
    description: "Demonstrates how to master your mind, defy the odds, and tap into your unused potential.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-stone-900",
    coverPattern: "lines",
    coverImages: [
      "/images/motivational/Can't Hurt Me (David Goggins).jpg"
    ],
    reviews: []
  },

  // SCIENCE FICTION
  {
    id: "s1",
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    price: 900,
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the mysterious Muad'Dib.",
    rating: 4.8,
    featured: true,
    isPromo: false,
    coverColor: "bg-orange-900",
    coverPattern: "wave",
    coverImages: [
      "/images/science fiction/Dune (Frank Herbert).jpg"
    ],
    reviews: []
  },
  {
    id: "s2",
    title: "The Martian",
    author: "Andy Weir",
    category: "Science Fiction",
    price: 780,
    description: "A lone astronaut stranded on Mars must use his scientific wit, resourcefulness, and humor to survive.",
    rating: 4.7,
    featured: false,
    isPromo: false,
    coverColor: "bg-red-950",
    coverPattern: "circle",
    coverImages: [
      "/images/science fiction/The Martian (Andy Weir).jpg"
    ],
    reviews: []
  },
  {
    id: "s3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    price: 880,
    description: "An incredible interstellar science adventure about a lone surviving astronaut trying to save humanity alongside an unexpected alien friend.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-teal-950",
    coverPattern: "lines",
    coverImages: [
      "/images/science fiction/Project Hail Mary (Andy Weir).jpg"
    ],
    reviews: []
  },
  {
    id: "s5",
    title: "Foundation",
    author: "Isaac Asimov",
    category: "Science Fiction",
    price: 750,
    description: "The epic tale of Hari Seldon and his band of scientists seeking to shorten the inevitable dark age of the Galactic Empire.",
    rating: 4.8,
    featured: false,
    isPromo: false,
    coverColor: "bg-blue-900",
    coverPattern: "circle",
    coverImages: [
      "/images/science fiction/Foundation (Isaac Asimov).jpg"
    ],
    reviews: []
  },

  // FUNNY COMICS
  {
    id: "c1",
    title: "Garfield",
    author: "Jim Davis",
    category: "Funny Comics",
    price: 450,
    description: "The lazy, lasagna-loving, Monday-hating orange tabby cat in his legendary comic strip compilations.",
    rating: 4.6,
    featured: false,
    isPromo: false,
    coverColor: "bg-orange-800",
    coverPattern: "wave",
    coverImages: [
      "/images/comics/Garfield (Jim Davis).jpg"
    ],
    reviews: []
  },
  {
    id: "c2",
    title: "Calvin and Hobbes",
    author: "Bill Watterson",
    category: "Funny Comics",
    price: 650,
    description: "A magical collection featuring the adventures of Calvin, a precocious six-year-old, and Hobbes, his imaginary stuffed tiger.",
    rating: 4.9,
    featured: true,
    isPromo: false,
    coverColor: "bg-amber-700",
    coverPattern: "lines",
    coverImages: [
      "/images/comics/Calvin and Hobbes (Bill Watterson).jpg"
    ],
    reviews: []
  },
  {
    id: "c4",
    title: "Dilbert",
    author: "Scott Adams",
    category: "Funny Comics",
    price: 480,
    description: "The corporate cubicle-dweller's survival manual. Deeply cynical and incredibly hilarious satire on office life.",
    rating: 4.4,
    featured: false,
    isPromo: true,
    discountPrice: 400,
    coverColor: "bg-cyan-900",
    coverPattern: "minimal",
    coverImages: [
      "/images/comics/Dilbert (Scott Adams).jpg"
    ],
    reviews: []
  },
  {
    id: "c5",
    title: "Peanuts",
    author: "Charles M. Schulz",
    category: "Funny Comics",
    price: 520,
    description: "The bittersweet world of Charlie Brown, his loyal beagle Snoopy, and the neighborhood gang.",
    rating: 4.7,
    featured: false,
    isPromo: false,
    coverColor: "bg-yellow-700",
    coverPattern: "floral",
    coverImages: [
      "/images/comics/Peanuts (Charles M. Schulz).jpg"
    ],
    reviews: []
  }
];

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: "t1",
    contactName: "Saira (Customer Success)",
    contactRole: "Senior Literary Advisor",
    lastMessage: "I highly recommend Peer-e-Kamil if you love spiritual journey novels!",
    unreadCount: 1,
    messages: [
      { id: "m1", sender: "peer", text: "Welcome to Jeena Satr! I am your literary concierge.", timestamp: "10:30 AM" },
      { id: "m2", sender: "user", text: "Hello! I am looking for a deep Urdu novel.", timestamp: "10:31 AM" },
      { id: "m3", sender: "peer", text: "I highly recommend Peer-e-Kamil if you love spiritual journey novels!", timestamp: "10:32 AM" }
    ]
  },
  {
    id: "t2",
    contactName: "Ali (Order Logistics)",
    contactRole: "Fulfillment Coordinator",
    lastMessage: "Your order for 'Atomic Habits' has been packed and is ready to ship.",
    unreadCount: 0,
    messages: [
      { id: "m4", sender: "peer", text: "Hello, checking in on your shipping address.", timestamp: "Yesterday" },
      { id: "m5", sender: "user", text: "It is House 45-B, Sector G, Islamabad.", timestamp: "Yesterday" },
      { id: "m6", sender: "peer", text: "Perfect. Your order for 'Atomic Habits' has been packed and is ready to ship.", timestamp: "Yesterday" }
    ]
  },
  {
    id: "t3",
    contactName: "Book Exchange Peer-Group",
    contactRole: "Jeena Satr Community Club",
    lastMessage: "We are discussing '1984' in the evening reading circle today.",
    unreadCount: 0,
    messages: [
      { id: "m7", sender: "peer", text: "Hi everyone! Welcome to the weekly community thread.", timestamp: "3 days ago" },
      { id: "m8", sender: "peer", text: "We are discussing '1984' in the evening reading circle today.", timestamp: "2 days ago" }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "JS-90214",
    date: "2026-07-08",
    status: "delivered",
    items: [
      { bookId: "u1", title: "Peer-e-Kamil", author: "Umera Ahmed", price: 850, quantity: 1 }
    ],
    subtotal: 850,
    shipping: 150,
    total: 1000
  },
  {
    id: "JS-90482",
    date: "2026-07-10",
    status: "shipping",
    items: [
      { bookId: "m1", title: "Atomic Habits", author: "James Clear", price: 750, quantity: 1 },
      { bookId: "e3", title: "1984", author: "George Orwell", price: 500, quantity: 2 }
    ],
    subtotal: 1750,
    shipping: 150,
    total: 1900
  }
];

export const DJANGO_MODELS_CODE = `
# django_backend/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = (
        ('standard', 'Standard User'),
        ('admin', 'Platform Admin'),
    )
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='standard')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.role})"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    featured = models.BooleanField(default=False)
    is_promo = models.BooleanField(default=False)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    image_path = models.CharField(max_length=500, help_text="Path format: static/images/categories/<category_slug>/<filename>")
    stock = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.author}"


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.email}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    selected = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.title}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('ordered', 'Ordered'),
        ('shipping', 'Shipping'),
        ('delivered', 'Delivered'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ordered')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping = models.DecimalField(max_digits=5, decimal_places=2, default=150.00)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email} ({self.status})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.title} in #{self.order.id}"
`;

export const STATIC_IMAGES_FOLDERS_STRUCTURE = `
# Static Media & Images Assets Directory Blueprint
# Keep assets clean and strictly organized category-wise:

/static/
└── images/
    ├── brand/
    │   ├── logo_lineart.svg       # Premium line-art logo
    │   └── background_grain.png   # Subtle elegant texture
    └── categories/
        ├── urdu-novels/
        │   ├── peer_e_kamil.jpg
        │   ├── jannat_kay_pattay.jpg
        │   ├── abdullah.jpg
        │   └── namal.jpg ...
        ├── english-novels/
        │   ├── the_alchemist.jpg
        │   ├── to_kill_a_mockingbird.jpg
        │   └── 1984.jpg ...
        ├── motivational/
        │   ├── atomic_habits.jpg
        │   └── the_7_habits.jpg ...
        ├── science-fiction/
        │   ├── dune.jpg
        │   └── the_martian.jpg ...
        └── funny-comics/
            ├── garfield.jpg
            └── calvin_and_hobbes.jpg ...
`;

export const SYSTEM_ARCH_BLUEPRINT = `
# System Architectural Blueprint - "Jeena Satr" Bookstore
--------------------------------------------------------

1. Frontend Architecture (React SPA / Vite)
- Component Hierarchy:
  * App: Maintains global reactive state (User sessions, Shopping Cart, active page tabs, chats, and checkout orders).
  * Navigation Bar: Bottom sticky router with modern responsive states.
  * Pages:
    - SplashScreen (Intelligent delay transition)
    - Authentication (Tabbed user-role chooser & validator)
    - HomePage (Curated grids, scroll ticker, active search matching)
    - MessagesHub (Detailed Chats, active Order Tracker timelines, Deals)
    - CategoriesPage (Categorized view grids with responsive filtering)
    - ProductDetailPage (Image carousel, dynamic scroll reviews, instant Cart dispatcher)
    - ShoppingCart (Live multi-select itemized calculator with state synchronization)
    - AdminBlueprintViewer (Interactive live Django source inspector & structure navigator)

2. Backend Architecture (Django / Relational DB)
- Auth Flow: Email-based primary token matching; standard and admin permission sets.
- State Persistence:
  * Local Cart session cached in local db; converted to Order items on successful checkout confirmation.
  * Real-time notifications for shipping statuses updated dynamically by admin accounts.
`;

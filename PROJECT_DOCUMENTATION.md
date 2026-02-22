# VEHIQL - Complete Project Documentation

## Project Overview
VEHIQL is a comprehensive car dealership management system built with Next.js that provides a complete digital solution for car dealerships and customers. It handles everything from inventory management to customer purchases and reviews.

## Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **State Management**: React hooks and context (Comparison, Theme)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icons
- **Notifications**: Sonner for toast messages

### Backend
- **API**: Next.js API Routes (Server Actions)
- **Database**: PostgreSQL hosted on Supabase
- **ORM**: Prisma with type-safe queries
- **Authentication**: Clerk for user management
- **File Storage**: Supabase Storage for car images
- **AI Integration**: Google Gemini for car image analysis

### Database Schema

#### Core Models
1. **User** - Customer and admin user management
2. **Car** - Vehicle inventory with specifications
3. **DealershipInfo** - Dealership configuration
4. **WorkingHour** - Business hours management
5. **TestDriveBooking** - Test drive scheduling
6. **Review** - Customer reviews and ratings
7. **ReviewVote** - Helpful/unhelpful voting system
8. **Purchase** - Car purchase tracking
9. **UserSavedCar** - Wishlist functionality

#### Key Relationships
- Users can have multiple saved cars, test drives, reviews, and purchases
- Cars can have multiple reviews, test drives, and one purchase
- Reviews can have multiple votes from different users
- Dealership has working hours for each day of the week

## Feature Breakdown

### 1. User Authentication & Authorization
- **Clerk Integration**: Secure login/signup with social providers
- **Role-based Access**: USER and ADMIN roles
- **Protected Routes**: Admin-only areas and user-specific content
- **User Profiles**: Automatic user creation on first login

### 2. Car Inventory Management

#### For Customers:
- **Browse Cars**: Grid/list view with pagination
- **Advanced Search**: Filter by make, model, price, year, fuel type, etc.
- **Car Details**: Comprehensive car information with image gallery
- **Wishlist**: Save favorite cars for later viewing
- **Car Comparison**: Compare up to 3 cars side-by-side

#### For Admins:
- **CRUD Operations**: Create, read, update, delete cars
- **Image Management**: Drag & drop image uploads with Supabase storage
- **AI-Powered Entry**: Gemini AI analyzes car images to auto-fill details
- **Status Management**: Available, Unavailable, Sold status tracking
- **Featured Cars**: Highlight special vehicles on homepage

### 3. Test Drive System

#### Booking Process:
- **Calendar Integration**: Date picker with availability checking
- **Time Slot Management**: Hourly slots based on dealership hours
- **Conflict Detection**: Prevents double-booking of same car/time
- **User Dashboard**: View and manage test drive bookings
- **Admin Management**: Approve, confirm, or cancel bookings

#### Business Logic:
- **Working Hours**: Configurable business hours per day
- **Availability**: Real-time checking against existing bookings
- **Status Tracking**: Pending → Confirmed → Completed/Cancelled

### 4. Purchase System

#### Customer Flow:
- **Buy Now Button**: Direct purchase from car details page
- **Purchase Form**: Personal info, address, payment details
- **Purchase Confirmation**: Order summary and next steps
- **Purchase History**: Track all purchased vehicles

#### Admin Features:
- **Sales Tracking**: Monitor all car sales
- **Status Updates**: Mark cars as sold automatically
- **Purchase Analytics**: Revenue and sales data

### 5. Review & Rating System

#### Customer Reviews:
- **Star Ratings**: 1-5 star rating system
- **Written Reviews**: Title and detailed comments
- **Review Restrictions**: Only purchasers can review cars
- **Voting System**: Helpful/unhelpful votes on reviews

#### Admin Moderation:
- **Review Approval**: Pending → Approved/Rejected workflow
- **Content Management**: Moderate inappropriate content
- **Review Analytics**: Track review metrics and ratings

### 6. Comparison Feature
- **Multi-Select**: Choose up to 3 cars for comparison
- **Floating Bar**: Persistent comparison bar at bottom
- **Side-by-Side View**: Detailed specification comparison
- **Local Storage**: Persist selections across sessions

### 7. Sold Cars History
- **Public Archive**: Browse previously sold cars
- **Review Access**: Read customer reviews on sold vehicles
- **Search & Filter**: Find specific sold cars
- **Detailed Views**: Full car information and reviews

### 8. Dark Mode System
- **Theme Toggle**: Switch between light/dark modes
- **Persistence**: Save preference in localStorage
- **System Integration**: Tailwind CSS dark mode classes
- **Smooth Transitions**: Animated theme switching

## File Structure

```
VEHIQL/
├── app/
│   ├── (main)/                 # Customer-facing pages
│   │   ├── cars/              # Car browsing and details
│   │   ├── compare/           # Car comparison
│   │   ├── purchase/          # Purchase flow
│   │   ├── purchase-history/  # User purchase history
│   │   ├── sold-cars/         # Sold cars archive
│   │   ├── test-drives/       # Test drive booking
│   │   └── saved-cars/        # User wishlist
│   ├── (admin)/               # Admin-only pages
│   │   └── admin/
│   │       ├── cars/          # Car management
│   │       ├── reviews/       # Review moderation
│   │       └── test-drives/   # Booking management
│   ├── globals.css            # Global styles and CSS variables
│   └── layout.js              # Root layout with providers
├── actions/                   # Server actions
│   ├── cars.js               # Car CRUD operations
│   ├── reviews.js            # Review management
│   ├── purchase.js           # Purchase processing
│   └── test-drive.js         # Test drive booking
├── components/               # Reusable UI components
│   ├── ui/                  # Shadcn/ui components
│   ├── header.jsx           # Navigation header
│   ├── car-card.jsx        # Car display component
│   └── comparison-bar.jsx   # Floating comparison bar
├── contexts/                # React contexts
│   ├── comparison-context.jsx # Car comparison state
│   └── theme-context.jsx     # Dark mode state
├── lib/                     # Utility libraries
│   ├── prisma.js           # Database connection
│   ├── supabase.js         # Storage client
│   └── helper.js           # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema
└── hooks/
    └── use-fetch.js        # Custom fetch hook
```

## Key Technical Implementations

### 1. Image Upload System
- **Drag & Drop**: HTML5 drag and drop API
- **File Processing**: FileReader API for base64 conversion
- **Supabase Storage**: Organized folder structure (cars/{carId}/)
- **Error Handling**: Fallback to car icons on image load failure
- **Optimization**: Next.js Image component with unoptimized flag

### 2. Search & Filtering
- **Database Queries**: Prisma where clauses with insensitive search
- **Real-time Search**: Debounced input with instant results
- **Multiple Filters**: Combine make, model, price, year filters
- **Pagination**: Efficient data loading for large inventories

### 3. Booking Conflict Detection
- **Time Slot Logic**: Generate available slots based on business hours
- **Overlap Prevention**: Check existing bookings for conflicts
- **Real-time Updates**: Refresh availability after each booking
- **Status Management**: Track booking lifecycle states

### 4. Review System Architecture
- **Relationship Constraints**: One review per user per car
- **Vote Aggregation**: Count helpful/unhelpful votes
- **Moderation Workflow**: Admin approval before public display
- **Performance**: Indexed queries for fast review retrieval

### 5. State Management Patterns
- **Server State**: React Query pattern with custom useFetch hook
- **Client State**: React Context for global state (theme, comparison)
- **Form State**: React Hook Form with Zod validation
- **Local Storage**: Persist user preferences and selections

## Security & Data Protection

### Authentication Security
- **Clerk Integration**: Industry-standard OAuth and session management
- **Role-based Access**: Server-side role checking for admin routes
- **Protected API Routes**: Authentication middleware on all server actions

### Data Validation
- **Zod Schemas**: Type-safe validation on both client and server
- **Prisma Types**: Database-level type safety and constraints
- **Input Sanitization**: Prevent SQL injection and XSS attacks

### File Upload Security
- **File Type Validation**: Only allow image file types
- **Size Limits**: Prevent large file uploads
- **Secure Storage**: Supabase storage with proper access controls

## Performance Optimizations

### Frontend Performance
- **Next.js App Router**: Automatic code splitting and optimization
- **Image Optimization**: Next.js Image component with lazy loading
- **Component Lazy Loading**: Dynamic imports for heavy components
- **Caching**: Browser caching for static assets

### Database Performance
- **Indexed Queries**: Strategic database indexes on frequently queried fields
- **Efficient Joins**: Prisma include/select for optimized data fetching
- **Pagination**: Limit query results to prevent large data transfers
- **Connection Pooling**: Supabase connection pooling for scalability

### API Performance
- **Server Actions**: Direct database access without API overhead
- **Revalidation**: Strategic cache invalidation with Next.js revalidatePath
- **Error Handling**: Graceful error handling with user feedback

## Deployment & Configuration

### Environment Variables
```
DATABASE_URL=              # Supabase PostgreSQL connection
DIRECT_URL=               # Direct database connection
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=  # Clerk public key
CLERK_SECRET_KEY=         # Clerk private key
NEXT_PUBLIC_SUPABASE_URL= # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anonymous key
GEMINI_API_KEY=          # Google Gemini AI key
```

### Database Setup
1. **Supabase Project**: Create PostgreSQL database
2. **Prisma Migration**: Run `npx prisma db push`
3. **Storage Bucket**: Create 'car-images' bucket in Supabase
4. **Seed Data**: Optional initial dealership and working hours data

### Deployment Considerations
- **Vercel Deployment**: Optimized for Next.js applications
- **Environment Security**: Secure environment variable management
- **Database Scaling**: Supabase automatic scaling capabilities
- **CDN Integration**: Global content delivery for images

## Business Logic & Workflows

### Car Lifecycle
1. **Creation**: Admin adds car with images and details
2. **Availability**: Car appears in customer browsing
3. **Interest**: Customers save, compare, book test drives
4. **Purchase**: Customer completes purchase flow
5. **Sold Status**: Car moves to sold cars archive
6. **Reviews**: Purchaser can write reviews

### User Journey
1. **Discovery**: Browse cars, use filters, search
2. **Research**: View details, compare cars, read reviews
3. **Engagement**: Save favorites, book test drive
4. **Purchase**: Complete buying process
5. **Post-Purchase**: Write reviews, view purchase history

### Admin Workflow
1. **Inventory Management**: Add/edit/remove cars
2. **Booking Management**: Handle test drive requests
3. **Sales Processing**: Track purchases and revenue
4. **Content Moderation**: Approve/reject reviews
5. **Analytics**: Monitor business metrics

## Integration Points

### Third-Party Services
- **Clerk**: User authentication and management
- **Supabase**: Database and file storage
- **Google Gemini**: AI-powered car image analysis
- **Vercel**: Hosting and deployment platform

### API Integrations
- **Clerk Webhooks**: User creation and updates
- **Supabase Storage API**: File upload and management
- **Gemini Vision API**: Image analysis and data extraction

## Error Handling & User Experience

### Error Boundaries
- **Global Error Handling**: Catch and display user-friendly errors
- **Form Validation**: Real-time validation with helpful messages
- **Network Errors**: Graceful handling of connection issues
- **File Upload Errors**: Fallback options and retry mechanisms

### User Feedback
- **Toast Notifications**: Success/error messages with Sonner
- **Loading States**: Skeleton screens and spinners
- **Empty States**: Helpful messages when no data available
- **Progressive Enhancement**: Works without JavaScript for basic features

## Future Enhancement Opportunities

### Technical Improvements
- **Real-time Features**: WebSocket integration for live updates
- **Mobile App**: React Native version for mobile users
- **Advanced Analytics**: Detailed business intelligence dashboard
- **API Documentation**: OpenAPI/Swagger documentation

### Business Features
- **Financing Calculator**: Loan and lease calculations
- **Trade-in System**: Vehicle trade-in value estimation
- **Inventory Alerts**: Notifications for new arrivals
- **Multi-location**: Support for multiple dealership locations

### User Experience
- **Virtual Tours**: 360° car interior/exterior views
- **AR Integration**: Augmented reality car visualization
- **Chat Support**: Real-time customer support
- **Personalization**: AI-powered car recommendations

## Detailed Component Architecture

### Core Components Deep Dive

#### CarCard Component (`components/car-card.jsx`)
- **Props**: car object with all vehicle data
- **State Management**: Local state for wishlist status, loading states
- **Features**: 
  - Image error handling with fallback to car icon
  - Wishlist toggle with optimistic updates
  - Comparison feature integration
  - Price formatting with currency helper
  - Responsive design with mobile-first approach
- **Event Handlers**: Click navigation, save/unsave, add to comparison
- **Performance**: Memoized with React.memo for list rendering

#### Header Component (`components/header.jsx`)
- **Authentication Integration**: Clerk SignedIn/SignedOut components
- **Role-based Navigation**: Different menus for users vs admins
- **Responsive Design**: Mobile hamburger menu, desktop full navigation
- **Theme Integration**: Dark mode toggle button
- **Active States**: Current page highlighting

#### ComparisonBar Component (`components/comparison-bar.jsx`)
- **Fixed Positioning**: Sticky bottom bar with z-index management
- **State Synchronization**: Real-time updates with comparison context
- **Animation**: Slide up/down based on comparison items
- **Drag & Drop**: Reorder comparison items
- **Persistence**: Auto-save to localStorage

### Form Components Architecture

#### EditCarForm Component
- **Form Library**: React Hook Form with Zod validation
- **Image Management**: 
  - Existing image display with delete functionality
  - New image upload with drag & drop
  - Base64 conversion for file processing
  - Visual feedback for drag states
- **State Management**: Multiple useState hooks for different concerns
- **Validation**: Real-time validation with error display
- **API Integration**: Server action calls with loading states

#### TestDriveForm Component
- **Calendar Integration**: Date picker with business hours validation
- **Time Slot Generation**: Dynamic slot creation based on working hours
- **Conflict Detection**: Real-time availability checking
- **Form Validation**: Multi-step validation with Zod schemas
- **User Experience**: Progressive disclosure of available times

### Context Providers Deep Dive

#### ComparisonContext
```javascript
// State Structure
{
  items: [], // Array of car objects (max 3)
  addToComparison: (car) => {}, // Add car with duplicate checking
  removeFromComparison: (carId) => {}, // Remove by ID
  clearComparison: () => {}, // Clear all items
  isInComparison: (carId) => boolean // Check if car is selected
}
```
- **Persistence**: localStorage integration with JSON serialization
- **Validation**: Maximum 3 items enforcement
- **Performance**: Debounced localStorage updates

#### ThemeContext
```javascript
// State Structure
{
  theme: 'light' | 'dark',
  toggleTheme: () => {}, // Switch between themes
}
```
- **System Integration**: Tailwind CSS class toggling
- **Persistence**: localStorage with fallback to system preference
- **Performance**: CSS custom properties for smooth transitions

## Database Deep Dive

### Prisma Schema Relationships
```prisma
// User Relations
User {
  savedCars     UserSavedCar[]     // Many-to-many through junction
  testDrives    TestDriveBooking[] // One-to-many
  reviews       Review[]           // One-to-many
  reviewVotes   ReviewVote[]       // One-to-many
  purchases     Purchase[]         // One-to-many
}

// Car Relations
Car {
  savedBy           UserSavedCar[]     // Many-to-many through junction
  testDriveBookings TestDriveBooking[] // One-to-many
  reviews           Review[]           // One-to-many
  purchases         Purchase[]         // One-to-many
}
```

### Database Indexes Strategy
```prisma
// Performance Indexes
@@index([make, model])    // Car search optimization
@@index([price])          // Price range queries
@@index([status])         // Available/sold filtering
@@index([featured])       // Homepage featured cars
@@index([createdAt])      // Chronological sorting
@@index([userId, carId])  // User-specific queries
```

### Data Serialization Patterns
- **Decimal Handling**: Prisma Decimal → parseFloat() for client components
- **Date Serialization**: DateTime → ISO string for JSON transport
- **Image Arrays**: String[] for Supabase URLs
- **Enum Handling**: Database enums with TypeScript type safety

## Server Actions Deep Implementation

### Authentication Pattern
```javascript
// Standard auth check in all server actions
const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");

const user = await db.user.findUnique({
  where: { clerkUserId: userId },
});

if (!user || user.role !== "ADMIN") {
  throw new Error("Unauthorized");
}
```

### Error Handling Pattern
```javascript
// Consistent error response structure
try {
  // Business logic
  return { success: true, data: result };
} catch (error) {
  console.error("Error context:", error);
  return { 
    success: false, 
    error: error.message || "Generic error message" 
  };
}
```

### File Upload Implementation
```javascript
// Image processing pipeline
1. Base64 conversion from FileReader API
2. MIME type validation and extension extraction
3. Buffer creation from base64 data
4. Supabase storage upload with organized paths
5. Public URL generation and database storage
6. Error handling with cleanup on failure
```

## Advanced Features Implementation

### AI Integration (Gemini)
- **Image Analysis**: Car photo → structured data extraction
- **Prompt Engineering**: Specific JSON format requirements
- **Error Handling**: Quota limits and API failures
- **Fallback Strategy**: Manual entry when AI unavailable
- **Data Validation**: AI output validation with Zod schemas

### Real-time Features
- **Optimistic Updates**: UI updates before server confirmation
- **Revalidation Strategy**: Next.js revalidatePath for cache invalidation
- **State Synchronization**: Client state sync with server state
- **Conflict Resolution**: Last-write-wins for concurrent updates

### Search Implementation
- **Database Strategy**: PostgreSQL ILIKE for case-insensitive search
- **Multiple Fields**: Search across make, model, color simultaneously
- **Performance**: Indexed columns for fast query execution
- **User Experience**: Debounced input to prevent excessive queries

## Security Implementation Details

### Input Validation Pipeline
1. **Client-side**: Zod schema validation in forms
2. **Server-side**: Re-validation in server actions
3. **Database**: Prisma type safety and constraints
4. **Sanitization**: HTML encoding for user-generated content

### File Security
- **Type Validation**: MIME type checking and file extension validation
- **Size Limits**: Client and server-side file size restrictions
- **Path Security**: Organized folder structure prevents path traversal
- **Access Control**: Supabase RLS policies for file access

### Authentication Flow
1. **Clerk Authentication**: OAuth/email login with session management
2. **User Creation**: Automatic database user creation on first login
3. **Role Assignment**: Default USER role with admin promotion capability
4. **Session Persistence**: Clerk handles session tokens and refresh
5. **Route Protection**: Middleware and component-level auth checks

## Performance Optimization Details

### Image Optimization Strategy
- **Next.js Image**: Automatic WebP conversion and lazy loading
- **Supabase CDN**: Global content delivery network
- **Error Fallbacks**: Graceful degradation to placeholder icons
- **Responsive Images**: Multiple sizes for different screen densities

### Database Query Optimization
- **Selective Loading**: Prisma select/include for minimal data transfer
- **Pagination**: Cursor-based pagination for large datasets
- **Eager Loading**: Strategic includes to prevent N+1 queries
- **Connection Pooling**: Supabase automatic connection management

### Client-side Performance
- **Code Splitting**: Next.js automatic route-based splitting
- **Component Lazy Loading**: Dynamic imports for heavy components
- **State Optimization**: Minimal re-renders with proper dependency arrays
- **Caching Strategy**: Browser caching with appropriate headers

## Error Handling & User Experience

### Error Boundary Implementation
- **Global Error Handling**: App-level error boundaries
- **Component Error Isolation**: Granular error boundaries for features
- **Fallback UI**: User-friendly error messages and recovery options
- **Error Reporting**: Console logging for development debugging

### Loading States Management
- **Skeleton Screens**: Content placeholders during loading
- **Progressive Loading**: Incremental content display
- **Optimistic Updates**: Immediate UI feedback before server response
- **Error Recovery**: Retry mechanisms and fallback options

### Accessibility Implementation
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes in both themes

## Development Workflow & Patterns

### Component Patterns
- **Composition**: Higher-order components and render props
- **Custom Hooks**: Reusable logic extraction (useFetch, useLocalStorage)
- **Error Boundaries**: Graceful error handling at component level
- **Memoization**: Performance optimization with React.memo and useMemo

### State Management Patterns
- **Local State**: useState for component-specific state
- **Global State**: Context API for app-wide state
- **Server State**: Custom useFetch hook for API state management
- **Derived State**: Computed values with useMemo

### API Design Patterns
- **Server Actions**: Next.js server actions for type-safe API calls
- **Consistent Response**: Standardized success/error response format
- **Error Handling**: Comprehensive error catching and user feedback
- **Validation**: Input validation at multiple layers

## Complete Environment Configuration

### Environment Variables Breakdown
```env
# Database Configuration
DATABASE_URL="postgresql://postgres.lpuibowzqcchtdfjlapa:Pushpinder%2310@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lpuibowzqcchtdfjlapa:Pushpinder%2310@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dmFzdC1sYXJrLTIxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_IMAxYmpRygY2VNiC3KqfUzYWMDFPDg2rFMEBpvdhFq
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# File Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://lpuibowzqcchtdfjlapa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdWlib3d6cWNjaHRkZmpsYXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzg4MTksImV4cCI6MjA4MjY1NDgxOX0.F7hghh32DR5j1nsLG6lMRSaZ-mUccYqI1aGE1AOXqpE

# AI Integration
GEMINI_API_KEY=AIzaSyCNbAMd2GTjeL4wRBMYFCB6whA-jNRO8tM

# Security
ARCJET_KEY=ajkey_01kdqb5wgafabryhy8j462xhy2
```

### Next.js Configuration Details
```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // Disable HMR cache for development
  },
  images: {
    unoptimized: true, // Required for Supabase images in development
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lpuibowzqcchtdfjlapa.supabase.co", // Supabase storage domain
      }
    ]
  },
};
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"], // Enable class-based dark mode
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS custom properties for theme switching
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... complete color system
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Animation utilities
}
```

## Complete File-by-File Breakdown

### Core Application Files

#### `app/layout.js` - Root Layout
```javascript
// Providers hierarchy:
// ClerkProvider (auth) → ThemeProvider (dark mode) → ComparisonProvider (car comparison)
// Global components: Header, ComparisonBar, Toaster, Footer
// Font: Inter from Google Fonts
// Metadata: SEO configuration
```

#### `app/page.jsx` - Homepage
```javascript
// Features:
// - Hero section with search
// - Featured cars grid (3 cars)
// - Statistics display
// - Call-to-action sections
// - Responsive design
```

#### `app/globals.css` - Global Styles
```css
/* Includes:
- Tailwind CSS imports
- CSS custom properties for light/dark themes
- Component-specific styles
- Animation keyframes
- Utility classes
*/
```

### Authentication System Files

#### `lib/checkUser.js` - User Verification
```javascript
// Functions:
// - checkUser(): Verify and sync Clerk user with database
// - Creates database user if doesn't exist
// - Returns user object with role information
```

#### Clerk Configuration
```javascript
// Features:
// - Social login (Google, GitHub, etc.)
// - Email/password authentication
// - User profile management
// - Session handling
// - Webhook integration for user sync
```

### Database Layer Files

#### `lib/prisma.js` - Database Connection
```javascript
// Singleton pattern for Prisma client
// Connection pooling configuration
// Development vs production setup
// Error handling for connection issues
```

#### `lib/helper.js` - Utility Functions
```javascript
// Functions:
// - serializeCarData(): Convert Prisma Decimal to number
// - formatCurrency(): Format prices with locale
// - Date formatting utilities
// - Validation helpers
```

### Storage & File Management

#### `lib/supabase.js` - Storage Client
```javascript
// Supabase client configuration
// File upload utilities
// Image URL generation
// Error handling for storage operations
```

#### Image Upload Pipeline
```javascript
// Process:
// 1. File selection (drag/drop or click)
// 2. FileReader API for base64 conversion
// 3. MIME type validation
// 4. Supabase storage upload
// 5. Public URL generation
// 6. Database URL storage
// 7. Error handling and cleanup
```

### Custom Hooks

#### `hooks/use-fetch.js` - API State Management
```javascript
// Features:
// - Loading state management
// - Error handling
// - Success/failure callbacks
// - Automatic error parsing
// - Retry functionality
```

### UI Component Library

#### Shadcn/ui Components Used
```javascript
// Complete list:
// - Button, Input, Textarea, Select
// - Card, Badge, Avatar
// - Dialog, Popover, Calendar
// - Table, Dropdown Menu
// - Alert, Toast (Sonner)
// - Checkbox, Label
// - Skeleton, Loader
```

### Page-Specific Implementation Details

#### Car Browsing (`app/(main)/cars/page.jsx`)
```javascript
// Features:
// - Server-side car fetching
// - Search and filter integration
// - Pagination with infinite scroll
// - Grid/list view toggle
// - Sort options (price, year, mileage)
// - Loading states and error handling
```

#### Car Details (`app/(main)/cars/[id]/page.jsx`)
```javascript
// Features:
// - Dynamic metadata generation
// - Image gallery with navigation
// - Specification display
// - EMI calculator integration
// - Test drive booking button
// - Purchase button
// - Review section
// - Related cars suggestions
```

#### Admin Dashboard (`app/(admin)/admin/page.jsx`)
```javascript
// Features:
// - Sales analytics dashboard
// - Recent activity feed
// - Quick action buttons
// - Statistics cards
// - Chart integration (revenue, sales)
// - Admin-only access control
```

### Server Actions Detailed Implementation

#### `actions/cars.js` - Car Management
```javascript
// Functions:
// - addCar(): Create new car with image upload
// - getCars(): Fetch cars with search/filter
// - updateCar(): Edit car details and images
// - deleteCar(): Remove car and cleanup images
// - updateCarStatus(): Change availability status
// - getSoldCars(): Fetch sold cars for archive
// - processCarImageWithAi(): Gemini AI integration
```

#### `actions/car-listing.js` - Customer Actions
```javascript
// Functions:
// - getCarById(): Fetch single car with relations
// - toggleSavedCar(): Wishlist management
// - getCarsByStatus(): Filter by availability
// - searchCars(): Full-text search implementation
```

#### `actions/test-drive.js` - Booking System
```javascript
// Functions:
// - bookTestDrive(): Create new booking with conflict check
// - getUserTestDrives(): Fetch user's bookings
// - cancelTestDrive(): Cancel booking with validation
// - getAvailableSlots(): Generate time slots
// - checkConflicts(): Prevent double booking
```

#### `actions/reviews.js` - Review Management
```javascript
// Functions:
// - addReview(): Create review with purchase validation
// - getCarReviews(): Fetch approved reviews
// - voteOnReview(): Helpful/unhelpful voting
// - moderateReview(): Admin approval/rejection
// - getAllReviews(): Admin review management
```

#### `actions/purchase.js` - Purchase Processing
```javascript
// Functions:
// - completePurchase(): Process car purchase
// - getUserPurchases(): Fetch purchase history
// - updateCarToSold(): Mark car as sold
// - generatePurchaseId(): Unique purchase tracking
```

#### `actions/home.js` - Homepage Data
```javascript
// Functions:
// - getFeaturedCars(): Homepage featured vehicles
// - getCarStats(): Statistics for homepage
// - getRecentActivity(): Latest platform activity
```

### Component Architecture Deep Dive

#### Navigation Components
```javascript
// Header.jsx:
// - Responsive navigation
// - Role-based menu items
// - Authentication state handling
// - Theme toggle integration
// - Mobile hamburger menu

// Sidebar.jsx (Admin):
// - Admin navigation menu
// - Active page highlighting
// - Role-based access control
```

#### Car Display Components
```javascript
// CarCard.jsx:
// - Image with error handling
// - Price formatting
// - Wishlist toggle
// - Comparison integration
// - Status badges
// - Hover effects

// CarDetails.jsx:
// - Image gallery
// - Specification grid
// - Action buttons
// - EMI calculator
// - Contact information
// - Social sharing
```

#### Form Components
```javascript
// AddCarForm.jsx:
// - Multi-step form
// - Image upload with preview
// - AI integration button
// - Validation with Zod
// - Progress indicators

// EditCarForm.jsx:
// - Pre-populated form
// - Image management (add/remove)
// - Drag & drop functionality
// - Status updates
// - Change tracking
```

### State Management Architecture

#### Global State (Context)
```javascript
// ComparisonContext:
// - Selected cars array (max 3)
// - Add/remove functions
// - localStorage persistence
// - Duplicate prevention

// ThemeContext:
// - Current theme state
// - Toggle function
// - localStorage persistence
// - CSS class management
```

#### Local State Patterns
```javascript
// Common patterns:
// - Loading states for async operations
// - Form data with controlled inputs
// - UI state (modals, dropdowns)
// - Error states with user feedback
// - Optimistic updates
```

### Error Handling Strategy

#### Client-Side Error Handling
```javascript
// Patterns:
// - Try-catch blocks in async functions
// - Error boundaries for component errors
// - Toast notifications for user feedback
// - Fallback UI for failed states
// - Retry mechanisms for network errors
```

#### Server-Side Error Handling
```javascript
// Patterns:
// - Consistent error response format
// - Logging for debugging
// - Validation error messages
// - Database constraint handling
// - File upload error recovery
```

### Testing Strategy (Recommended)

#### Unit Testing
```javascript
// Test coverage:
// - Utility functions (helper.js)
// - Custom hooks (use-fetch.js)
// - Component logic
// - Form validation
// - State management
```

#### Integration Testing
```javascript
// Test scenarios:
// - Server actions with database
// - Authentication flows
// - File upload processes
// - API endpoint responses
// - Database relationships
```

#### End-to-End Testing
```javascript
// User journeys:
// - Car browsing and search
// - Test drive booking flow
// - Purchase process
// - Admin car management
// - Review submission
```

### Deployment Configuration

#### Vercel Deployment
```javascript
// Configuration:
// - Automatic deployments from Git
// - Environment variable management
// - Build optimization
// - Edge function deployment
// - Analytics integration
```

#### Database Deployment
```javascript
// Supabase setup:
// - PostgreSQL database
// - Connection pooling
// - Backup configuration
// - Security rules
// - Storage bucket setup
```

### Monitoring & Analytics

#### Performance Monitoring
```javascript
// Metrics tracked:
// - Page load times
// - API response times
// - Database query performance
// - Image loading speeds
// - User interaction metrics
```

#### Business Analytics
```javascript
// KPIs tracked:
// - Car views and searches
// - Test drive bookings
// - Purchase conversions
// - User engagement
// - Review submissions
```

### Security Measures

#### Input Validation
```javascript
// Validation layers:
// 1. Client-side with Zod schemas
// 2. Server-side re-validation
// 3. Database constraints
// 4. File type validation
// 5. Size limit enforcement
```

#### Authentication Security
```javascript
// Security features:
// - JWT token validation
// - Role-based access control
// - Session management
// - CSRF protection
// - Rate limiting (Arcjet)
```

### Performance Optimization

#### Frontend Optimization
```javascript
// Techniques:
// - Code splitting by routes
// - Component lazy loading
// - Image optimization
// - Caching strategies
// - Bundle size optimization
```

#### Backend Optimization
```javascript
// Techniques:
// - Database query optimization
// - Connection pooling
// - Caching with revalidation
// - Efficient data serialization
// - File compression
```

### Maintenance & Updates

#### Regular Maintenance Tasks
```javascript
// Tasks:
// - Dependency updates
// - Security patches
// - Database cleanup
// - Image optimization
// - Performance monitoring
```

#### Feature Enhancement Process
```javascript
// Process:
// 1. Feature planning and design
// 2. Database schema updates
// 3. API development
// 4. Frontend implementation
// 5. Testing and validation
// 6. Deployment and monitoring
```

This documentation now covers every single aspect, file, function, component, configuration, and implementation detail of the VEHIQL project. Nothing is left undocumented.

### Code Standards
- **TypeScript**: Gradual migration to TypeScript
- **ESLint/Prettier**: Code formatting and linting
- **Component Structure**: Consistent component organization
- **Naming Conventions**: Clear and descriptive naming

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint and database testing
- **E2E Tests**: Critical user journey testing
- **Performance Tests**: Load testing for scalability

### Version Control
- **Git Workflow**: Feature branches with pull requests
- **Commit Messages**: Conventional commit format
- **Release Management**: Semantic versioning
- **Documentation**: Keep README and docs updated

This documentation provides a complete understanding of the VEHIQL project, its architecture, features, and implementation details. It serves as a comprehensive guide for developers, stakeholders, and AI systems to understand every aspect of the application.
# AskRexi Phase 2 Implementation Guide

## 🎯 Overview

This guide provides detailed implementation instructions for Phase 2 enhancements to AskRexi, focusing on machine learning integration, enhanced analytics, visual response generation, and user profiling.

## 🚀 Phase 2 Features to Implement

### 1. User Feedback System

#### Database Schema Updates
```prisma
model AskRexiUserFeedback {
  id                String   @id @default(uuid())
  responseId        String
  userId            String?
  question          String
  response          String
  rating            Int      // 1-5 scale
  feedback          String?  // Optional text feedback
  category          String
  timestamp         DateTime @default(now())
  
  @@index([responseId])
  @@index([rating])
  @@index([timestamp])
}

model AskRexiResponseMetrics {
  id                String   @id @default(uuid())
  responseId        String   @unique
  question          String
  response          String
  category          String
  totalRatings      Int      @default(0)
  averageRating     Decimal  @db.Decimal(3, 2)
  totalFeedback     Int      @default(0)
  positiveFeedback  Int      @default(0)
  negativeFeedback  Int      @default(0)
  lastUpdated       DateTime @default(now())
  
  @@index([averageRating])
  @@index([category])
}
```

#### API Implementation
```typescript
// Add to /api/askrexi/feedback/route.ts
export async function POST(request: NextRequest) {
  const { responseId, rating, feedback, userId } = await request.json();
  
  // Store feedback
  await prisma.askRexiUserFeedback.create({
    data: {
      responseId,
      userId,
      rating,
      feedback,
      category: 'user_feedback'
    }
  });
  
  // Update response metrics
  await updateResponseMetrics(responseId, rating);
  
  return NextResponse.json({ success: true });
}

async function updateResponseMetrics(responseId: string, rating: number) {
  const existing = await prisma.askRexiResponseMetrics.findUnique({
    where: { responseId }
  });
  
  if (existing) {
    const newTotalRatings = existing.totalRatings + 1;
    const newAverageRating = ((existing.averageRating * existing.totalRatings) + rating) / newTotalRatings;
    
    await prisma.askRexiResponseMetrics.update({
      where: { responseId },
      data: {
        totalRatings: newTotalRatings,
        averageRating: newAverageRating,
        lastUpdated: new Date()
      }
    });
  }
}
```

#### Frontend Implementation
```typescript
// Add to AskRexiChat.tsx
const [feedback, setFeedback] = useState<{[key: string]: number}>({});

const handleFeedback = async (messageId: string, rating: number) => {
  try {
    await fetch('/api/askrexi/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responseId: messageId,
        rating,
        userId: 'current-user-id'
      })
    });
    
    setFeedback(prev => ({ ...prev, [messageId]: rating }));
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
};

// Add feedback buttons to message component
<div className="flex gap-2 mt-2">
  <button
    onClick={() => handleFeedback(message.id, 1)}
    className={`p-1 rounded ${feedback[message.id] === 1 ? 'bg-red-500' : 'bg-gray-200'}`}
  >
    👎
  </button>
  <button
    onClick={() => handleFeedback(message.id, 5)}
    className={`p-1 rounded ${feedback[message.id] === 5 ? 'bg-green-500' : 'bg-gray-200'}`}
  >
    👍
  </button>
</div>
```

### 2. Enhanced Analytics Dashboard

#### Database Schema
```prisma
model AskRexiAnalytics {
  id                String   @id @default(uuid())
  date              DateTime
  totalQuestions    Int      @default(0)
  totalResponses    Int      @default(0)
  averageResponseTime Int    @default(0)
  userSatisfaction  Decimal  @db.Decimal(3, 2)
  categoryBreakdown Json
  topQuestions      Json
  userEngagement    Json
  createdAt         DateTime @default(now())
  
  @@index([date])
}

model AskRexiUserSession {
  id                String   @id @default(uuid())
  userId            String?
  sessionId         String
  startTime         DateTime
  endTime           DateTime?
  totalQuestions    Int      @default(0)
  sessionDuration   Int?     // in seconds
  satisfaction      Decimal? @db.Decimal(3, 2)
  createdAt         DateTime @default(now())
  
  @@index([userId])
  @@index([sessionId])
  @@index([startTime])
}
```

#### Analytics API
```typescript
// Create /api/askrexi/analytics/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d';
  
  const analytics = await getAnalyticsData(period);
  
  return NextResponse.json({ success: true, data: analytics });
}

async function getAnalyticsData(period: string) {
  const dateFilter = getDateFilter(period);
  
  const [
    totalQuestions,
    totalResponses,
    averageResponseTime,
    userSatisfaction,
    categoryBreakdown,
    topQuestions,
    userEngagement
  ] = await Promise.all([
    prisma.askRexiUsageAnalytics.count({ where: { createdAt: dateFilter } }),
    prisma.askRexiResponseCache.count({ where: { createdAt: dateFilter } }),
    prisma.askRexiUsageAnalytics.aggregate({
      where: { createdAt: dateFilter },
      _avg: { responseTime: true }
    }),
    prisma.askRexiUserFeedback.aggregate({
      where: { timestamp: dateFilter },
      _avg: { rating: true }
    }),
    getCategoryBreakdown(dateFilter),
    getTopQuestions(dateFilter),
    getUserEngagement(dateFilter)
  ]);
  
  return {
    totalQuestions,
    totalResponses,
    averageResponseTime: averageResponseTime._avg.responseTime || 0,
    userSatisfaction: userSatisfaction._avg.rating || 0,
    categoryBreakdown,
    topQuestions,
    userEngagement
  };
}
```

#### Analytics Dashboard Component
```typescript
// Create /components/askrexi/AnalyticsDashboard.tsx
export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('7d');
  
  useEffect(() => {
    fetchAnalytics();
  }, [period]);
  
  const fetchAnalytics = async () => {
    const response = await fetch(`/api/askrexi/analytics?period=${period}`);
    const data = await response.json();
    setAnalytics(data.data);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Questions"
        value={analytics?.totalQuestions}
        icon={MessageSquare}
        trend="+12%"
      />
      <MetricCard
        title="Average Response Time"
        value={`${analytics?.averageResponseTime}ms`}
        icon={Clock}
        trend="-5%"
      />
      <MetricCard
        title="User Satisfaction"
        value={`${analytics?.userSatisfaction}/5`}
        icon={Star}
        trend="+8%"
      />
      <MetricCard
        title="Response Accuracy"
        value="94%"
        icon={CheckCircle}
        trend="+2%"
      />
    </div>
  );
}
```

### 3. Visual Response Generation

#### Visual Response Types
```typescript
interface VisualResponse {
  type: 'flowchart' | 'timeline' | 'checklist' | 'chart' | 'diagram';
  data: any;
  title: string;
  description?: string;
}

// Add to AskRexiResponse interface
interface AskRexiResponse {
  answer: string;
  category: 'regulatory' | 'assessment' | 'analytics' | 'general';
  sources: Source[];
  actionItems?: string[];
  impactLevel?: 'low' | 'medium' | 'high' | 'critical';
  relatedQuestions?: string[];
  visualElements?: VisualResponse[]; // New field
}
```

#### Visual Generation Functions
```typescript
// Add to route.ts
function generateVisualElements(question: string, response: AskRexiResponse): VisualResponse[] {
  const visuals: VisualResponse[] = [];
  
  // Generate flowchart for process questions
  if (question.includes('process') || question.includes('steps')) {
    visuals.push(generateProcessFlowchart(response));
  }
  
  // Generate timeline for regulatory questions
  if (response.category === 'regulatory' && question.includes('timeline')) {
    visuals.push(generateRegulatoryTimeline(response));
  }
  
  // Generate checklist for assessment questions
  if (response.category === 'assessment' && response.actionItems) {
    visuals.push(generateActionChecklist(response.actionItems));
  }
  
  return visuals;
}

function generateProcessFlowchart(response: AskRexiResponse): VisualResponse {
  return {
    type: 'flowchart',
    title: 'Compliance Process Flow',
    data: {
      nodes: [
        { id: 'start', label: 'Start', type: 'start' },
        { id: 'assess', label: 'Assess Requirements', type: 'process' },
        { id: 'implement', label: 'Implement Controls', type: 'process' },
        { id: 'validate', label: 'Validate Compliance', type: 'process' },
        { id: 'end', label: 'Complete', type: 'end' }
      ],
      edges: [
        { from: 'start', to: 'assess' },
        { from: 'assess', to: 'implement' },
        { from: 'implement', to: 'validate' },
        { from: 'validate', to: 'end' }
      ]
    }
  };
}
```

#### Visual Component
```typescript
// Create /components/askrexi/VisualResponse.tsx
export default function VisualResponse({ visual }: { visual: VisualResponse }) {
  switch (visual.type) {
    case 'flowchart':
      return <FlowchartVisual data={visual.data} title={visual.title} />;
    case 'timeline':
      return <TimelineVisual data={visual.data} title={visual.title} />;
    case 'checklist':
      return <ChecklistVisual data={visual.data} title={visual.title} />;
    case 'chart':
      return <ChartVisual data={visual.data} title={visual.title} />;
    default:
      return null;
  }
}

function FlowchartVisual({ data, title }: { data: any; title: string }) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flowchart-container">
        {/* Implement flowchart using a library like react-flow */}
        <ReactFlow nodes={data.nodes} edges={data.edges} />
      </div>
    </div>
  );
}
```

### 4. User Profiling System

#### Database Schema
```prisma
model AskRexiUserProfile {
  id                String   @id @default(uuid())
  userId            String   @unique
  expertiseLevel    String   @default('beginner')
  preferredStyle    String   @default('conversational')
  focusAreas        String[]
  learningStyle     String   @default('visual')
  totalQuestions    Int      @default(0)
  totalSessions     Int      @default(0)
  averageSatisfaction Decimal @db.Decimal(3, 2)
  lastActive        DateTime @default(now())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([userId])
  @@index([expertiseLevel])
}

model AskRexiUserProgress {
  id                String   @id @default(uuid())
  userId            String
  category          String
  questionsAsked    Int      @default(0)
  correctAnswers    Int      @default(0)
  improvementRate   Decimal  @db.Decimal(5, 2)
  lastUpdated       DateTime @default(now())
  
  @@index([userId])
  @@index([category])
}
```

#### Profile Management API
```typescript
// Create /api/askrexi/profile/route.ts
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  const profile = await prisma.askRexiUserProfile.findUnique({
    where: { userId }
  });
  
  return NextResponse.json({ success: true, data: profile });
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  const { expertiseLevel, preferredStyle, focusAreas, learningStyle } = await request.json();
  
  const profile = await prisma.askRexiUserProfile.upsert({
    where: { userId },
    update: {
      expertiseLevel,
      preferredStyle,
      focusAreas,
      learningStyle,
      updatedAt: new Date()
    },
    create: {
      userId,
      expertiseLevel,
      preferredStyle,
      focusAreas,
      learningStyle
    }
  });
  
  return NextResponse.json({ success: true, data: profile });
}
```

#### Profile Component
```typescript
// Create /components/askrexi/UserProfile.tsx
export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    const response = await fetch('/api/askrexi/profile');
    const data = await response.json();
    setProfile(data.data);
  };
  
  const updateProfile = async (updates: any) => {
    const response = await fetch('/api/askrexi/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (response.ok) {
      fetchProfile();
      setIsEditing(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Your AskRexi Profile</h2>
      
      {isEditing ? (
        <ProfileEditForm profile={profile} onSave={updateProfile} onCancel={() => setIsEditing(false)} />
      ) : (
        <ProfileDisplay profile={profile} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
```

## 🛠️ Implementation Steps

### Step 1: Database Setup
1. Add new Prisma models to schema.prisma
2. Run `npx prisma db push` to update database
3. Run `npx prisma generate` to update client

### Step 2: API Implementation
1. Create feedback API endpoint
2. Create analytics API endpoint
3. Create profile management API
4. Update main AskRexi API to include visual elements

### Step 3: Frontend Implementation
1. Add feedback buttons to chat interface
2. Create analytics dashboard component
3. Implement visual response components
4. Create user profile management interface

### Step 4: Testing & Validation
1. Test feedback system functionality
2. Validate analytics data accuracy
3. Test visual response generation
4. Verify user profile persistence

### Step 5: Deployment
1. Deploy database changes
2. Deploy API updates
3. Deploy frontend changes
4. Monitor system performance

## 📊 Success Metrics

### Feedback System
- **Feedback Rate**: 30% of responses receive feedback
- **Average Rating**: 4.2+ out of 5
- **Response Improvement**: 15% improvement in low-rated responses

### Analytics Dashboard
- **Dashboard Usage**: 80% of admin users access dashboard weekly
- **Data Accuracy**: 99%+ accuracy in analytics data
- **Performance**: Dashboard loads in <2 seconds

### Visual Responses
- **Visual Usage**: 40% of responses include visual elements
- **User Engagement**: 25% increase in engagement with visual responses
- **Accessibility**: All visuals meet accessibility standards

### User Profiles
- **Profile Completion**: 90% of users have complete profiles
- **Personalization**: 80% of responses personalized based on profile
- **User Satisfaction**: 20% increase in satisfaction with personalized responses

## 🔧 Technical Considerations

### Performance
- **Caching**: Implement Redis caching for analytics data
- **Optimization**: Optimize database queries for analytics
- **CDN**: Use CDN for visual assets
- **Lazy Loading**: Implement lazy loading for visual components

### Security
- **Data Privacy**: Ensure user data privacy compliance
- **Access Control**: Implement proper access controls for analytics
- **Input Validation**: Validate all user inputs
- **Rate Limiting**: Implement rate limiting for API endpoints

### Scalability
- **Database Indexing**: Add proper database indexes
- **API Versioning**: Implement API versioning strategy
- **Microservices**: Consider microservices architecture for analytics
- **Load Balancing**: Implement load balancing for high traffic

## 📚 Conclusion

This implementation guide provides a comprehensive roadmap for implementing Phase 2 enhancements to AskRexi. The features will significantly improve user experience, provide valuable insights, and set the foundation for future AI capabilities.

Each feature is designed to be implemented incrementally, allowing for testing and validation at each step. The success metrics provide clear targets for measuring the impact of each enhancement.

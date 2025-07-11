# MirrorMatch - B2B Dating Coaching Support Platform

MirrorMatch is a specialized B2B platform designed exclusively for dating and relationship coaches to enhance their client support capabilities. Unlike generic coaching platforms, MirrorMatch addresses the unique challenges dating coaches face: lack of client engagement between sessions, absence of dating-specific practice tools, and limited feedback collection systems for dating interactions.

## 🎯 Product Vision

**"MirrorMatch empowers dating coaches to deliver transformational client outcomes through specialized feedback collection, AI-powered practice sessions, and between-session engagement tools designed specifically for dating skill development."**

## 🚀 Key Features

### 1. Anonymous Feedback Collection System
- **Multi-source feedback**: Collect input from dates, friends, family, colleagues
- **Multilingual support**: Accept feedback in 20+ languages via DeepL API integration
- **Anonymous protection**: Voice modulation and text anonymization
- **Smart prompting**: Guided questions that encourage constructive, specific feedback
- **AI sentiment analysis**: Automatic filtering of harmful or abusive content
- **Coach dashboard**: Organized feedback summaries with actionable insights

### 2. AI-Powered Practice Platform
- **Scenario-based practice**: Pre-built scenarios (first dates, difficult conversations, rejection handling)
- **Personalized AI avatars**: Adapts to individual client needs based on feedback patterns
- **Real-time coaching**: In-session tips and suggestions during practice
- **Progress tracking**: Measure improvement in specific communication skills
- **Coach oversight**: Dashboard for coaches to monitor client practice

### 3. Between-Session Engagement Tools
- **Automated check-ins**: Customizable prompts sent via SMS/email
- **Reflection journals**: Guided prompts for client self-reflection
- **Goal tracking**: Visual progress indicators for dating-specific goals
- **Resource library**: Coach-curated content (articles, videos, exercises)
- **Challenge assignments**: Weekly micro-challenges to build confidence

### 4. Coach Integration Dashboard
- **Client progress overview**: Consolidated view of feedback, practice activity, and goal progress
- **Session preparation**: AI-generated insights and talking points for upcoming sessions
- **Communication tools**: Integration with Voxer for voice messaging
- **Calendar sync**: Works with existing scheduling systems
- **Report generation**: Automated progress reports for client reviews

## 🛠 Tech Stack

### Frontend
- **Framework**: React with Vite
- **UI Library**: Radix UI components with shadcn/ui
- **Styling**: Tailwind CSS with class-variance-authority
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Hosting**: Neon Database (serverless PostgreSQL)
- **Build Tool**: ESBuild for production builds

### Key Integrations
- **Whisper API**: Voice-to-text conversion (supports 99+ languages)
- **DeepL API**: Real-time translation for multilingual feedback
- **AssemblyAI**: Content moderation and sentiment analysis
- **Voxer Integration**: Voice messaging for coach-client communication
- **Calendar APIs**: Google Calendar, Outlook integration
- **SendGrid**: Email notifications and communications

## 🎯 Target Market

### Primary Users: Dating Coaches
- Professional dating/relationship coaches with 5-50 active clients
- Annual revenue: $50K-$300K+ from coaching services
- Seeking to improve client outcomes and differentiate their services

### Secondary Users: Coaching Clients
- Individuals working with dating coaches
- Ages 25-45, primarily urban professionals
- Tech-comfortable but need guided support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chengjiafeng857/coachMatch.git
   cd coachMatch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   cd sql
   ./setup_database.sh
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update database connection strings and API keys

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 📊 Database Structure

The application uses a PostgreSQL database with the following main tables:
- `users` - User authentication and basic profile data
- `coaches` - Coach-specific information and settings
- `clients` - Client profiles and coaching relationships
- `feedback` - Anonymous feedback collection system
- `practice_sessions` - AI avatar practice session data
- `check_ins` - Between-session engagement tracking
- `goals` - Client goal setting and progress tracking
- `notifications` - System notifications and alerts
- `sessions` - Coaching session records

### Database Setup

See the [SQL README](./sql/README.md) for detailed database setup instructions, including:
- Schema creation scripts
- Mock data population
- UML diagram generation
- Database connection guidelines

## 🔒 Security & Privacy

- **GDPR Compliance**: Full data sovereignty and user consent management
- **End-to-end encryption**: All sensitive communications and feedback
- **Data residency**: Regional storage based on user location
- **User control**: Complete data export and deletion capabilities
- **Anonymous feedback**: Voice modulation and identity protection

## 📱 User Interface

The platform features a clean, professional interface with:
- **Mobile-first design** for on-the-go access
- **Coach branding options** to maintain professional identity
- **WCAG 2.1 AA accessibility compliance**
- **Intuitive navigation** requiring minimal training

### Key Screens
- Coach Dashboard with client overview and feedback matrix
- Client management with engagement tracking
- Practice Hub for AI avatar sessions
- Analytics and progress reporting
- Feedback collection and review interfaces

## 🚀 Performance Targets

- **Dashboard loading**: < 2 seconds
- **Avatar sessions**: < 3 seconds to start
- **API error rate**: < 0.5% failed calls
- **Task success rate**: 95% users complete feedback requests in < 90 seconds

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



For questions, support, or business inquiries, please open an issue on GitHub.

---

*Empowering dating coaches to transform lives, one conversation at a time.*

# 🌱 EcoTrack AI - Smart Environment Dashboard

A modern, real-time IoT dashboard for monitoring environmental sensors powered by ESP32, Firebase, and AI-driven recommendations.

## 🚀 Features

- **Real-time Monitoring**: Live sensor data updates via Firebase Realtime Database
- **Smart AI Recommendations**: Intelligent insights for optimal comfort and energy efficiency
- **Historical Trends**: Interactive charts for temperature and humidity tracking
- **Manual Controls**: Override system with manual fan and AC controls
- **Responsive Design**: Beautiful UI that works on mobile and desktop
- **Color-coded Status**: Visual indicators for sensor health at a glance
- **System Status**: Online/offline detection with connection monitoring

## 📊 Dashboard Components

### Live Sensor Status

- **Temperature** (°C) - Real-time temperature monitoring
- **Humidity** (%) - Ambient moisture levels
- **Light Level** (%) - Room brightness detection
- **Occupancy** - Motion sensor for presence detection

### AI Insights

Intelligent recommendations based on:

- Current temperature and humidity
- Room occupancy
- Energy efficiency optimization
- Comfort level maintenance

### Historical Analysis

- Temperature trends over time
- Humidity patterns
- Configurable time ranges (1h / 6h / 24h)

### Control Panel

- System mode (AUTO / MANUAL)
- Fan control (ON / OFF / AUTO)
- AC temperature adjustment (16-30°C)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Realtime Database
- **Charts**: Custom SVG-based visualizations
- **Icons**: Heroicons (embedded SVG)

## 📁 Project Structure

```
ecotrackai-dashboard/
├── app/
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── Header.tsx         # Fixed header with status
│   ├── SensorStatusCard.tsx    # Reusable sensor card
│   ├── EnvironmentSummary.tsx  # Human-readable summary
│   ├── AIRecommendation.tsx    # AI insights section
│   ├── Charts.tsx         # Historical data charts
│   ├── ControlPanel.tsx   # Manual control interface
│   ├── Footer.tsx         # Dashboard footer
│   └── README.md          # Component documentation
├── lib/
│   └── firebase.ts        # Firebase configuration
├── types/
│   └── globals.d.ts       # TypeScript type definitions
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Realtime Database enabled
- ESP32 device (optional for local testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecotrackai-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   Update `lib/firebase.ts` with your Firebase credentials:

   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     databaseURL: "YOUR_DATABASE_URL",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the dashboard**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 Firebase Database Structure

Expected data structure at `EcoTrackAI/live`:

```json
{
  "temperature": 25.5,
  "humidity": 60,
  "light": 75,
  "motion": true
}
```

### ESP32 Integration

Your ESP32 should push data to Firebase at the path: `EcoTrackAI/live`

Example Arduino code structure:

```cpp
void sendToFirebase() {
  Firebase.setFloat(firebaseData, "/EcoTrackAI/live/temperature", temp);
  Firebase.setFloat(firebaseData, "/EcoTrackAI/live/humidity", hum);
  Firebase.setFloat(firebaseData, "/EcoTrackAI/live/light", light);
  Firebase.setBool(firebaseData, "/EcoTrackAI/live/motion", motion);
}
```

## 🎨 Customization

### Modifying Sensor Thresholds

Edit the status functions in [app/page.tsx](app/page.tsx):

```typescript
const getTemperatureStatus = (
  temp: number
): "normal" | "warning" | "critical" => {
  if (temp < 15 || temp > 30) return "critical";
  if (temp < 18 || temp > 28) return "warning";
  return "normal";
};
```

### Customizing AI Recommendations

Update the logic in [components/AIRecommendation.tsx](components/AIRecommendation.tsx):

```typescript
const getRecommendation = (): AIRecommendationData => {
  // Add your custom AI logic here
};
```

## 🔒 Security

- Firebase security rules should be configured to allow only authenticated reads/writes
- Never expose Firebase credentials in public repositories
- Use environment variables for production deployments

## 📝 Type Definitions

All TypeScript interfaces are defined in [types/globals.d.ts](types/globals.d.ts):

- `SensorData` - Current sensor readings
- `HistoricalDataPoint` - Time-series data
- `AIRecommendationData` - AI recommendation structure
- `ControlSettings` - Manual control settings

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add Firebase environment variables
4. Deploy

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- [ ] Machine Learning integration for predictive recommendations
- [ ] Historical data storage and analysis
- [ ] Email/SMS alerts for critical conditions
- [ ] Multi-room support
- [ ] User authentication and preferences
- [ ] Export data to CSV/PDF reports
- [ ] Mobile app (React Native)
- [ ] Voice control integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for smart home automation

---

**Note**: This dashboard is designed to be modular and extensible. Each component is documented in the [components/README.md](components/README.md) file.

# Simple Weather App

A Node.js weather application that displays current weather and time information for your location and major cities worldwide.

## Features

✅ Fetches current weather using OpenWeatherMap API  
✅ Detects user location based on IP address  
✅ Dropdown list of major cities (New York, London, Tokyo, Sydney, Paris, Dubai, Singapore, Los Angeles, Berlin, Mumbai)  
✅ Displays current time in Dublin and selected city  
✅ Responsive design for mobile and desktop  

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenWeatherMap API key:
   - Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - Copy `.env.example` to `.env`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

4. Start the application:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Configuration

The application uses the following environment variables:

- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required)
- `PORT`: Server port (default: 3000)

## Technologies Used

- **Node.js** with Express.js
- **OpenWeatherMap API** for weather data
- **IP-API** for geolocation
- **Moment-Timezone** for time handling
- **EJS** for server-side templating
- **CSS3** for styling

## Project Structure

```
weather-app/
├── app.js              # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables (create from .env.example)
├── .env.example       # Example environment file
├── views/
│   └── index.ejs      # Main page template
├── public/
│   ├── css/
│   │   └── style.css  # Styles
│   └── js/
│       └── app.js     # Frontend JavaScript
└── README.md          # This file
```

## Usage

1. The app automatically detects your location and shows local weather
2. Select any city from the dropdown to view its weather and time
3. Times update in real-time every second
4. Weather data includes temperature, description, humidity, wind, and pressure

## Deployment with Coolify

This project is ready for deployment with [Coolify](https://coolify.io/), a self-hosted alternative to Heroku.

### Prerequisites
- A Coolify server instance
- Git repository with your code
- OpenWeatherMap API key

### Deployment Steps

1. **Push to Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-git-repo-url>
   git push -u origin main
   ```

2. **Configure in Coolify**:
   - Create a new application in Coolify
   - Connect your Git repository
   - Set the following environment variables:
     - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
     - `PORT`: 3000 (or leave default)

3. **Deploy**:
   - Coolify will automatically detect the Dockerfile
   - Click "Deploy" to build and start your application

### Environment Variables for Coolify

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | Yes |
| `PORT` | Server port (default: 3000) | No |

### Docker Commands (for testing locally)

Build and run with Docker:
```bash
# Build the image
docker build -t weather-app .

# Run the container
docker run -p 3000:3000 -e OPENWEATHER_API_KEY=your_api_key weather-app
```

Or use Docker Compose:
```bash
# Copy environment variables
cp .env.example .env
# Edit .env with your API key

# Run with docker-compose
docker-compose up -d
```

## License

ISC
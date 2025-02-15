# Multi-Timer React Native App

## Overview
This is a React Native app that allows users to create, manage, and interact with multiple customizable timers. It includes features such as category grouping, progress visualization, bulk actions, and a history log. The app is designed for a clean UI/UX experience while maintaining minimal third-party dependencies.

## Features
### Core Features
- **Add Timer**
  - Users can create a new timer with:
    - Name (e.g., "Workout Timer").
    - Duration (in seconds).
    - Category (e.g., "Workout," "Study," "Break").
  - Timers are saved and persist locally using AsyncStorage.

- **Timer List with Grouping**
  - Timers are displayed in expandable/collapsible sections based on categories.
  - Each timer displays:
    - Name.
    - Remaining time.
    - Status (Running, Paused, or Completed).

- **Timer Management**
  - Start, Pause, and Reset timers individually.
  - Timers are marked as "Completed" when they reach zero.

- **Progress Visualization**
  - Each timer displays a progress bar to indicate the remaining time relative to the total duration.

- **Bulk Actions**
  - Users can start, pause, or reset all timers in a specific category.

- **User Feedback**
  - When a timer completes, a modal pops up with a congratulatory message.

### Enhanced Functionality
- **Timer History**
  - A separate "History" screen logs completed timers with:
    - Timer name.
    - Completion time.

### Technical Details
- **State Management:** `useState` for handling timers and categories.
- **Navigation:** React Navigation with at least two screens:
  1. Home Screen (Timer list and management).
  2. History Screen (Completed timers log).
- **Persistence:** AsyncStorage for storing timers and logs.
- **Styling:** React Native `StyleSheet` for responsive and clean UI.
- **Timers:** `setInterval` for countdown logic.

### Bonus Features (Optional)
- **Export Timer Data**
  - Users can export timer history as a JSON file.
- **Custom Themes**
  - Light and dark mode support with a theme switcher.
- **Category Filtering**
  - A dropdown filter to display timers of a selected category.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/CodeERAayush/TimerApp
   cd TimerApp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. Run the app:
   ```sh
   npx react-native run-android  # For Android
   npx react-native run-ios      # For iOS
   ```

## Assumptions
- The app runs on React Native and supports both Android and iOS.
- No backend is required; all data is stored locally via AsyncStorage.
- Minimal third-party dependencies are used for optimal performance.
- Timer accuracy is based on `setInterval`.
- Users interact with timers through a simple and intuitive UI.

## Project Structure
```
/TimerApp
│── /src
│   │── /components  # Reusable components (CategoryGroup, Timer, etc.)
│   │── /screens     # App screens (HomeScreen, HistoryScreen)
│   │── /utils       # Helper functions (storage)
│   │── /theme       # Theme Config (ThemeContext)
│   │── /library     # Independent Pure Components (Typography)
│   │── App.js       # Main entry point
│── package.json
│── README.md        # Project documentation
```

## Future Enhancements
- Push notifications for completed timers.
- Sound alerts for completion and halfway mark.
- Cloud synchronization.

## Author
Developed by Aayush Pandey.


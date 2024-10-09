![Project Status](https://img.shields.io/badge/status-on_hold-yellow)  
(On Hold until I can afford to deploy on ios 😅)

# **LiftLab - Stronger by Science Companion App**

LiftLab is a React Native workout tracking app designed to help users optimize their strength training routine, focusing on the three main powerlifting movements: **Squat, Bench Press**, and **Deadlift**. The app calculates and tracks your 1-rep max (1RM) for each lift, adjusts your workout targets, and helps guide your progression week by week. All credits to Stronger by Science as this is merely a companion app to their program.

## **Features**

-   **One Rep Max (1RM) Setup:**
    -   Users can input their squat, bench press, and deadlift 1RM during the initial setup.
    -   The app allows you to select a rounding option (2.5 lbs or 5 lbs) for calculated weights.
-   **Workout Progression:**

    -   The app dynamically adjusts target weights based on your performance. If you meet or exceed the rep targets, weights will automatically increase for the following week.
    -   If you miss targets, the weights will adjust accordingly, helping to ensure safe and sustainable progress.

-   **Progressive Weekly Tracking:**
    -   Navigate between weeks using simple arrow buttons, making it easy to track your workouts over time.
    -   Each week displays the calculated weights, target reps, and provides a repout target for each exercise.
-   **Mark Workouts as Complete:**

    -   Users can mark their workouts as complete, and the app will store this information for future reference. Workouts completed in previous weeks will adjust the starting weights for subsequent weeks.

-   **Workout Feedback:**

    -   Users can select whether they met or missed their rep target, and the app adjusts their future workouts accordingly.

-   **Persistent Storage with AsyncStorage:**

    -   All input values (1RMs, rounding preferences, workout completion, etc.) are stored locally on your device using AsyncStorage.
    -   This ensures that your workout data is saved even after you close the app, and you can resume where you left off.

-   **Safe Area and Keyboard Dismissal:**
    -   The UI is optimized with safe areas, ensuring compatibility with various screen sizes and devices.
    -   The keyboard automatically dismisses when users tap outside of the input fields, enhancing the user experience.

## **Screens**

### **1. Setup Screen**

<div align="center">
    <img src="https://github.com/user-attachments/assets/003334cb-0520-45b1-aa16-fa1e69e4379c" width="500px">
</div>

<hr/>
-   This screen allows users to input their current 1RM values for Squat, Bench Press, and Deadlift.
-   The user can select a rounding option (2.5 lbs or 5 lbs) for future weight calculations.
-   If values are already stored, they will be pre-populated upon re-opening the app or visiting the setup screen.

### **2. Workout Detail Screen**

<div align="center">
    <img src="https://github.com/user-attachments/assets/08cf730a-e908-41cf-b8e7-39e4cd0efc04" width="500px">
</div>

<hr/>
-   Displays detailed information for the current week's workout for Squat, Bench Press, and Deadlift.
-   Users can view their target weights, rep goals, and repout targets.
-   Allows users to mark whether they met or missed their rep goals, and this data will adjust future weights.
-   Workout sections for each lift are displayed, where users can check if they completed the workout or select their rep performance (e.g., "Beat Target" or "Missed Target").

## **Technologies Used**

-   **React Native**: The app is built using the React Native framework for cross-platform mobile development.
-   **Expo**: For quick development and testing on both Android and iOS platforms.
-   **UI Kitten**: For beautifully designed and customizable UI components.
-   **AsyncStorage**: To store data persistently on the device (1RM values, workout progress, etc.).
-   **TypeScript**: Provides strong typing, helping to catch errors during development and ensuring code quality.

## **How the App Works**

1. **Initial Setup:**

    - Upon launching the app, the user is directed to the setup screen to input their initial 1RM values for Squat, Bench, and Deadlift.
    - After saving, the app calculates the target weights for each lift based on the selected rounding option.

2. **Progress Tracking:**

    - Each week, the app calculates new target weights based on the user's performance in the previous week. If the user successfully completes the target reps or exceeds them, the weights increase.
    - If the user fails to meet the target, the app reduces the weight slightly to ensure manageable progress.

3. **Workout Completion:**
    - The user can mark each workout as complete and store their rep performance for Squat, Bench, and Deadlift.
    - This information is stored persistently and can be reviewed upon reopening the app.

## **Getting Started**

### **Prerequisites**

-   **Node.js** installed on your local machine.
-   **Expo CLI** installed globally using the command:

    ```bash
    npm install -g expo-cli

    git clone https://github.com/noelys215/liftlab.git
    cd liftlab

    npm install

    npx expo start
    ```

## **Acknowledgments**

-   **Stronger by Science**: This app is a companion to the powerlifting program developed by Stronger by Science. Their research-based training program inspired the development of this app to help users track and progress through their strength journey.
    https://www.strongerbyscience.com/program-bundle/
-   **UI Kitten**: For the amazing UI components.
-   **Expo**: For providing a simple yet powerful platform for building cross-platform apps.
-   **React Native Community**: For continued support and development of open-source tools and libraries.

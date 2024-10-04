import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { Layout, Text, Icon, IndexPath } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import WorkoutSection from '@/components/WorkoutSection';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { normalRepsPerWeek, repoutTarget } from '@/constants/intensities';
import { calculateWorkoutWeight } from '../utils/workoutHelpers';
import { handleComplete } from '../utils/workoutHandlers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutDetailScreen: React.FC = () => {
	const router = useRouter();
	const [week, setWeek] = useState<string>('1');
	const [showSetupMessage, setShowSetupMessage] = useState<boolean>(false);
	const [storageUpdated, setStorageUpdated] = useState<number>(Date.now());

	// Load the last selected week from AsyncStorage when the component mounts
	useEffect(() => {
		const loadLastWeek = async () => {
			try {
				const lastWeek = await AsyncStorage.getItem('currentWeek');
				if (lastWeek) setWeek(lastWeek);
			} catch (error) {
				console.error('Error loading last selected week', error);
			}
		};

		loadLastWeek();
	}, []);

	const [selectedReps, setSelectedReps] = useState<{ [key: string]: IndexPath }>({
		deadlift: new IndexPath(0),
		benchPress: new IndexPath(0),
		squat: new IndexPath(0),
	});

	const {
		squatMax,
		setSquatMax,
		benchMax,
		setBenchMax,
		deadliftMax,
		setDeadliftMax,
		rounding,
		isCompleted,
		setIsCompleted,
	} = useWorkoutData(week);

	// Check if max values are set and show the setup message if they are missing
	useEffect(() => {
		if (!squatMax || !benchMax || !deadliftMax) {
			setShowSetupMessage(true);
		} else {
			setShowSetupMessage(false);
		}
	}, [squatMax, benchMax, deadliftMax, storageUpdated]);

	// Monitor storageUpdated and reset flags
	useEffect(() => {
		const checkStorageUpdate = async () => {
			const updated = await AsyncStorage.getItem('storageUpdated');
			const reset = await AsyncStorage.getItem('reset');

			if (reset) {
				setShowSetupMessage(true);
				await AsyncStorage.removeItem('reset'); // Clear the reset flag
			} else if (updated) {
				setStorageUpdated(parseInt(updated));
			}
		};

		checkStorageUpdate();
	}, [storageUpdated]);

	const [previousMaxValues, setPreviousMaxValues] = useState<{ [lift: string]: number }>({});

	const handleCompleteWrapper = async (lift: string) => {
		await handleComplete({
			lift,
			week,
			isCompleted,
			setIsCompleted,
			selectedReps,
			setPreviousMaxValues,
			previousMaxValues,
			squatMax,
			benchMax,
			deadliftMax,
			setSquatMax,
			setBenchMax,
			setDeadliftMax,
		});
	};

	// Save the current week to AsyncStorage whenever it changes
	const saveCurrentWeek = async (newWeek: string) => {
		try {
			await AsyncStorage.setItem('currentWeek', newWeek);
		} catch (error) {
			console.error('Error saving current week', error);
		}
	};

	const goToNextWeek = () => {
		let nextWeek = parseInt(week) + 1;
		if (nextWeek <= 21) {
			setWeek(nextWeek.toString());
			saveCurrentWeek(nextWeek.toString());
			router.push(`./WorkoutDetailScreen?week=${nextWeek}`);
		}
	};

	const goToPreviousWeek = () => {
		let previousWeek = parseInt(week) - 1;
		if (previousWeek >= 1) {
			setWeek(previousWeek.toString());
			saveCurrentWeek(previousWeek.toString());
			router.push(`./WorkoutDetailScreen?week=${previousWeek}`);
		}
	};

	return (
		<Layout style={styles.container}>
			{showSetupMessage ? (
				<View style={styles.setupMessageContainer}>
					<Text style={styles.setupMessageText}>
						Complete the setup to enter your one-rep max values before starting your
						workout.
					</Text>
				</View>
			) : (
				<>
					{/* Week Navigation */}
					<View style={styles.navigationContainer}>
						<Icon
							name="arrow-back-outline"
							onPress={goToPreviousWeek}
							style={[
								styles.arrowIcon,
								parseInt(week) <= 1 ? styles.disabledArrow : {},
							]}
							disabled={parseInt(week) <= 1}
						/>
						<Text category="h1">Week {week}</Text>
						<Icon
							name="arrow-forward-outline"
							onPress={goToNextWeek}
							style={[
								styles.arrowIcon,
								parseInt(week) >= 21 ? styles.disabledArrow : {},
							]}
							disabled={parseInt(week) >= 21}
						/>
					</View>

					{/* Render lifts */}
					<WorkoutSection
						lift="deadlift"
						max={deadliftMax}
						label="Deadlift"
						week={week}
						selectedReps={selectedReps.deadlift}
						setSelectedReps={setSelectedReps}
						isCompleted={isCompleted[week]?.deadlift || false}
						handleComplete={handleCompleteWrapper}
						calculateWorkoutWeight={(oneRepMax, percentage) =>
							calculateWorkoutWeight(oneRepMax, percentage, rounding)
						}
						normalReps={normalRepsPerWeek.deadlift[parseInt(week) - 1]}
						repoutTarget={repoutTarget.deadlift[parseInt(week) - 1]}
					/>
					<WorkoutSection
						lift="benchPress"
						max={benchMax}
						label="Bench Press"
						week={week}
						selectedReps={selectedReps.benchPress}
						setSelectedReps={setSelectedReps}
						isCompleted={isCompleted[week]?.benchPress || false}
						handleComplete={handleCompleteWrapper}
						calculateWorkoutWeight={(oneRepMax, percentage) =>
							calculateWorkoutWeight(oneRepMax, percentage, rounding)
						}
						normalReps={normalRepsPerWeek.benchPress[parseInt(week) - 1]}
						repoutTarget={repoutTarget.benchPress[parseInt(week) - 1]}
					/>
					<WorkoutSection
						lift="squat"
						max={squatMax}
						label="Squat"
						week={week}
						selectedReps={selectedReps.squat}
						setSelectedReps={setSelectedReps}
						isCompleted={isCompleted[week]?.squat || false}
						handleComplete={handleCompleteWrapper}
						calculateWorkoutWeight={(oneRepMax, percentage) =>
							calculateWorkoutWeight(oneRepMax, percentage, rounding)
						}
						normalReps={normalRepsPerWeek.squat[parseInt(week) - 1]}
						repoutTarget={repoutTarget.squat[parseInt(week) - 1]}
					/>
				</>
			)}
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	navigationContainer: {
		alignItems: 'center',
		marginVertical: 10,
		flexDirection: 'row',
	},
	arrowIcon: {
		width: 32,
		height: 32,
		marginHorizontal: 10,
	},
	disabledArrow: {
		opacity: 0.3,
	},
	setupMessageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	setupMessageText: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 18,
		color: 'white',
	},
});

export default WorkoutDetailScreen;

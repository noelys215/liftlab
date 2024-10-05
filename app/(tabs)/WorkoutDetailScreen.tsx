import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Icon, IndexPath, useTheme, Card } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import WorkoutSection from '@/components/WorkoutSection';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { normalRepsPerWeek, repoutTarget } from '@/constants/intensities';
import { calculateWorkoutWeight } from '../utils/workoutHelpers';
import { handleComplete } from '../utils/workoutHandlers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const WorkoutDetailScreen: React.FC = () => {
	const theme = useTheme();
	const router = useRouter();
	const [week, setWeek] = useState<string>('1');
	const [showSetupMessage, setShowSetupMessage] = useState<boolean>(false);

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

	// Load the last selected week from AsyncStorage when the component mounts or screen is focused
	useFocusEffect(
		useCallback(() => {
			const loadLastWeek = async () => {
				try {
					const lastWeek = await AsyncStorage.getItem('currentWeek');
					if (lastWeek) {
						setWeek(lastWeek);
					} else {
						setWeek('1');
					}

					// Check if max values are set and show the setup message if they are missing
					const squatMaxValue = await AsyncStorage.getItem('squatMax');
					const benchMaxValue = await AsyncStorage.getItem('benchMax');
					const deadliftMaxValue = await AsyncStorage.getItem('deadliftMax');

					if (!squatMaxValue || !benchMaxValue || !deadliftMaxValue) {
						setShowSetupMessage(true);
					} else {
						setShowSetupMessage(false);
					}
				} catch (error) {
					console.error('Error loading last selected week or max values', error);
				}
			};

			loadLastWeek();
		}, [])
	);

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
					<Card style={styles.setupCard}>
						<Text style={styles.setupMessageText}>
							Complete the setup to enter your one-rep max values before starting your
							workout.
						</Text>
					</Card>
				</View>
			) : (
				<>
					{/* Week Navigation */}
					<SafeAreaView>
						<View style={styles.navigationContainer}>
							<Icon
								name="arrow-back-outline"
								onPress={goToPreviousWeek}
								fill={theme['color-accent-300']}
								style={[
									styles.arrowIcon,
									parseInt(week) <= 1 ? styles.disabledArrow : {},
								]}
								disabled={parseInt(week) <= 1}
							/>
							<Text category="h1" style={{ fontFamily: 'Eva', margin: 'auto' }}>
								Week {week}
							</Text>
							<Icon
								name="arrow-forward-outline"
								onPress={goToNextWeek}
								fill={theme['color-accent-300']}
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
					</SafeAreaView>
				</>
			)}
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	navigationContainer: {
		alignItems: 'center',
		marginVertical: 25,
		flexDirection: 'row',
	},
	arrowIcon: {
		width: 42,
		height: 42,
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
	setupCard: {
		width: '110%',
		padding: 20,
		borderRadius: 10,
		backgroundColor: '#3c3836',
		borderColor: '#f59e0b',
	},
	setupMessageText: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 24,
		fontFamily: 'Eva',
	},
});

export default WorkoutDetailScreen;

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Layout, Text, Icon, CheckBox, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

const WorkoutDetailScreen: React.FC = () => {
	const [squatMax, setSquatMax] = useState<number | null>(null);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0));
	const router = useRouter();
	const { week: weekParam, day: dayParam } = useLocalSearchParams();

	// Ensure single string values for week and day
	const week = Array.isArray(weekParam) ? weekParam[0] : weekParam;
	const day = Array.isArray(dayParam) ? dayParam[0] : dayParam;

	useEffect(() => {
		const getUserMaxes = async () => {
			try {
				const squat = await AsyncStorage.getItem('squatMax');
				if (squat) {
					setSquatMax(parseInt(squat));
				}
			} catch (error) {
				console.error('Error retrieving 1RM values', error);
			}
		};

		getUserMaxes();
	}, []);

	const calculateWorkoutWeight = (oneRepMax: number, percentage: number) => {
		return Math.round(oneRepMax * (percentage / 100));
	};

	const markAsComplete = async () => {
		setIsCompleted(true);
		await AsyncStorage.setItem('lastCompletedWeek', week as string);
		await AsyncStorage.setItem('lastCompletedDay', day as string);
	};

	const goToNextDay = () => {
		let nextWeek = parseInt(week as string);
		let nextDay = parseInt(day as string) + 1;

		if (nextDay > 7) {
			nextDay = 1;
			nextWeek += 1;
		}

		router.push(`./WorkoutDetailScreen?week=${nextWeek}&day=${nextDay}`);
	};

	const goToPreviousDay = () => {
		let previousWeek = parseInt(week as string);
		let previousDay = parseInt(day as string) - 1;

		if (previousDay < 1) {
			previousWeek = previousWeek > 1 ? previousWeek - 1 : previousWeek;
			previousDay = 7;
		}

		router.push(`./WorkoutDetailScreen?week=${previousWeek}&day=${previousDay}`);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<Layout style={styles.container}>
				{/* Week and Day Navigation */}
				<View style={styles.navigationContainer}>
					<View style={styles.row}>
						<Icon
							name="arrow-back-outline"
							onPress={goToPreviousDay}
							style={styles.arrowIcon}
						/>
						<Text category="h1">Week {week}</Text>
						<Icon
							name="arrow-forward-outline"
							onPress={goToNextDay}
							style={styles.arrowIcon}
						/>
					</View>
					<View style={styles.row}>
						<Icon
							name="arrow-back-outline"
							onPress={goToPreviousDay}
							style={styles.arrowIcon}
						/>
						<Text category="h3">Day {day}</Text>
						<Icon
							name="arrow-forward-outline"
							onPress={goToNextDay}
							style={styles.arrowIcon}
						/>
					</View>
				</View>

				{/* Workout Details */}
				<View style={styles.workoutDetailsContainer}>
					{squatMax !== null && (
						<>
							<Text category="s1" style={styles.workoutText}>
								Deadlift: {calculateWorkoutWeight(squatMax, 70)} lbs, 5 reps
							</Text>
							<Text category="s1" style={styles.workoutText}>
								Rep out Target: 9 reps
							</Text>
						</>
					)}

					{/* UI Kitten Select for selecting reps */}
					<View style={styles.selectContainer}>
						<Select
							selectedIndex={selectedIndex}
							value={`Beat by ${selectedIndex.row} Reps`}
							onSelect={(index) => setSelectedIndex(index as IndexPath)}
							style={styles.select}>
							{Array.from({ length: 6 }, (_, index) => (
								<SelectItem key={index} title={`Beat by ${index} reps`} />
							))}
						</Select>
					</View>

					<CheckBox
						style={styles.checkbox}
						checked={isCompleted}
						onChange={markAsComplete}>
						{isCompleted ? 'Completed' : 'Mark as Complete'}
					</CheckBox>
				</View>
			</Layout>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	navigationContainer: {
		alignItems: 'center',
		marginVertical: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5,
	},
	arrowIcon: {
		width: 24,
		height: 24,
	},
	workoutDetailsContainer: {
		alignItems: 'center',
		marginVertical: 10,
	},
	workoutText: {
		marginBottom: 5,
		fontSize: 18,
	},
	checkbox: {
		marginTop: 10,
	},
	selectContainer: {
		marginVertical: 10,
		width: 200,
	},
	select: {
		marginVertical: 5,
	},
});

export default WorkoutDetailScreen;

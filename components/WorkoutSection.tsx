import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Select, SelectItem, CheckBox, IndexPath } from '@ui-kitten/components';
import { intensities } from '../constants/intensities';
import { repAdjustments } from '../constants/repAdjustments';

type WorkoutSectionProps = {
	lift: 'squat' | 'benchPress' | 'deadlift';
	max: number | null;
	label: string;
	week: string;
	selectedReps: IndexPath;
	setSelectedReps: React.Dispatch<React.SetStateAction<{ [key: string]: IndexPath }>>;
	isCompleted: boolean;
	handleComplete: (lift: string) => void;
	calculateWorkoutWeight: (oneRepMax: number, percentage: number) => number;
	normalReps: number; // New prop
	repoutTarget: number; // New prop
};

const WorkoutSection: React.FC<WorkoutSectionProps> = ({
	lift,
	max,
	label,
	week,
	selectedReps,
	setSelectedReps,
	isCompleted,
	handleComplete,
	calculateWorkoutWeight,
	normalReps,
	repoutTarget,
}) => {
	if (max === null) return null;

	const adjustmentKeys = Object.keys(repAdjustments) as (keyof typeof repAdjustments)[];
	const adjustmentValues = Object.values(repAdjustments);

	const adjustmentLabels: { [key in keyof typeof repAdjustments]: string } = {
		below2: 'Below Target: 2+ Reps',
		below1: 'Below Target: 1 Rep',
		hitTarget: 'Hit Target',
		beat1: 'Beat Target: 1 Rep',
		beat2: 'Beat Target: 2 Reps',
		beat3: 'Beat Target: 3 Reps',
		beat4: 'Beat Target: 4 Reps',
		beat5Plus: 'Beat Target: 5+ Reps',
	};

	const currentAdjustmentLabel = adjustmentLabels[adjustmentKeys[selectedReps.row]];
	const currentAdjustmentValue = adjustmentValues[selectedReps.row];

	return (
		<View style={styles.workoutSection}>
			<Text category="s1" style={styles.workoutText}>
				{label}: {calculateWorkoutWeight(max, intensities[lift][parseInt(week) - 1])} lbs,{' '}
				{normalReps} reps
			</Text>
			<Text category="s1" style={styles.workoutText}>
				Repout Target: {repoutTarget} reps
			</Text>
			<Select
				label="Beat or Miss Target?"
				value={`${currentAdjustmentLabel}: ${currentAdjustmentValue}%`}
				onSelect={(index) =>
					setSelectedReps((prev) => ({ ...prev, [lift]: index as IndexPath }))
				}
				style={styles.picker}>
				{adjustmentKeys.map((key, index) => (
					<SelectItem
						key={key}
						title={`${adjustmentLabels[key]}: ${adjustmentValues[index]}%`}
					/>
				))}
			</Select>

			<CheckBox
				checked={isCompleted}
				onChange={() => handleComplete(lift)}
				style={styles.checkbox}>
				{isCompleted ? 'Completed' : 'Mark as Complete'}
			</CheckBox>
		</View>
	);
};

const styles = StyleSheet.create({
	workoutSection: {
		alignItems: 'center',
		marginVertical: 15,
	},
	workoutText: {
		marginBottom: 5,
		fontSize: 18,
	},
	checkbox: {
		marginTop: 10,
	},
	picker: {
		marginVertical: 10,
		width: 275,
	},
});

export default WorkoutSection;

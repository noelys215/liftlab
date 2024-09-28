import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Input, Button, Icon } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const SetupScreen: React.FC = () => {
	const [squatMax, setSquatMax] = useState<string>('');
	const [benchMax, setBenchMax] = useState<string>('');
	const [deadliftMax, setDeadliftMax] = useState<string>('');
	const router = useRouter();

	const saveMaxes = async () => {
		try {
			await AsyncStorage.setItem('squatMax', squatMax);
			await AsyncStorage.setItem('benchMax', benchMax);
			await AsyncStorage.setItem('deadliftMax', deadliftMax);

			// Determine where the user should start
			const lastCompletedWeek = await AsyncStorage.getItem('lastCompletedWeek');
			const lastCompletedDay = await AsyncStorage.getItem('lastCompletedDay');

			let nextWeek = 1;
			let nextDay = 1;

			if (lastCompletedWeek && lastCompletedDay) {
				nextWeek = parseInt(lastCompletedWeek);
				nextDay = parseInt(lastCompletedDay) + 1;

				// Assuming each week has 7 days for this example
				if (nextDay > 7) {
					nextDay = 1;
					nextWeek += 1;
				}
			}

			router.replace(`/screens/WorkoutDetailScreen?week=${nextWeek}&day=${nextDay}`);
		} catch (error) {
			console.error('Error saving 1RM values', error);
		}
	};

	const SaveIcon = (props: any) => <Icon {...props} name="save-outline" />;

	return (
		<Layout style={styles.container}>
			<Text category="h1" style={styles.header}>
				Enter Your One Rep Max
			</Text>
			<Input
				style={styles.input}
				placeholder="Squat Max"
				keyboardType="numeric"
				value={squatMax}
				onChangeText={setSquatMax}
			/>
			<Input
				style={styles.input}
				placeholder="Bench Max"
				keyboardType="numeric"
				value={benchMax}
				onChangeText={setBenchMax}
			/>
			<Input
				style={styles.input}
				placeholder="Deadlift Max"
				keyboardType="numeric"
				value={deadliftMax}
				onChangeText={setDeadliftMax}
			/>
			<Button style={styles.button} onPress={saveMaxes} accessoryLeft={SaveIcon}>
				Save & Continue
			</Button>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	header: {
		textAlign: 'center',
		marginBottom: 20,
	},
	input: {
		marginBottom: 10,
	},
	button: {
		marginTop: 20,
	},
});

export default SetupScreen;

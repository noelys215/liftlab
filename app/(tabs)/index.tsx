import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import {
	Layout,
	Text,
	Input,
	Button,
	Icon,
	Select,
	SelectItem,
	IndexPath,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const SetupScreen: React.FC = () => {
	const [squatMax, setSquatMax] = useState<string>('');
	const [benchMax, setBenchMax] = useState<string>('');
	const [deadliftMax, setDeadliftMax] = useState<string>('');
	const [roundingOption, setRoundingOption] = useState(new IndexPath(0));
	const router = useRouter();

	const roundingOptions = [2.5, 5];

	const saveMaxes = async () => {
		try {
			await AsyncStorage.setItem('squatMax', squatMax);
			await AsyncStorage.setItem('benchMax', benchMax);
			await AsyncStorage.setItem('deadliftMax', deadliftMax);
			await AsyncStorage.setItem('rounding', roundingOptions[roundingOption.row].toString());

			// Trigger update in WorkoutDetailScreen
			await AsyncStorage.setItem('storageUpdated', Date.now().toString());

			// Determine where the user should start
			const lastCompletedWeek = await AsyncStorage.getItem('lastCompletedWeek');
			const lastCompletedDay = await AsyncStorage.getItem('lastCompletedDay');

			let nextWeek = 1;
			let nextDay = 1;

			if (lastCompletedWeek && lastCompletedDay) {
				nextWeek = parseInt(lastCompletedWeek);
				nextDay = parseInt(lastCompletedDay) + 1;

				if (nextDay > 7) {
					nextDay = 1;
					nextWeek += 1;
				}
			}

			router.replace(`./WorkoutDetailScreen?week=${nextWeek}&day=${nextDay}`);
		} catch (error) {
			console.error('Error saving 1RM values', error);
		}
	};

	const resetStorage = async () => {
		Alert.alert(
			'Reset Data',
			'Are you sure you want to delete all your saved data and start over?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'OK',
					onPress: async () => {
						try {
							await AsyncStorage.clear();
							await AsyncStorage.setItem('storageUpdated', Date.now().toString());
							await AsyncStorage.setItem('reset', 'true'); // Set reset flag

							setSquatMax('');
							setBenchMax('');
							setDeadliftMax('');
							setRoundingOption(new IndexPath(0));

							Alert.alert('Success', 'All data has been reset.');
						} catch (error) {
							console.error('Error resetting storage', error);
						}
					},
				},
			],
			{ cancelable: true }
		);
	};
	const SaveIcon = (props: any) => <Icon {...props} name="save-outline" />;

	return (
		<Layout style={{ ...styles.container }}>
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

			{/* Rounding Option Selector */}
			<Select
				label="Rounding Option"
				value={roundingOptions[roundingOption.row]}
				selectedIndex={roundingOption}
				onSelect={(index) => setRoundingOption(index as IndexPath)}>
				<SelectItem title="2.5 lbs" />
				<SelectItem title="5 lbs" />
			</Select>

			<Button style={styles.button} onPress={saveMaxes} accessoryLeft={SaveIcon}>
				Save & Continue
			</Button>

			<Button style={styles.resetButton} status="danger" onPress={resetStorage}>
				Reset Data
			</Button>

			<StatusBar style="dark" />
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
	resetButton: {
		marginTop: 10,
	},
});

export default SetupScreen;

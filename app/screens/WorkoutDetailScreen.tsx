import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';

const WorkoutDetailScreen: React.FC = ({ route, navigation }: any) => {
	const { week, day } = route.params;

	return (
		<Layout style={styles.container}>
			<Text category="h1" style={styles.header}>
				Week {week}, Day {day}
			</Text>
			<Text category="s1">
				Workout Details for Week {week}, Day {day}
			</Text>
			<Button
				style={styles.button}
				onPress={() => navigation.navigate('WorkoutDetail', { week, day: day + 1 })}>
				Next Day
			</Button>
			<Button
				style={styles.button}
				onPress={() => navigation.navigate('WorkoutDetail', { week, day: day - 1 })}>
				Previous Day
			</Button>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		marginBottom: 20,
	},
	button: {
		marginTop: 10,
	},
});

export default WorkoutDetailScreen;

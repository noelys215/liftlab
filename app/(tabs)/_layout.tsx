import React from 'react';
import { Tabs } from 'expo-router';
import { IconRegistry, Icon, Layout } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useTheme } from '@ui-kitten/components';

// Tab Icon Component
function TabBarIcon(props: { name: string; color: string }) {
	const theme = useTheme();
	return (
		<Icon
			name={props.name}
			pack="eva"
			fill={props.color}
			style={{ width: 28, height: 28, marginBottom: -3 }}
		/>
	);
}

export default function TabLayout() {
	const theme = useTheme();

	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<Layout style={{ flex: 1, backgroundColor: theme['background-basic-color-1'] }}>
				<Tabs
					screenOptions={{
						tabBarLabelStyle: { fontSize: 14, fontFamily: 'Eva' },
						headerShown: false,
						tabBarActiveTintColor: theme['color-accent-300'],
						tabBarInactiveTintColor: theme['text-basic-color'],
						tabBarStyle: {
							backgroundColor: theme['color-primary-500'],
							height: 80,
							paddingBottom: 20,
							borderTopWidth: 2,
							borderTopColor: theme['color-accent-400'],
						},
					}}>
					{/* Setup Screen Tab */}
					<Tabs.Screen
						name="index"
						options={{
							title: 'Setup',
							headerShown: false,
							tabBarIcon: ({ color }) => (
								<TabBarIcon name="settings-outline" color={color} />
							),
						}}
					/>
					{/* Workout Detail Screen Tab */}
					<Tabs.Screen
						name="WorkoutDetailScreen"
						options={{
							title: 'Workouts',
							headerShown: false,
							tabBarIcon: ({ color }) => (
								<TabBarIcon name="activity-outline" color={color} />
							),
						}}
					/>
				</Tabs>
			</Layout>
		</>
	);
}

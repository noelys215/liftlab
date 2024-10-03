import React from 'react';
import { Tabs } from 'expo-router';
import { Icon } from '@ui-kitten/components';
import { View, StyleSheet, StatusBar } from 'react-native';

// Tab Icon Component
function TabBarIcon(props: { name: string; color: string }) {
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
	return (
		<Tabs
			screenOptions={{
				tabBarLabelStyle: { fontSize: 14 },
				headerShown: false,
				tabBarActiveTintColor: '#FFD700',
				tabBarStyle: {
					backgroundColor: '#1a1a1a',
					height: 80,
					paddingBottom: 20,
					borderTopWidth: 0,
				},
			}}>
			{/* Setup Screen Tab */}
			<Tabs.Screen
				name="index"
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="settings-outline" color={color} />,
				}}
			/>
			{/* Workout Detail Screen Tab */}
			<Tabs.Screen
				name="WorkoutDetailScreen"
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name="activity-outline" color={color} />,
				}}
			/>
		</Tabs>
	);
}

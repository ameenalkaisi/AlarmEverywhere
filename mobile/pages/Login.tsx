import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { RootStackParamList, styles } from '../_app';
import { REACT_APP_DEV_BACKEND_URL } from '@env'

const Login: React.FC<NativeStackScreenProps<RootStackParamList, 'Login'>> = ({ navigation }) => {
	// new-login screen
	//
	// display email and password boxes
	// forgot password option
	// -- displays page where you enter email and it sends stuff
	// MAYBE there's a no-login option for just regular alarms, this would be in another tab
	//
	// logged-in screen
	//
	// display list of current alarms
	// -- each of which have edit option and 
	// then display alarm creation in another "tab"
	// another tab for account settings

	const passwordRef = React.useRef<String>();
	const emailRef = React.useRef<String>();
	const [stuff, setStuff] = React.useState<String>("");

	const handleSubmit = () => {
		console.log("hi");
	}

	const getStuff = async () => {
		try {
			const response = await fetch();
			const val = await response.text();
			setStuff(val);
		} catch (error) {
			console.error(error);
		}
	}

	useQuery([''], () => getStuff());

	return (
		<View style={styles.container}>
			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Email"
					placeholderTextColor="#F6F7F8"
					onChangeText={(email) => emailRef.current = email}
				/>
			</View>

			<Text>{stuff}</Text>

			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Password"
					placeholderTextColor="#F6F7F8"
					secureTextEntry={true}
					onChangeText={(password) => passwordRef.current = password}
				/>
			</View>

			<TouchableOpacity>
				<Text style={styles.forgot_button} onPress={() => navigation.push("ForgotPassword")}>Forgot Password?</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.loginBtn}>
				<Text onPress={handleSubmit}>LOGIN</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Login;

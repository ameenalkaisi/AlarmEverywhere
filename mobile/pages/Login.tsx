import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { BACKEND_URL } from '@env';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { RootStackParamList, styles } from '../_app';
import axios, { AxiosError, AxiosResponse } from 'axios';

const Login: React.FC<NativeStackScreenProps<RootStackParamList, 'Login'>> = ({
	navigation,
}) => {
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
	const [stuff, setStuff] = React.useState<String>('');

	const handleSubmit = () => {
		axios
			.post(BACKEND_URL + '/login', {
				email: emailRef,
				password: passwordRef,
			})
			.then((response: AxiosResponse) => {
				console.log(response.data);
			})
			.catch((error: Error | AxiosError<String, String>) => {
				if (axios.isAxiosError(error)) {
					// todo
					// set some helper text here
					console.log(error);
					if (error.response?.data.contains('not verified')) {
						// go into verify code page
						console.log(error.response);
					}
				}
			});
	};

	const handleRegister = () => {
		navigation.push('Register');
	};

	const getStuff = async () => {
		try {
			const response = await fetch(BACKEND_URL + '/');
			const val = await response.text();
			setStuff(val);
		} catch (error) {
			console.error(error);
		}
	};

	useQuery([''], () => getStuff());

	return (
		<View style={styles.container}>
			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Email"
					placeholderTextColor="#F6F7F8"
					onChangeText={email => (emailRef.current = email)}
				/>
			</View>

			<Text>{stuff == '' ? 'None' : stuff}</Text>

			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Password"
					placeholderTextColor="#F6F7F8"
					secureTextEntry={true}
					onChangeText={password => (passwordRef.current = password)}
				/>
			</View>

			<TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
				<Text style={styles.forgot_button}>Forgot Password?</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.btn} onPress={handleSubmit}>
				<Text>LOGIN</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.btn} onPress={handleRegister}>
				<Text>REGISTER</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Login;

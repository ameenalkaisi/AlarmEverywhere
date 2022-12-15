import { BACKEND_URL } from '@env';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackParamList, styles } from '../_app';

const Register: React.FC<
	NativeStackScreenProps<RootStackParamList, 'Register'>
> = ({ navigation }) => {
	const passwordRef = React.useRef<string>();
	const emailRef = React.useRef<string>();
	const nameRef = React.useRef<string>();

	const [passwordText, setPasswordText] = React.useState<string>('');
	const [helpText, setHelpText] = React.useState<string>('');

	const handleSignup = async () => {
		// get the details
		const email = emailRef.current;
		const password = passwordRef.current;
		const name = nameRef.current;

		if (
			!email ||
			!password ||
			!name ||
			name.length == 0 ||
			email.length == 0 ||
			password.length == 0
		) {
			setPasswordText('Name, e-mail, or/and password is/are empty');
			return;
		}

		// tell go server about this information
		await signUpUser(name, email, password);
	};

	// todo: handle hashing here
	const signUpUser = async (name: string, email: string, password: string) => {
		return await axios
			.post(BACKEND_URL + '/users/create', {
				name,
				email,
				password,
			})
			// not sure what the second any is for
			.then((response: AxiosResponse<string, string>) => {
				console.log(response.data);
				if (response.data.indexOf('Duplicate') != -1) {
					setHelpText(
						'A user has already been created with that e-mail, please go back and tap forgot password',
					);
				}
			})
			.catch(error => console.log(error));
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Name"
					placeholderTextColor="#F6F7F8"
					onChangeText={name => (nameRef.current = name)}
				/>
			</View>

			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Email"
					placeholderTextColor="#F6F7F8"
					onChangeText={email => (emailRef.current = email)}
				/>
			</View>

			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Password"
					placeholderTextColor="#F6F7F8"
					secureTextEntry={true}
					onChangeText={password => (passwordRef.current = password)}
				/>
			</View>

			<View style={styles.inputView}>
				{/* could enforce text to be stronger */}
				<TextInput
					style={styles.TextInput}
					placeholder="Confirm Password"
					placeholderTextColor="#F6F7F8"
					secureTextEntry={true}
					onChangeText={password => {
						if (password != passwordRef.current) {
							setPasswordText('Password is not the same!');
						} else {
							setPasswordText('');
						}
					}}
				/>
			</View>

			<View>
				<Text>{passwordText}</Text>
			</View>

			<View>
				<Text>{helpText}</Text>
			</View>

			<TouchableOpacity style={styles.btn} onPress={handleSignup}>
				<Text>Sign up!</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Register;

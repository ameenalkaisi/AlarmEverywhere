import * as React from 'react';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../_app';

const ForgotPassword = () => {
	const [email, setEmail] = React.useState("");

	return (
		<View style={styles.container}>
			<View style={styles.inputView}>
				<Text>A code has been sent please view your inbox and enter it</Text>
				<TextInput
					style={{ ...styles.TextInput }}
					placeholder="Email."
					placeholderTextColor="#F6F7F8"
					onChangeText={(email) => setEmail(email)}
				/>
			</View>

			<TouchableOpacity style={styles.enterButton}>
				<Text>Enter code</Text>
			</TouchableOpacity>

			<TouchableOpacity>
				<Text style={styles.forgot_button}>E-mail will be sent to change your password</Text>
			</TouchableOpacity>
		</View>
	);
};


export default ForgotPassword;

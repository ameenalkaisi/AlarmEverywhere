import * as React from 'react';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../_app';

const EnterEmail: React.FC<
	{
		setHandlingState: React.Dispatch<React.SetStateAction<number>>,
		setEmail: React.Dispatch<React.SetStateAction<string>>
	}> = ({ setHandlingState, setEmail }) => {

		const onCodeSubmit = () => {
			// stuff here
			setHandlingState(2);
		}

		return (
			<View style={styles.container}>
				<Text>Please enter your e-mail</Text>
				<View style={styles.inputView}>
					<TextInput
						style={styles.TextInput}
						placeholder="Email."
						placeholderTextColor="#F6F7F8"
						onChangeText={(email) => setEmail(email)}
					/>
				</View>

				<TouchableOpacity style={styles.enterButton}>
					<Text onPress={onCodeSubmit}>Enter code</Text>
				</TouchableOpacity>

				<TouchableOpacity>
					<Text onPress={() => setHandlingState(0)}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	};


export default EnterEmail;

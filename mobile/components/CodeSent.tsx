import * as React from 'react';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../_app';


const CodeSent: React.FC<
	{
		setHandlingState: React.Dispatch<React.SetStateAction<number>>,
		email: string
	}> = ({ setHandlingState, email }) => {
		const [code, setCode] = React.useState(0); // change into useRef from 'enter code' text box

		return (
			<View style={styles.container}>
				<View style={styles.inputView}>
					<Text>Please enter your e-mail</Text>
					<TextInput
						style={styles.TextInput}
						placeholder="Email."
						placeholderTextColor="#F6F7F8"
						onBlur={(e) => {
							let val = parseInt(e.nativeEvent.text);
							if (val)
								setCode(val);
						}}
					/>
				</View>

				<TouchableOpacity>
					<Text onPress={() => { setHandlingState(1) }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	};


export default CodeSent;

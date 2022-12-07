import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import CodeSent from '../components/CodeSent';
import EnterEmail from '../components/EnterEmail';
import { RootStackParamList } from '../_app';

const ForgotPassword: React.FC<NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>> = ({ navigation }) => {
	const [email, setEmail] = React.useState("");
	const [handlingState, setHandlingState] = React.useState(1);

	React.useEffect(() => {
		if (handlingState == 0) {
			navigation.pop();
		}
	}, [handlingState]);

	return (
		<>
			{
				handlingState == 1 &&
				<EnterEmail setHandlingState={setHandlingState} setEmail={setEmail} />
			}
			{
				handlingState == 2 &&
				<CodeSent setHandlingState={setHandlingState} email={email} />
			}
		</>
	);


};

export default ForgotPassword;

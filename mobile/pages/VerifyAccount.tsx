import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';

import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import {RootStackParamList, styles as st} from '../_app';
import axios, {AxiosResponse} from 'axios';
import {BACKEND_URL} from '@env';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

const CELL_COUNT = 9;

const VerifyAccount: React.FC<
  NativeStackScreenProps<RootStackParamList, 'VerifyAccount'>
> = ({}) => {
  const [value, setValue] = React.useState('');
  const [helpText, seHelperText] = React.useState('');

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <>
      <SafeAreaView style={st.container}>
        <Text style={styles.title}>Verification</Text>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </SafeAreaView>
      <View style={st.container}>
        <>
          <Text>Enter code sent to your e-mail</Text>

          <Text
            onPress={() => {
              // todo
              // set up the code for submission
              // send it to server for verification
              // if it's successful, move into the home page on the account
              let codeText = value;
              console.log(codeText);

              let link = BACKEND_URL + '/verify-email/' + codeText;
              console.log(link);
              axios
                .get(link)
                .then((_: AxiosResponse<string, string>) => {
                  seHelperText('valid code');

                  // todo:
                  // login, then move into home page
                  // if login fails, go back into login page
                })
                .catch(_ => {
                  // set some helper text
                  seHelperText('invalid code or error in server');
                  // could expand here to have more specific errors
                });
              // now go into it lmao
            }}>
            Submit
          </Text>
          <Text>Cancel</Text>
          <Text>Resend Code</Text>
          <Text>{helpText}</Text>
        </>
      </View>
    </>
  );
};

export default VerifyAccount;

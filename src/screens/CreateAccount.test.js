import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import CreateAccount from '../screens/CreateAccount';

test('renders ConditionGeneralUtilisation without crashing', () => {
    render(
        <NavigationContainer>
            <CreateAccount />
        </NavigationContainer>
    );
});

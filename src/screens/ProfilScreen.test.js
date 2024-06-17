import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProfilScreen from '../screens/ProfilScreen';

test('renders ConditionGeneralUtilisation without crashing', () => {
    render(
        <NavigationContainer>
            <ProfilScreen />
        </NavigationContainer>
    );
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MapScreen from '../screens/MapScreen';

test('renders ConditionGeneralUtilisation without crashing', () => {
    render(
        <NavigationContainer>
            <MapScreen />
        </NavigationContainer>
    );
});

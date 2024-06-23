import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ConditionGeneralUtilisation from '../screens/ConditionGeneralUtilisation';

test('renders ConditionGeneralUtilisation without crashing', () => {
    render(
        <NavigationContainer>
            <ConditionGeneralUtilisation />
        </NavigationContainer>
    );
});

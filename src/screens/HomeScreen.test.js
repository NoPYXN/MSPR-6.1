import React from 'react';
import { render } from '@testing-library/react';
import HomeScreen from './HomeScreen.js';
import { NavigationContainer } from '@react-navigation/native';

test('renders HomeScreen without crashing', () => {
    render(
        <NavigationContainer>
            <HomeScreen />
        </NavigationContainer>
    );
});

import React from 'react';
import { render } from '@testing-library/react';
import AnnonceScreen from './AnnonceScreen';
import { NavigationContainer } from '@react-navigation/native';

test('renders HomeScreen without crashing', () => {
    render(
        <NavigationContainer>
                <AnnonceScreen />
        </NavigationContainer>
    );
});

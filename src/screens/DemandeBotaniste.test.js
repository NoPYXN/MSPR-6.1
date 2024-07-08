import React from 'react';
import { render } from '@testing-library/react';
import DemandeBotaniste from './DemandeBotaniste';
import { NavigationContainer } from '@react-navigation/native';

test('renders HomeScreen without crashing', () => {
    render(
        <NavigationContainer>
            <DemandeBotaniste />
        </NavigationContainer>
    );
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import FormulaireAnnonceScreen from '../screens/FormulaireAnnonceScreen';

test('renders ConditionGeneralUtilisation without crashing', () => {
    render(
        <NavigationContainer>
            <FormulaireAnnonceScreen />
        </NavigationContainer>
    );
});

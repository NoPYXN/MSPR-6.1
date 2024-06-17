import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FormulaireAnnonceScreen from '../screens/FormulaireAnnonceScreen';

// Mock axios
const mock = new MockAdapter(axios);

describe('FormulaireAnnonceScreen', () => {
    beforeEach(() => {
        mock.reset();
    });

    const setup = (routeParams) => {
        const navigationMock = {
            navigate: jest.fn(),
        };

        jest.doMock('@react-navigation/native', () => {
            const actualNav = jest.requireActual('@react-navigation/native');
            return {
                ...actualNav,
                useNavigation: () => navigationMock,
                useRoute: () => ({
                    params: routeParams,
                }),
            };
        });

        return { navigationMock };
    };

    it('renders without crashing', async () => {
        setup({ id: '123' });

        await act(async () => {
            render(
                <NavigationContainer>
                    <FormulaireAnnonceScreen />
                </NavigationContainer>
            );
        });

        expect(screen.getByText('Modifier une annonce')).toBeTruthy();
    });

    it('displays "Ajouter une annonce" when no id is provided', async () => {
        setup({});

        await act(async () => {
            render(
                <NavigationContainer>
                    <FormulaireAnnonceScreen />
                </NavigationContainer>
            );
        });

        expect(screen.getByText('Ajouter une annonce')).toBeTruthy();
    });

    it('navigates back to HomeScreen on close button press', async () => {
        const { navigationMock } = setup({ id: '123' });

        await act(async () => {
            render(
                <NavigationContainer>
                    <FormulaireAnnonceScreen />
                </NavigationContainer>
            );
        });

        const closeButton = screen.getByRole('button');
        fireEvent.press(closeButton);

        expect(navigationMock.navigate).toHaveBeenCalledWith({
            name: 'HomeScreen',
            params: { isActions: 'true' },
        });
    });

    it('displays AddPlantForm when loading is true', async () => {
        setup({ id: '123' });

        await act(async () => {
            render(
                <NavigationContainer>
                    <FormulaireAnnonceScreen />
                </NavigationContainer>
            );
        });

        expect(screen.getByTestId('add-plant-form')).toBeTruthy();
    });
});

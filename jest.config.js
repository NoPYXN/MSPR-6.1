module.exports = {
    preset: 'react-native',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|expo-image-picker|expo-permissions|expo-document-picker)/)',
    ],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
    ],
    moduleNameMapper: {
        '\\.(css|less)$': 'jest-css-modules',
    },
};

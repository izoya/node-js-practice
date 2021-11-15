module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'standard',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'comma-dangle': ['error', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'never',
        }],
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'keyword-spacing': ['error'],
        'no-multiple-empty-lines': ['error', {
            max: 1,
        }],
        'no-trailing-spaces': ['error'],
        'no-useless-constructor': 'off',
        'node/no-callback-literal': 'off',
        'object-curly-spacing': [2, 'never'],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
        ],
        quotes: ['error', 'single'],
        semi: [2, 'always'],
        'space-before-blocks': ['error', 'always'],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
        }],
    },
};

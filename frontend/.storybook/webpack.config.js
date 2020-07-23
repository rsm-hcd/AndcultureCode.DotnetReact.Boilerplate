module.exports = async ({ config, mode }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: require.resolve("awesome-typescript-loader"),
            },
            {
                loader: require.resolve("react-docgen-typescript-loader"),
                // Set shouldExtractLiteralValuesFromEnum = true to view enum values in storybook.
                options: { shouldExtractLiteralValuesFromEnum: true },
            },
        ],
    });

    config.resolve.extensions.push(".ts", ".tsx");

    return config;
};

import { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    EXAMPLE_MESSAGE: {
        en: (props: { ID: string }) => `found secret: ${props.ID}`,
        ja: (props: { ID: string }) => `secret: ${props.ID} がみつかりました`,
    },
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-example",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /secret/gi;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("EXAMPLE_MESSAGE", {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};

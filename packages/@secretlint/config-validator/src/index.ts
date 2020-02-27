import SecretLintConfigDescriptorValidate from "./SecretLintConfigDescriptor-validation";
import SecretLintConfigDescriptorRuleValidate from "./SecretLintConfigDescriptorRule-validation";
import SecretLintConfigDescriptorRulePresetValidate from "./SecretLintConfigDescriptorRulePreset-validation";
import { SecretLintCoreDescriptorRule, SecretLintCoreDescriptorRulePreset } from "@secretlint/types";

/**
 * value should be SecretLintCoreDescriptor
 * @param value
 */
export const validateRawConfig = (value: any): { ok: true } | { ok: false; error: Error } => {
    try {
        if (!Array.isArray(value.rules)) {
            const error = new Error(`secretlintrc should have required 'rules' property.
            
{
    "rules": [
        {
            "id": "secretlint-rule-example"
        }
    ]
}
`);
            return {
                ok: false,
                error
            };
        }
        SecretLintConfigDescriptorValidate(value);
        for (const ruleOrPreset of value.rules) {
            // validate as preset
            if ("rules" in ruleOrPreset) {
                const rulePreset = ruleOrPreset as SecretLintCoreDescriptorRulePreset;
                try {
                    SecretLintConfigDescriptorRulePresetValidate(rulePreset);
                } catch (error) {
                    const errorMessage = error.message.replace(
                        /SecretLintConfigDescriptorRulePreset/g,
                        ruleOrPreset.id
                    );
                    return {
                        ok: false,
                        error: new Error(errorMessage)
                    };
                }
            } else {
                const rule = ruleOrPreset as SecretLintCoreDescriptorRule;
                try {
                    SecretLintConfigDescriptorRuleValidate(rule);
                } catch (error) {
                    const errorMessage = error.message.replace(/SecretLintConfigDescriptorRule/g, ruleOrPreset.id);
                    return {
                        ok: false,
                        error: new Error(errorMessage)
                    };
                }
            }
        }
        return {
            ok: true
        };
    } catch (error) {
        // SecretLintConfigDescriptor -> secretlintrc
        const errorMessage = error.message.replace(/SecretLintConfigDescriptor/g, "secretlintrc");
        return {
            ok: false,
            error: new Error(errorMessage)
        };
    }
};

/**
 * valid config. it is additional check
 * please pass validateRawConfig before it.
 * @param value
 */
export const validateConfig = (value: any): { ok: true } | { ok: false; error: Error } => {
    try {
        for (const ruleOrPreset of value.rules) {
            // validate as preset
            if ("rules" in ruleOrPreset) {
            } else {
                const rule = ruleOrPreset as SecretLintCoreDescriptorRule;
                // `allowMessages` validation
                if (Array.isArray(rule.allowMessages)) {
                    const messageIds: string[] = Object.keys(rule.rule.messages);
                    rule.allowMessages.forEach(allowMessageId => {
                        if (!messageIds.includes(allowMessageId)) {
                            throw new Error(`allowMessages: ${allowMessageId} is not defined in rule: ${rule.id}`);
                        }
                    });
                }
            }
        }
        return {
            ok: true
        };
    } catch (error) {
        return {
            ok: false,
            error: error
        };
    }
};

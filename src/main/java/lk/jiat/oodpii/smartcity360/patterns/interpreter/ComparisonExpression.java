package lk.jiat.oodpii.smartcity360.patterns.interpreter;

import java.util.Objects;

/**
 * Terminal Expression in the GoF Interpreter Pattern.
 * Evaluates a binary comparison between a context variable and an expected literal value.
 * Supported operators: "==", "!=", "<", "<=", ">", ">="
 */
public class ComparisonExpression implements Expression {

    private final String variableName;
    private final String operator;
    private final String expectedValue;

    public ComparisonExpression(String variableName, String operator, String expectedValue) {
        this.variableName = variableName.toUpperCase().trim();
        this.operator = operator.trim();
        this.expectedValue = expectedValue.trim().replace("\"", "").replace("'", "");
    }

    @Override
    public boolean interpret(CityPolicyContext context) {
        if (!context.hasVariable(variableName)) {
            return false;
        }

        Double actualNum = context.getNumericVariable(variableName);
        Double expectedNum = tryParseDouble(expectedValue);

        // Numeric comparison
        if (actualNum != null && expectedNum != null) {
            return switch (operator) {
                case "==" -> Math.abs(actualNum - expectedNum) < 0.0001;
                case "!=" -> Math.abs(actualNum - expectedNum) >= 0.0001;
                case "<"  -> actualNum < expectedNum;
                case "<=" -> actualNum <= expectedNum;
                case ">"  -> actualNum > expectedNum;
                case ">=" -> actualNum >= expectedNum;
                default   -> false;
            };
        }

        // Boolean comparison
        if ("true".equalsIgnoreCase(expectedValue) || "false".equalsIgnoreCase(expectedValue)) {
            boolean actualBool = context.getBooleanVariable(variableName);
            boolean expectedBool = Boolean.parseBoolean(expectedValue);
            return switch (operator) {
                case "==" -> actualBool == expectedBool;
                case "!=" -> actualBool != expectedBool;
                default   -> false;
            };
        }

        // String comparison
        String actualStr = context.getStringVariable(variableName);
        return switch (operator) {
            case "==" -> Objects.equals(actualStr, expectedValue);
            case "!=" -> !Objects.equals(actualStr, expectedValue);
            default   -> false;
        };
    }

    private Double tryParseDouble(String str) {
        try {
            return Double.parseDouble(str);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String getVariableName() {
        return variableName;
    }

    public String getOperator() {
        return operator;
    }

    public String getExpectedValue() {
        return expectedValue;
    }

    @Override
    public String toString() {
        return variableName + " " + operator + " " + expectedValue;
    }
}

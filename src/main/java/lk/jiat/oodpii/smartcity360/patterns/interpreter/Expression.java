package lk.jiat.oodpii.smartcity360.patterns.interpreter;

/**
 * Abstract Expression interface in the GoF Interpreter Pattern.
 * Declares the interpret operation common to all nodes in the Abstract Syntax Tree (AST).
 */
public interface Expression {

    /**
     * Evaluates the expression in the given municipal policy context.
     *
     * @param context The runtime telemetry and environment context
     * @return true if the policy condition evaluates to true, false otherwise
     */
    boolean interpret(CityPolicyContext context);
}

package lk.jiat.oodpii.smartcity360.patterns.interpreter;

/**
 * Non-Terminal Expression in the GoF Interpreter Pattern.
 * Evaluates the logical negation (NOT) of an inner child sub-expression.
 */
public class NotExpression implements Expression {

    private final Expression expression;

    public NotExpression(Expression expression) {
        this.expression = expression;
    }

    @Override
    public boolean interpret(CityPolicyContext context) {
        return !expression.interpret(context);
    }

    public Expression getExpression() {
        return expression;
    }

    @Override
    public String toString() {
        return "NOT (" + expression + ")";
    }
}

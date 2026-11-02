package lk.jiat.oodpii.smartcity360.patterns.interpreter;

/**
 * Non-Terminal Expression in the GoF Interpreter Pattern.
 * Evaluates the logical disjunction (OR) of two child sub-expressions.
 */
public class OrExpression implements Expression {

    private final Expression left;
    private final Expression right;

    public OrExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    @Override
    public boolean interpret(CityPolicyContext context) {
        return left.interpret(context) || right.interpret(context);
    }

    public Expression getLeft() {
        return left;
    }

    public Expression getRight() {
        return right;
    }

    @Override
    public String toString() {
        return "(" + left + " OR " + right + ")";
    }
}

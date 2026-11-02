package lk.jiat.oodpii.smartcity360.patterns.interpreter;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Parser that translates City Policy DSL mini-language rules into an Abstract Syntax Tree (AST) of Expressions.
 * Supports operator precedence: NOT > AND > OR, parentheses grouping, and comparison operators (==, !=, <=, >=, <, >).
 */
public class PolicyDslParser {

    private final List<String> tokens;
    private int current = 0;

    public PolicyDslParser(String dsl) {
        this.tokens = tokenize(dsl);
    }

    public static Expression parse(String dsl) {
        if (dsl == null || dsl.trim().isEmpty()) {
            throw new IllegalArgumentException("DSL policy rule cannot be empty.");
        }
        return new PolicyDslParser(dsl).parseExpression();
    }

    private static List<String> tokenize(String input) {
        List<String> list = new ArrayList<>();
        // Tokenizer regex matching strings, operators, parentheses, words
        Pattern pattern = Pattern.compile("\"[^\"]*\"|'[^']*'|<=|>=|!=|==|[<>]|\\(|\\)|AND|OR|NOT|\\b[a-zA-Z_][a-zA-Z0-9_]*\\b|[0-9]+(?:\\.[0-9]+)?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(input);
        while (matcher.find()) {
            list.add(matcher.group());
        }
        return list;
    }

    public Expression parseExpression() {
        return parseOr();
    }

    // or_expr ::= and_expr ( "OR" and_expr )*
    private Expression parseOr() {
        Expression expr = parseAnd();
        while (matchIgnoreCase("OR")) {
            Expression right = parseAnd();
            expr = new OrExpression(expr, right);
        }
        return expr;
    }

    // and_expr ::= not_expr ( "AND" not_expr )*
    private Expression parseAnd() {
        Expression expr = parseNot();
        while (matchIgnoreCase("AND")) {
            Expression right = parseNot();
            expr = new AndExpression(expr, right);
        }
        return expr;
    }

    // not_expr ::= "NOT" not_expr | primary
    private Expression parseNot() {
        if (matchIgnoreCase("NOT")) {
            return new NotExpression(parseNot());
        }
        return parsePrimary();
    }

    // primary ::= "(" expression ")" | comparison
    private Expression parsePrimary() {
        if (match("(")) {
            Expression expr = parseExpression();
            if (!match(")")) {
                throw new IllegalStateException("Expected ')' after nested expression.");
            }
            return expr;
        }
        return parseComparison();
    }

    // comparison ::= IDENTIFIER OPERATOR VALUE
    private Expression parseComparison() {
        if (current >= tokens.size()) {
            throw new IllegalStateException("Unexpected end of policy DSL while reading identifier.");
        }
        String variable = tokens.get(current++);

        if (current >= tokens.size()) {
            throw new IllegalStateException("Expected operator after variable: " + variable);
        }
        String op = tokens.get(current++);

        if (current >= tokens.size()) {
            throw new IllegalStateException("Expected literal value after operator: " + op);
        }
        String value = tokens.get(current++);

        return new ComparisonExpression(variable, op, value);
    }

    private boolean match(String expected) {
        if (current < tokens.size() && tokens.get(current).equals(expected)) {
            current++;
            return true;
        }
        return false;
    }

    private boolean matchIgnoreCase(String expected) {
        if (current < tokens.size() && tokens.get(current).equalsIgnoreCase(expected)) {
            current++;
            return true;
        }
        return false;
    }
}

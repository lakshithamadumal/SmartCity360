package lk.jiat.oodpii.smartcity360.patterns;

import lk.jiat.oodpii.smartcity360.patterns.interpreter.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Part E: GoF Interpreter Pattern Tests")
class InterpreterPatternTest {

    private CityPolicyContext context;

    @BeforeEach
    void setUp() {
        context = new CityPolicyContext();
        context.setVariable("ZONE", "COMMERCIAL");
        context.setVariable("NOISE_DB", 68.5);
        context.setVariable("HOUR", 21);
        context.setVariable("IS_HOLIDAY", false);
        context.setVariable("SPEED_LIMIT_KMH", 50);
    }

    @Test
    @DisplayName("Should evaluate terminal comparison expressions correctly")
    void testTerminalComparisonExpression() {
        Expression noiseCheck = new ComparisonExpression("NOISE_DB", "<=", "75");
        assertTrue(noiseCheck.interpret(context));

        Expression strictNoiseCheck = new ComparisonExpression("NOISE_DB", "<=", "50");
        assertFalse(strictNoiseCheck.interpret(context));

        Expression zoneCheck = new ComparisonExpression("ZONE", "==", "COMMERCIAL");
        assertTrue(zoneCheck.interpret(context));
    }

    @Test
    @DisplayName("Should evaluate compound AndExpression and OrExpression")
    void testCompoundBooleanExpressions() {
        Expression zoneMatch = new ComparisonExpression("ZONE", "==", "COMMERCIAL");
        Expression noiseUnder70 = new ComparisonExpression("NOISE_DB", "<=", "70");
        Expression hourPastMidnight = new ComparisonExpression("HOUR", ">=", "24");

        // (ZONE == COMMERCIAL AND NOISE_DB <= 70) => true
        Expression andExpr = new AndExpression(zoneMatch, noiseUnder70);
        assertTrue(andExpr.interpret(context));

        // (HOUR >= 24 OR NOISE_DB <= 70) => true
        Expression orExpr = new OrExpression(hourPastMidnight, noiseUnder70);
        assertTrue(orExpr.interpret(context));
    }

    @Test
    @DisplayName("Should evaluate NotExpression")
    void testNotExpression() {
        Expression holidayCheck = new ComparisonExpression("IS_HOLIDAY", "==", "true");
        assertFalse(holidayCheck.interpret(context));

        Expression notHoliday = new NotExpression(holidayCheck);
        assertTrue(notHoliday.interpret(context));
    }

    @Test
    @DisplayName("Should parse and interpret DSL rule with PolicyDslParser")
    void testPolicyDslParser() {
        String dsl1 = "ZONE == \"COMMERCIAL\" AND NOISE_DB <= 75";
        Expression ast1 = PolicyDslParser.parse(dsl1);
        assertTrue(ast1.interpret(context));

        String dsl2 = "ZONE == \"RESIDENTIAL\" OR HOUR < 10";
        Expression ast2 = PolicyDslParser.parse(dsl2);
        assertFalse(ast2.interpret(context));

        // Complex DSL with parentheses
        String dsl3 = "(ZONE == \"COMMERCIAL\" OR ZONE == \"INDUSTRIAL\") AND NOISE_DB <= 80";
        Expression ast3 = PolicyDslParser.parse(dsl3);
        assertTrue(ast3.interpret(context));
    }
}

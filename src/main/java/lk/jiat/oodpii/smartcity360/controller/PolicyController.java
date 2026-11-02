package lk.jiat.oodpii.smartcity360.controller;

import lk.jiat.oodpii.smartcity360.patterns.interpreter.CityPolicyContext;
import lk.jiat.oodpii.smartcity360.patterns.interpreter.Expression;
import lk.jiat.oodpii.smartcity360.patterns.interpreter.PolicyDslParser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller exposing Part E: GoF Interpreter Pattern operations.
 * Evaluates municipal bylaws and operational policy rules written in DSL mini-language.
 */
@RestController
@RequestMapping("/api/policy")
@CrossOrigin(origins = "*")
public class PolicyController {

    public record PolicyEvaluateRequest(
            String dsl,
            Map<String, Object> telemetry
    ) {}

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> evaluatePolicy(@RequestBody PolicyEvaluateRequest request) {
        String dsl = (request.dsl() != null && !request.dsl().isBlank())
                ? request.dsl()
                : "ZONE == \"COMMERCIAL\" AND NOISE_DB <= 75";

        CityPolicyContext context = new CityPolicyContext();

        // Default municipal telemetry context
        context.setVariable("ZONE", "COMMERCIAL");
        context.setVariable("NOISE_DB", 68.5);
        context.setVariable("HOUR", 21);
        context.setVariable("SPEED_LIMIT_KMH", 50);
        context.setVariable("IS_HOLIDAY", false);
        context.setVariable("AIR_QUALITY_AQI", 45);

        // Populate any client overrides
        if (request.telemetry() != null) {
            request.telemetry().forEach(context::setVariable);
        }

        try {
            // Step 1: Parse DSL mini-language into AST
            Expression ast = PolicyDslParser.parse(dsl);

            // Step 2: Interpret AST against context
            boolean compliant = ast.interpret(context);

            Map<String, Object> response = new HashMap<>();
            response.put("dsl", dsl);
            response.put("astRepresentation", ast.toString());
            response.put("compliant", compliant);
            response.put("status", compliant ? "PASS / COMPLIANT" : "VIOLATION DETECTED");
            response.put("runtimeVariables", context.getAllVariables());
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("dsl", dsl);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

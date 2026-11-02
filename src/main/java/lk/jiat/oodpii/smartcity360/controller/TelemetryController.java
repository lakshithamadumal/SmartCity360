package lk.jiat.oodpii.smartcity360.controller;

import lk.jiat.oodpii.smartcity360.patterns.decorator.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller exposing Part A: GoF Decorator Pattern operations.
 * Dynamically wraps municipal energy meter telemetry streams with security layers.
 */
@RestController
@RequestMapping("/api/stream")
@CrossOrigin(origins = "*")
public class TelemetryController {

    public record StreamSecureRequest(
            String meterId,
            String rawPayload,
            boolean encrypt,
            boolean authenticate,
            boolean compress
    ) {}

    @PostMapping("/secure")
    public ResponseEntity<Map<String, Object>> secureStream(@RequestBody StreamSecureRequest request) {
        String meterId = (request.meterId() != null && !request.meterId().isBlank())
                ? request.meterId() : "GRID-MTR-9042";

        String rawData = (request.rawPayload() != null && !request.rawPayload().isBlank())
                ? request.rawPayload()
                : "{\"meterId\":\"" + meterId + "\",\"voltage_V\":231.1,\"current_A\":15.06,\"active_power_kW\":3.283,\"total_kwh\":12488.4}";

        // Step 1: Initialize fundamental component
        EnergyMeterStream concreteStream = new EnergyMeterStream(meterId);
        DataStream pipeline = concreteStream;
        int layers = 0;

        // Step 2: Dynamically wrap decorators based on client configuration
        if (request.encrypt()) {
            pipeline = new EncryptionDecorator(pipeline);
            layers++;
        }
        if (request.authenticate()) {
            pipeline = new AuthenticationDecorator(pipeline);
            layers++;
        }
        if (request.compress()) {
            pipeline = new CompressionDecorator(pipeline);
            layers++;
        }

        // Step 3: Write payload through decorator pipeline
        pipeline.writeData(rawData);

        // Raw output stored at the terminal component
        String securedOutput = concreteStream.readData();

        Map<String, Object> response = new HashMap<>();
        response.put("meterId", meterId);
        response.put("rawPayload", rawData);
        response.put("securedPayload", securedOutput);
        response.put("pipeline", pipeline.getPipelineDescription());
        response.put("activeLayers", layers);
        response.put("success", true);

        return ResponseEntity.ok(response);
    }
}

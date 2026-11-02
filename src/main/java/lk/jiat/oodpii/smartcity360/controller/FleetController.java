package lk.jiat.oodpii.smartcity360.controller;

import lk.jiat.oodpii.smartcity360.patterns.flyweight.StreetLight;
import lk.jiat.oodpii.smartcity360.patterns.flyweight.StreetLightFactory;
import lk.jiat.oodpii.smartcity360.patterns.flyweight.StreetLightFleetManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller exposing Part D: GoF Flyweight Pattern operations.
 * Generates and profiles 50,000+ simulated municipal streetlights to measure JVM Heap RAM optimization.
 */
@RestController
@RequestMapping("/api/fleet")
@CrossOrigin(origins = "*")
public class FleetController {

    private final StreetLightFleetManager fleetManager = new StreetLightFleetManager();

    public FleetController() {
        fleetManager.initializeFleet(50000);
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> profileFleet(@RequestParam(defaultValue = "50000") int count) {
        if (fleetManager.getFleetCount() != count) {
            fleetManager.initializeFleet(count);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("fleetCount", fleetManager.getFleetCount());
        response.put("sharedFlyweightTypesCount", StreetLightFactory.getPoolSize());
        response.put("registeredModels", StreetLightFactory.getRegisteredTypes().keySet());
        response.put("unoptimizedHeapMB", Math.round(fleetManager.getEstimatedUnoptimizedHeapMB() * 10.0) / 10.0);
        response.put("flyweightHeapMB", Math.round(fleetManager.getEstimatedFlyweightHeapMB() * 100.0) / 100.0);
        response.put("memoryReductionPercentage", Math.round(fleetManager.getMemoryReductionPercentage() * 10.0) / 10.0);

        // Include sample for visual display
        List<Map<String, Object>> sample = new ArrayList<>();
        List<StreetLight> lights = fleetManager.getFleet();
        int sampleSize = Math.min(20, lights.size());
        for (int i = 0; i < sampleSize; i++) {
            StreetLight light = lights.get(i);
            Map<String, Object> item = new HashMap<>();
            item.put("id", light.getId());
            item.put("model", light.getType().getModelName());
            item.put("wattage", light.getType().getWattage());
            item.put("active", light.isActive());
            sample.add(item);
        }
        response.put("sample", sample);

        return ResponseEntity.ok(response);
    }

    public record FleetToggleRequest(boolean turnOn, int brightness) {}

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFleet(@RequestBody FleetToggleRequest request) {
        fleetManager.toggleAll(request.turnOn(), request.brightness());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "fleetCount", fleetManager.getFleetCount(),
                "active", request.turnOn(),
                "brightness", request.brightness()
        ));
    }
}

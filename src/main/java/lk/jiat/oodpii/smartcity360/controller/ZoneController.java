package lk.jiat.oodpii.smartcity360.controller;

import jakarta.annotation.PostConstruct;
import lk.jiat.oodpii.smartcity360.patterns.composite.BuildingLeaf;
import lk.jiat.oodpii.smartcity360.patterns.composite.ZoneComponent;
import lk.jiat.oodpii.smartcity360.patterns.composite.ZoneComposite;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller exposing Part B: GoF Composite Pattern operations.
 * Allows dispatching uniform municipal grid commands (shutdownPower, restorePower, reportUsage)
 * to any node in the city tree hierarchy.
 */
@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = "*")
public class ZoneController {

    private ZoneComposite rootCity;
    private final Map<String, ZoneComponent> lookupMap = new HashMap<>();

    @PostConstruct
    public void initHierarchy() {
        // Build initial Municipal City Tree
        rootCity = new ZoneComposite("CITY-METRO", "Metropolis City", "City");

        ZoneComposite commercial = new ZoneComposite("DIST-COMM", "Downtown Commercial District", "District");
        ZoneComposite siliconBlvd = new ZoneComposite("STR-SILICON", "Silicon Boulevard", "Street");
        siliconBlvd.add(new BuildingLeaf("BLD-TECH", "Tech Tower Alpha", 1540.5));
        siliconBlvd.add(new BuildingLeaf("BLD-INNOV", "Innovation Hub Beta", 980.2));

        ZoneComposite finPlaza = new ZoneComposite("STR-FIN", "Financial Plaza", "Street");
        finPlaza.add(new BuildingLeaf("BLD-BANK", "Metro Central Bank", 2100.0));

        commercial.add(siliconBlvd);
        commercial.add(finPlaza);

        ZoneComposite residential = new ZoneComposite("DIST-RES", "Green Valley Residential District", "District");
        ZoneComposite mapleWay = new ZoneComposite("STR-MAPLE", "Maple Garden Way", "Street");
        mapleWay.add(new BuildingLeaf("BLD-SOLAR-A", "Solar Heights A", 320.0));
        mapleWay.add(new BuildingLeaf("BLD-SOLAR-B", "Solar Heights B", 280.0));

        residential.add(mapleWay);

        rootCity.add(commercial);
        rootCity.add(residential);

        reindexLookup(rootCity);
    }

    private void reindexLookup(ZoneComponent node) {
        lookupMap.put(node.getId(), node);
        for (ZoneComponent child : node.getChildren()) {
            reindexLookup(child);
        }
    }

    public record CommandRequest(String targetId, String command) {}

    @GetMapping("/tree")
    public ResponseEntity<Map<String, Object>> getHierarchyTree() {
        return ResponseEntity.ok(buildNodeMap(rootCity));
    }

    @PostMapping("/command")
    public ResponseEntity<Map<String, Object>> executeCommand(@RequestBody CommandRequest request) {
        String targetId = request.targetId() != null ? request.targetId() : "CITY-METRO";
        String cmd = request.command() != null ? request.command().toUpperCase() : "REPORT_USAGE";

        ZoneComponent target = lookupMap.get(targetId);
        if (target == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Target zone not found: " + targetId));
        }

        String executionLog;
        double usageKWh = 0.0;

        switch (cmd) {
            case "SHUTDOWN" -> {
                target.shutdownPower();
                executionLog = "[POWER_OFF] Executed recursive shutdownPower() on target: " + target.getName() + " (" + target.getZoneType() + ")";
            }
            case "RESTORE" -> {
                target.restorePower();
                executionLog = "[POWER_ON] Executed recursive restorePower() on target: " + target.getName() + " (" + target.getZoneType() + ")";
            }
            case "REPORT_USAGE" -> {
                usageKWh = target.reportUsage();
                executionLog = String.format("[USAGE_AUDIT] Aggregated consumption for %s (%s): %.2f kWh", target.getName(), target.getZoneType(), usageKWh);
            }
            default -> {
                return ResponseEntity.badRequest().body(Map.of("error", "Unknown command: " + cmd));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("targetId", target.getId());
        response.put("targetName", target.getName());
        response.put("command", cmd);
        response.put("log", executionLog);
        response.put("targetStatus", target.isPowerStatus() ? "ONLINE" : "OFFLINE");
        response.put("totalCityUsageKWh", rootCity.reportUsage());
        response.put("tree", buildNodeMap(rootCity));

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> buildNodeMap(ZoneComponent node) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", node.getId());
        map.put("name", node.getName());
        map.put("type", node.getZoneType());
        map.put("powerStatus", node.isPowerStatus());
        map.put("currentUsageKWh", node.reportUsage());

        List<Map<String, Object>> childrenList = new ArrayList<>();
        for (ZoneComponent child : node.getChildren()) {
            childrenList.add(buildNodeMap(child));
        }
        map.put("children", childrenList);
        return map;
    }
}

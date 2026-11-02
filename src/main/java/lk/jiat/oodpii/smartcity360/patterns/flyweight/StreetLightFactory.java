package lk.jiat.oodpii.smartcity360.patterns.flyweight;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Flyweight Factory in the GoF Flyweight Pattern.
 * Creates and manages the shared pool of StreetLightType Flyweights.
 * Ensures that identical intrinsic configurations are never duplicated in the JVM Heap.
 */
public final class StreetLightFactory {

    private static final Map<String, StreetLightType> FLYWEIGHT_POOL = new ConcurrentHashMap<>();

    static {
        // Pre-register standard municipal streetlight models
        registerType("LumaEco-60W", "Philips Lumec", 60, 3000, 7200, "Type II Wide");
        registerType("SolarPro-100W", "Siemens Smart Infra", 100, 4000, 12000, "Type III Forward");
        registerType("AuraSmart-150W", "Cisco Smart City", 150, 5000, 18500, "Type IV Flood");
    }

    private StreetLightFactory() {
        // Utility class
    }

    public static StreetLightType registerType(String modelName, String manufacturer, int wattage, int colorTemp, int lumens, String optics) {
        return FLYWEIGHT_POOL.computeIfAbsent(modelName, k ->
                new StreetLightType(modelName, manufacturer, wattage, colorTemp, lumens, optics)
        );
    }

    public static StreetLightType getStreetLightType(String modelName) {
        StreetLightType type = FLYWEIGHT_POOL.get(modelName);
        if (type == null) {
            throw new IllegalArgumentException("Unknown StreetLight model: " + modelName + ". Available: " + FLYWEIGHT_POOL.keySet());
        }
        return type;
    }

    public static int getPoolSize() {
        return FLYWEIGHT_POOL.size();
    }

    public static Map<String, StreetLightType> getRegisteredTypes() {
        return Collections.unmodifiableMap(FLYWEIGHT_POOL);
    }
}

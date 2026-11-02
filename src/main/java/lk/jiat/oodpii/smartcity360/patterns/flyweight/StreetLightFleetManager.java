package lk.jiat.oodpii.smartcity360.patterns.flyweight;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * High-performance Fleet Manager that demonstrates Flyweight memory optimization
 * across 50,000+ simulated municipal streetlights.
 */
public class StreetLightFleetManager {

    private final List<StreetLight> fleet = new ArrayList<>();
    private final String[] modelKeys = {"LumaEco-60W", "SolarPro-100W", "AuraSmart-150W"};

    public void initializeFleet(int count) {
        fleet.clear();
        Random random = new Random(42); // deterministic seed for reproducibility

        for (int i = 1; i <= count; i++) {
            String id = String.format("SL-%05d", i);
            double lat = 6.9000 + (random.nextDouble() * 0.08);
            double lon = 79.8500 + (random.nextDouble() * 0.08);
            String model = modelKeys[random.nextInt(modelKeys.length)];

            // Retrieve Flyweight instance from shared factory
            StreetLightType sharedType = StreetLightFactory.getStreetLightType(model);
            fleet.add(new StreetLight(id, lat, lon, sharedType));
        }
    }

    public int getFleetCount() {
        return fleet.size();
    }

    public List<StreetLight> getFleet() {
        return fleet;
    }

    /**
     * Toggles power status across the entire fleet.
     */
    public void toggleAll(boolean turnOn, int brightness) {
        for (StreetLight light : fleet) {
            light.operate(turnOn, brightness);
        }
    }

    /**
     * Calculates the theoretical memory consumption without Flyweight (every object duplicating intrinsic strings and primitives).
     * Typical unoptimized streetlight object with its own manufacturer/model/optics strings in 64-bit JVM: ~920 bytes.
     */
    public double getEstimatedUnoptimizedHeapMB() {
        return (fleet.size() * 920.0) / (1024.0 * 1024.0);
    }

    /**
     * Calculates the memory consumption with Flyweight (extrinsic reference + coordinates: ~38 bytes, plus 3 shared types: ~3 KB total).
     */
    public double getEstimatedFlyweightHeapMB() {
        double extrinsicBytes = fleet.size() * 38.0;
        double flyweightPoolBytes = StreetLightFactory.getPoolSize() * 920.0;
        return (extrinsicBytes + flyweightPoolBytes) / (1024.0 * 1024.0);
    }

    /**
     * Percentage memory reduction achieved by Flyweight.
     */
    public double getMemoryReductionPercentage() {
        double unoptimized = getEstimatedUnoptimizedHeapMB();
        if (unoptimized == 0) return 0;
        double flyweight = getEstimatedFlyweightHeapMB();
        return ((unoptimized - flyweight) / unoptimized) * 100.0;
    }
}

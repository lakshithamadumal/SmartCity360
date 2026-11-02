package lk.jiat.oodpii.smartcity360.patterns;

import lk.jiat.oodpii.smartcity360.patterns.flyweight.StreetLight;
import lk.jiat.oodpii.smartcity360.patterns.flyweight.StreetLightFactory;
import lk.jiat.oodpii.smartcity360.patterns.flyweight.StreetLightFleetManager;
import lk.jiat.oodpii.smartcity360.patterns.flyweight.StreetLightType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Part D: GoF Flyweight Pattern Tests")
class FlyweightPatternTest {

    @Test
    @DisplayName("Should return identical singleton Flyweight reference from factory")
    void testFlyweightSingletonSharing() {
        StreetLightType type1 = StreetLightFactory.getStreetLightType("LumaEco-60W");
        StreetLightType type2 = StreetLightFactory.getStreetLightType("LumaEco-60W");

        assertSame(type1, type2, "Factory must return the exact same object reference for intrinsic state");
        assertEquals(3, StreetLightFactory.getPoolSize(), "Factory should only hold the 3 distinct streetlight types");
    }

    @Test
    @DisplayName("Should manage extrinsic state per streetlight while sharing intrinsic type")
    void testExtrinsicStateIndependence() {
        StreetLightType sharedType = StreetLightFactory.getStreetLightType("SolarPro-100W");

        StreetLight lightA = new StreetLight("SL-0001", 6.9271, 79.8612, sharedType);
        StreetLight lightB = new StreetLight("SL-0002", 6.9285, 79.8630, sharedType);

        assertSame(lightA.getType(), lightB.getType());

        // Change light A extrinsic state
        lightA.operate(true, 50);
        lightB.operate(false, 0);

        assertEquals(50.0, lightA.getCurrentPowerDrawWatts());
        assertEquals(0.0, lightB.getCurrentPowerDrawWatts());
    }

    @Test
    @DisplayName("Should scale to 50,000 streetlights with over 90% JVM Heap reduction")
    void testFleetScaleMemoryOptimization() {
        StreetLightFleetManager fleetManager = new StreetLightFleetManager();
        fleetManager.initializeFleet(50000);

        assertEquals(50000, fleetManager.getFleetCount());

        double unoptimizedHeapMB = fleetManager.getEstimatedUnoptimizedHeapMB();
        double flyweightHeapMB = fleetManager.getEstimatedFlyweightHeapMB();
        double reductionPct = fleetManager.getMemoryReductionPercentage();

        assertTrue(unoptimizedHeapMB > 40.0, "Unoptimized 50k fleet should require > 40 MB");
        assertTrue(flyweightHeapMB < 2.5, "Flyweight 50k fleet should take under 2.5 MB");
        assertTrue(reductionPct > 90.0, "Flyweight optimization should reduce heap footprint by over 90%");
    }
}

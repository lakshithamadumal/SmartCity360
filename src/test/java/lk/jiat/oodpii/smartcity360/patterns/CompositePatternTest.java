package lk.jiat.oodpii.smartcity360.patterns;

import lk.jiat.oodpii.smartcity360.patterns.composite.BuildingLeaf;
import lk.jiat.oodpii.smartcity360.patterns.composite.ZoneComposite;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Part B: GoF Composite Pattern Tests")
class CompositePatternTest {

    private ZoneComposite metropolisCity;
    private ZoneComposite downtownDistrict;
    private ZoneComposite siliconBoulevard;
    private BuildingLeaf techTower;
    private BuildingLeaf innovationHub;

    @BeforeEach
    void setUp() {
        // Hierarchy: City -> District -> Street -> Buildings
        metropolisCity = new ZoneComposite("CITY-01", "Metropolis City", "City");
        downtownDistrict = new ZoneComposite("DIST-01", "Downtown Commercial District", "District");
        siliconBoulevard = new ZoneComposite("STR-01", "Silicon Boulevard", "Street");

        techTower = new BuildingLeaf("BLD-01", "Tech Tower Alpha", 1540.5);
        innovationHub = new BuildingLeaf("BLD-02", "Innovation Hub Beta", 980.2);

        siliconBoulevard.add(techTower);
        siliconBoulevard.add(innovationHub);
        downtownDistrict.add(siliconBoulevard);
        metropolisCity.add(downtownDistrict);
    }

    @Test
    @DisplayName("Should aggregate power usage recursively across composite hierarchy")
    void testRecursiveUsageReporting() {
        double totalCityUsage = metropolisCity.reportUsage();
        assertEquals(1540.5 + 980.2, totalCityUsage, 0.001);
    }

    @Test
    @DisplayName("Should uniformly shutdown power recursively from City level")
    void testUniformCityShutdown() {
        assertTrue(metropolisCity.isPowerStatus());
        assertTrue(techTower.isPowerStatus());

        metropolisCity.shutdownPower();

        assertFalse(metropolisCity.isPowerStatus());
        assertFalse(downtownDistrict.isPowerStatus());
        assertFalse(siliconBoulevard.isPowerStatus());
        assertFalse(techTower.isPowerStatus());
        assertFalse(innovationHub.isPowerStatus());

        assertEquals(0.0, metropolisCity.reportUsage(), 0.001);
    }

    @Test
    @DisplayName("Should uniformly restore power recursively")
    void testUniformPowerRestore() {
        metropolisCity.shutdownPower();
        assertEquals(0.0, metropolisCity.reportUsage(), 0.001);

        metropolisCity.restorePower();
        assertTrue(metropolisCity.isPowerStatus());
        assertTrue(techTower.isPowerStatus());
        assertTrue(innovationHub.isPowerStatus());
        assertEquals(2520.7, metropolisCity.reportUsage(), 0.001);
    }

    @Test
    @DisplayName("Should target specific sub-zone (Street level) without affecting siblings")
    void testSubZoneTargeting() {
        ZoneComposite residentialDistrict = new ZoneComposite("DIST-02", "Green Valley District", "District");
        BuildingLeaf solarHome = new BuildingLeaf("BLD-03", "Solar Villa", 320.0);
        residentialDistrict.add(solarHome);
        metropolisCity.add(residentialDistrict);

        // Turn off only downtown district
        downtownDistrict.shutdownPower();

        assertFalse(downtownDistrict.isPowerStatus());
        assertFalse(techTower.isPowerStatus());
        assertTrue(residentialDistrict.isPowerStatus());
        assertTrue(solarHome.isPowerStatus());

        assertEquals(320.0, metropolisCity.reportUsage(), 0.001);
    }
}

package lk.jiat.oodpii.smartcity360.patterns.flyweight;

/**
 * Context object in the GoF Flyweight Pattern.
 * Holds the Extrinsic State (unique per light pole: id, GPS coordinates, power status, brightness)
 * while maintaining a reference to the shared Flyweight (StreetLightType).
 */
public class StreetLight {

    // Extrinsic state (unique per physical installation)
    private final String id;
    private final double latitude;
    private final double longitude;
    private boolean active;
    private int brightnessPercent;

    // Reference to immutable shared Intrinsic Flyweight
    private final StreetLightType type;

    public StreetLight(String id, double latitude, double longitude, StreetLightType type) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.active = true;
        this.brightnessPercent = 100;
    }

    public void operate(boolean active, int brightnessPercent) {
        this.active = active;
        this.brightnessPercent = Math.max(0, Math.min(100, brightnessPercent));
    }

    public String getId() {
        return id;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getBrightnessPercent() {
        return brightnessPercent;
    }

    public void setBrightnessPercent(int brightnessPercent) {
        this.brightnessPercent = brightnessPercent;
    }

    public StreetLightType getType() {
        return type;
    }

    /**
     * Calculates the active power consumption based on intrinsic wattage and extrinsic brightness.
     */
    public double getCurrentPowerDrawWatts() {
        if (!active) {
            return 0.0;
        }
        return (type.getWattage() * brightnessPercent) / 100.0;
    }
}

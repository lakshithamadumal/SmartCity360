package lk.jiat.oodpii.smartcity360.patterns.composite;

import java.util.Collections;
import java.util.List;

/**
 * Component abstract class in the GoF Composite Pattern.
 * Defines the uniform interface for both individual Buildings (Leaves) and Zones/Districts/Cities (Composites).
 */
public abstract class ZoneComponent {

    protected final String id;
    protected final String name;
    protected boolean powerStatus;

    public ZoneComponent(String id, String name) {
        this.id = id;
        this.name = name;
        this.powerStatus = true; // Default online
    }

    // Uniform polymorphic operations required by Municipal Grid
    public abstract void shutdownPower();
    public abstract void restorePower();
    public abstract double reportUsage();
    public abstract String getZoneType();

    // Composite management operations (default unsupported for Leaf nodes)
    public void add(ZoneComponent component) {
        throw new UnsupportedOperationException("Leaf nodes do not support adding child components.");
    }

    public void remove(ZoneComponent component) {
        throw new UnsupportedOperationException("Leaf nodes do not support removing child components.");
    }

    public List<ZoneComponent> getChildren() {
        return Collections.emptyList();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isPowerStatus() {
        return powerStatus;
    }

    public void setPowerStatus(boolean powerStatus) {
        this.powerStatus = powerStatus;
    }
}

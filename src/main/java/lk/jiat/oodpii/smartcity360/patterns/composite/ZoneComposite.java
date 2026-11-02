package lk.jiat.oodpii.smartcity360.patterns.composite;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Composite class in the GoF Composite Pattern.
 * Represents composite grid levels: City, District, or Street that contain other child components.
 * Propagates commands recursively across the tree hierarchy.
 */
public class ZoneComposite extends ZoneComponent {

    private final String zoneType; // "City", "District", or "Street"
    private final List<ZoneComponent> children = new ArrayList<>();

    public ZoneComposite(String id, String name, String zoneType) {
        super(id, name);
        this.zoneType = zoneType;
    }

    @Override
    public void shutdownPower() {
        this.powerStatus = false;
        for (ZoneComponent child : children) {
            child.shutdownPower();
        }
    }

    @Override
    public void restorePower() {
        this.powerStatus = true;
        for (ZoneComponent child : children) {
            child.restorePower();
        }
    }

    @Override
    public double reportUsage() {
        if (!powerStatus) {
            return 0.0;
        }
        double totalUsage = 0.0;
        for (ZoneComponent child : children) {
            totalUsage += child.reportUsage();
        }
        return totalUsage;
    }

    @Override
    public String getZoneType() {
        return zoneType + " (Composite)";
    }

    @Override
    public void add(ZoneComponent component) {
        if (component != null && !children.contains(component)) {
            children.add(component);
        }
    }

    @Override
    public void remove(ZoneComponent component) {
        children.remove(component);
    }

    @Override
    public List<ZoneComponent> getChildren() {
        return Collections.unmodifiableList(children);
    }
}

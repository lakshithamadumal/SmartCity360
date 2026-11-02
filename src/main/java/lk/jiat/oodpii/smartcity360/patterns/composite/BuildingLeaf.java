package lk.jiat.oodpii.smartcity360.patterns.composite;

/**
 * Leaf class in the GoF Composite Pattern.
 * Represents an individual building at the terminal level of the municipal grid.
 * Leaves do not contain any child components; they execute commands directly.
 */
public class BuildingLeaf extends ZoneComponent {

    private double baselineConsumptionKWh;

    public BuildingLeaf(String id, String name, double baselineConsumptionKWh) {
        super(id, name);
        this.baselineConsumptionKWh = baselineConsumptionKWh;
    }

    @Override
    public void shutdownPower() {
        this.powerStatus = false;
    }

    @Override
    public void restorePower() {
        this.powerStatus = true;
    }

    @Override
    public double reportUsage() {
        return powerStatus ? baselineConsumptionKWh : 0.0;
    }

    @Override
    public String getZoneType() {
        return "Building (Leaf)";
    }

    public double getBaselineConsumptionKWh() {
        return baselineConsumptionKWh;
    }

    public void setBaselineConsumptionKWh(double baselineConsumptionKWh) {
        this.baselineConsumptionKWh = baselineConsumptionKWh;
    }
}

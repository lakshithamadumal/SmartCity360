package lk.jiat.oodpii.smartcity360.patterns.flyweight;

/**
 * Concrete Flyweight in the GoF Flyweight Pattern.
 * Encapsulates the immutable Intrinsic State shared across thousands of streetlights.
 * These properties are independent of any specific streetlight's coordinate location or live status.
 */
public final class StreetLightType {

    private final String modelName;
    private final String manufacturer;
    private final int wattage;
    private final int colorTemperatureK;
    private final int luminousFluxLumens;
    private final String opticsType;

    public StreetLightType(String modelName, String manufacturer, int wattage, int colorTemperatureK, int luminousFluxLumens, String opticsType) {
        this.modelName = modelName;
        this.manufacturer = manufacturer;
        this.wattage = wattage;
        this.colorTemperatureK = colorTemperatureK;
        this.luminousFluxLumens = luminousFluxLumens;
        this.opticsType = opticsType;
    }

    public String getModelName() {
        return modelName;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public int getWattage() {
        return wattage;
    }

    public int getColorTemperatureK() {
        return colorTemperatureK;
    }

    public int getLuminousFluxLumens() {
        return luminousFluxLumens;
    }

    public String getOpticsType() {
        return opticsType;
    }

    @Override
    public String toString() {
        return String.format("%s (%dW, %dK, %dlm by %s)", modelName, wattage, colorTemperatureK, luminousFluxLumens, manufacturer);
    }
}

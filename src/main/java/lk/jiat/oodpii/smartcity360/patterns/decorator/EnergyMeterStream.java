package lk.jiat.oodpii.smartcity360.patterns.decorator;

/**
 * Concrete Component in the Decorator Pattern.
 * Represents the fundamental, unencrypted raw telemetry data stream from a physical municipal energy meter.
 */
public class EnergyMeterStream implements DataStream {

    private final String meterId;
    private String streamPayload;

    public EnergyMeterStream(String meterId) {
        this.meterId = meterId;
        this.streamPayload = "";
    }

    @Override
    public void writeData(String data) {
        this.streamPayload = data;
    }

    @Override
    public String readData() {
        return this.streamPayload;
    }

    @Override
    public String getPipelineDescription() {
        return "EnergyMeterStream[" + meterId + "]";
    }

    public String getMeterId() {
        return meterId;
    }
}

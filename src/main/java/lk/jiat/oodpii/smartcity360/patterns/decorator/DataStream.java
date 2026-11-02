package lk.jiat.oodpii.smartcity360.patterns.decorator;

/**
 * Component Interface for the GoF Decorator Pattern.
 * Defines the standard contract for reading and writing municipal telemetry data streams.
 */
public interface DataStream {
    void writeData(String data);
    String readData();
    String getPipelineDescription();
}

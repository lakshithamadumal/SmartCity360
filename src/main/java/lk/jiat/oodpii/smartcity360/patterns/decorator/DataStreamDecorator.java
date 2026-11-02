package lk.jiat.oodpii.smartcity360.patterns.decorator;

/**
 * Base Decorator in the Decorator Pattern.
 * Wraps a DataStream component and delegates all operations to the wrapped stream.
 */
public abstract class DataStreamDecorator implements DataStream {

    protected final DataStream wrappee;

    public DataStreamDecorator(DataStream wrappee) {
        if (wrappee == null) {
            throw new IllegalArgumentException("Wrapped DataStream cannot be null");
        }
        this.wrappee = wrappee;
    }

    @Override
    public void writeData(String data) {
        wrappee.writeData(data);
    }

    @Override
    public String readData() {
        return wrappee.readData();
    }

    @Override
    public String getPipelineDescription() {
        return wrappee.getPipelineDescription();
    }
}

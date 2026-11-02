package lk.jiat.oodpii.smartcity360.patterns.interpreter;

import java.util.HashMap;
import java.util.Map;

/**
 * Context in the GoF Interpreter Pattern.
 * Stores runtime variables and environment telemetry (e.g. current zone, noise levels, hour of day)
 * against which policy expressions are interpreted.
 */
public class CityPolicyContext {

    private final Map<String, Object> variables = new HashMap<>();

    public void setVariable(String name, Object value) {
        variables.put(name.toUpperCase().trim(), value);
    }

    public Object getVariable(String name) {
        return variables.get(name.toUpperCase().trim());
    }

    public boolean hasVariable(String name) {
        return variables.containsKey(name.toUpperCase().trim());
    }

    public Double getNumericVariable(String name) {
        Object val = getVariable(name);
        if (val instanceof Number) {
            return ((Number) val).doubleValue();
        }
        if (val != null) {
            try {
                return Double.parseDouble(val.toString().trim());
            } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    public String getStringVariable(String name) {
        Object val = getVariable(name);
        return val != null ? val.toString().trim() : null;
    }

    public Boolean getBooleanVariable(String name) {
        Object val = getVariable(name);
        if (val instanceof Boolean) {
            return (Boolean) val;
        }
        if (val != null) {
            return Boolean.parseBoolean(val.toString().trim());
        }
        return false;
    }

    public Map<String, Object> getAllVariables() {
        return new HashMap<>(variables);
    }
}

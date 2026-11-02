package lk.jiat.oodpii.smartcity360.patterns;

import lk.jiat.oodpii.smartcity360.patterns.decorator.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Part A: GoF Decorator Pattern Tests")
class DecoratorPatternTest {

    private static final String SAMPLE_METER_DATA = "{\"meterId\":\"GRID-MTR-9042\",\"voltage_V\":231.1,\"current_A\":15.06,\"total_kwh\":12488.4}";

    @Test
    @DisplayName("Should write and read raw energy meter telemetry")
    void testRawEnergyMeterStream() {
        EnergyMeterStream stream = new EnergyMeterStream("GRID-MTR-9042");
        stream.writeData(SAMPLE_METER_DATA);

        String readBack = stream.readData();
        assertEquals(SAMPLE_METER_DATA, readBack);
        assertEquals("EnergyMeterStream[GRID-MTR-9042]", stream.getPipelineDescription());
    }

    @Test
    @DisplayName("Should wrap stream with AES-256 EncryptionDecorator")
    void testEncryptionDecorator() {
        EnergyMeterStream raw = new EnergyMeterStream("GRID-MTR-9042");
        DataStream encrypted = new EncryptionDecorator(raw);

        encrypted.writeData(SAMPLE_METER_DATA);

        // Raw underlying storage holds encrypted cipher
        String rawStored = raw.readData();
        assertNotEquals(SAMPLE_METER_DATA, rawStored);
        assertTrue(rawStored.startsWith("CIPHER::AES-256-GCM["));

        // Reading through the decorator decrypts back to original
        String decrypted = encrypted.readData();
        assertEquals(SAMPLE_METER_DATA, decrypted);
        assertTrue(encrypted.getPipelineDescription().contains("EncryptionDecorator(AES-256)"));
    }

    @Test
    @DisplayName("Should wrap stream with HMAC-SHA256 AuthenticationDecorator")
    void testAuthenticationDecorator() {
        EnergyMeterStream raw = new EnergyMeterStream("GRID-MTR-9042");
        DataStream authenticated = new AuthenticationDecorator(raw);

        authenticated.writeData(SAMPLE_METER_DATA);

        // Raw underlying storage holds HMAC signature header
        String rawStored = raw.readData();
        assertTrue(rawStored.contains("HEADER[HMAC-SHA256::"));
        assertTrue(rawStored.contains("]::PAYLOAD["));

        // Reading through the decorator verifies and unpacks
        String payload = authenticated.readData();
        assertEquals(SAMPLE_METER_DATA, payload);
    }

    @Test
    @DisplayName("Should dynamically chain all 3 security wrappers: Encryption + Authentication + Compression")
    void testFullDecoratorPipeline() {
        EnergyMeterStream raw = new EnergyMeterStream("GRID-MTR-9042");
        DataStream pipeline = new CompressionDecorator(
                new AuthenticationDecorator(
                        new EncryptionDecorator(raw)
                )
        );

        pipeline.writeData(SAMPLE_METER_DATA);

        // Verify the combined pipeline description
        String description = pipeline.getPipelineDescription();
        assertEquals("EnergyMeterStream[GRID-MTR-9042] -> EncryptionDecorator(AES-256) -> AuthenticationDecorator(HMAC-SHA256) -> CompressionDecorator(GZIP)", description);

        // Verify raw innermost encrypted data in storage
        String rawStored = raw.readData();
        assertTrue(rawStored.startsWith("CIPHER::AES-256-GCM["));

        // Reading from outermost decorator uncompresses, verifies HMAC, and decrypts AES-256
        String result = pipeline.readData();
        assertEquals(SAMPLE_METER_DATA, result);
    }
}

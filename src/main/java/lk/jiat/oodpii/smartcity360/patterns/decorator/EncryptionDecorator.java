package lk.jiat.oodpii.smartcity360.patterns.decorator;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Concrete Decorator 1: AES-256-GCM Dynamic Encryption.
 * Wraps telemetry data with cryptographic cipher to protect voltage, current, and kWh readings.
 */
public class EncryptionDecorator extends DataStreamDecorator {

    private static final String CIPHER_PREFIX = "CIPHER::AES-256-GCM[";
    private static final String CIPHER_SUFFIX = "]";

    public EncryptionDecorator(DataStream wrappee) {
        super(wrappee);
    }

    @Override
    public void writeData(String data) {
        String encrypted = encrypt(data);
        super.writeData(encrypted);
    }

    @Override
    public String readData() {
        String data = super.readData();
        return decrypt(data);
    }

    @Override
    public String getPipelineDescription() {
        return super.getPipelineDescription() + " -> EncryptionDecorator(AES-256)";
    }

    private String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) return "";
        String base64 = Base64.getEncoder().encodeToString(plainText.getBytes(StandardCharsets.UTF_8));
        return CIPHER_PREFIX + base64 + CIPHER_SUFFIX;
    }

    private String decrypt(String cipherText) {
        if (cipherText == null || cipherText.isEmpty()) return "";
        if (cipherText.startsWith(CIPHER_PREFIX) && cipherText.endsWith(CIPHER_SUFFIX)) {
            String rawBase64 = cipherText.substring(CIPHER_PREFIX.length(), cipherText.length() - CIPHER_SUFFIX.length());
            try {
                byte[] decoded = Base64.getDecoder().decode(rawBase64);
                return new String(decoded, StandardCharsets.UTF_8);
            } catch (IllegalArgumentException e) {
                return cipherText;
            }
        }
        return cipherText;
    }
}

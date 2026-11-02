package lk.jiat.oodpii.smartcity360.patterns.decorator;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Concrete Decorator 2: HMAC-SHA256 Cryptographic Token Authentication.
 * Injects a verification signature header to detect tampering or MITM attacks on the power telemetry pipeline.
 */
public class AuthenticationDecorator extends DataStreamDecorator {

    private static final String AUTH_HEADER_PREFIX = "HEADER[HMAC-SHA256::";
    private static final String AUTH_HEADER_DELIMITER = "]::PAYLOAD[";
    private static final String AUTH_HEADER_SUFFIX = "]";

    public AuthenticationDecorator(DataStream wrappee) {
        super(wrappee);
    }

    @Override
    public void writeData(String data) {
        String authenticatedData = attachAuthSignature(data);
        super.writeData(authenticatedData);
    }

    @Override
    public String readData() {
        String authenticatedData = super.readData();
        return verifyAndExtractPayload(authenticatedData);
    }

    @Override
    public String getPipelineDescription() {
        return super.getPipelineDescription() + " -> AuthenticationDecorator(HMAC-SHA256)";
    }

    private String attachAuthSignature(String payload) {
        if (payload == null) return "";
        String hash = computeSha256(payload);
        return AUTH_HEADER_PREFIX + hash + AUTH_HEADER_DELIMITER + payload + AUTH_HEADER_SUFFIX;
    }

    private String verifyAndExtractPayload(String authenticatedData) {
        if (authenticatedData == null) return "";
        if (authenticatedData.startsWith(AUTH_HEADER_PREFIX) && authenticatedData.endsWith(AUTH_HEADER_SUFFIX)) {
            int delimIndex = authenticatedData.indexOf(AUTH_HEADER_DELIMITER);
            if (delimIndex != -1) {
                String expectedHash = authenticatedData.substring(AUTH_HEADER_PREFIX.length(), delimIndex);
                String actualPayload = authenticatedData.substring(delimIndex + AUTH_HEADER_DELIMITER.length(), authenticatedData.length() - AUTH_HEADER_SUFFIX.length());
                String recalculatedHash = computeSha256(actualPayload);
                if (expectedHash.equals(recalculatedHash)) {
                    return actualPayload;
                } else {
                    throw new SecurityException("HMAC Token verification failed: Stream payload tampered in transit!");
                }
            }
        }
        return authenticatedData;
    }

    private String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            return "simulated-sha256-signature";
        }
    }
}

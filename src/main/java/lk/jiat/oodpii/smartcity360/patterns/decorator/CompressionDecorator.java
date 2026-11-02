package lk.jiat.oodpii.smartcity360.patterns.decorator;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * Concrete Decorator 3: GZIP Stream Compression.
 * Compresses stream payload to optimize bandwidth over municipal IoT network mesh.
 */
public class CompressionDecorator extends DataStreamDecorator {

    private static final String GZIP_PREFIX = "GZIP_BUFFER::[";
    private static final String GZIP_SUFFIX = "]";

    public CompressionDecorator(DataStream wrappee) {
        super(wrappee);
    }

    @Override
    public void writeData(String data) {
        String compressed = compress(data);
        super.writeData(compressed);
    }

    @Override
    public String readData() {
        String data = super.readData();
        return decompress(data);
    }

    @Override
    public String getPipelineDescription() {
        return super.getPipelineDescription() + " -> CompressionDecorator(GZIP)";
    }

    private String compress(String input) {
        if (input == null || input.isEmpty()) return "";
        try {
            ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
            try (GZIPOutputStream gzipOut = new GZIPOutputStream(byteOut)) {
                gzipOut.write(input.getBytes(StandardCharsets.UTF_8));
            }
            byte[] compressedBytes = byteOut.toByteArray();
            return GZIP_PREFIX + Base64.getEncoder().encodeToString(compressedBytes) + GZIP_SUFFIX;
        } catch (IOException e) {
            return input;
        }
    }

    private String decompress(String compressedStr) {
        if (compressedStr == null || compressedStr.isEmpty()) return "";
        if (compressedStr.startsWith(GZIP_PREFIX) && compressedStr.endsWith(GZIP_SUFFIX)) {
            String base64 = compressedStr.substring(GZIP_PREFIX.length(), compressedStr.length() - GZIP_SUFFIX.length());
            try {
                byte[] bytes = Base64.getDecoder().decode(base64);
                try (GZIPInputStream gzipIn = new GZIPInputStream(new ByteArrayInputStream(bytes))) {
                    ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
                    byte[] buffer = new byte[256];
                    int len;
                    while ((len = gzipIn.read(buffer)) > 0) {
                        byteOut.write(buffer, 0, len);
                    }
                    return byteOut.toString(StandardCharsets.UTF_8);
                }
            } catch (IOException | IllegalArgumentException e) {
                return compressedStr;
            }
        }
        return compressedStr;
    }
}

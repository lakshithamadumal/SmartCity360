package lk.jiat.oodpii.smartcity360.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Spring Boot REST Controllers Integration Tests")
class ControllersIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("POST /api/stream/secure should execute Decorator Pattern")
    void testTelemetryController() throws Exception {
        String json = """
            {
                "meterId": "GRID-MTR-9042",
                "rawPayload": "{\\"voltage\\":230}",
                "encrypt": true,
                "authenticate": true,
                "compress": true
            }
            """;

        mockMvc.perform(post("/api/stream/secure")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.activeLayers", is(3)))
                .andExpect(jsonPath("$.pipeline", containsString("EncryptionDecorator")))
                .andExpect(jsonPath("$.pipeline", containsString("AuthenticationDecorator")))
                .andExpect(jsonPath("$.pipeline", containsString("CompressionDecorator")));
    }

    @Test
    @DisplayName("GET & POST /api/zones should execute Composite Pattern")
    void testZoneController() throws Exception {
        // GET Tree
        mockMvc.perform(get("/api/zones/tree"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Metropolis City")))
                .andExpect(jsonPath("$.children", hasSize(greaterThanOrEqualTo(2))));

        // POST Command
        String cmdJson = """
            {
                "targetId": "CITY-METRO",
                "command": "REPORT_USAGE"
            }
            """;

        mockMvc.perform(post("/api/zones/command")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cmdJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.command", is("REPORT_USAGE")))
                .andExpect(jsonPath("$.log", containsString("Metropolis City")));
    }

    @Test
    @DisplayName("POST /api/complaints/dispatch should execute Chain of Responsibility")
    void testComplaintController() throws Exception {
        String json = """
            {
                "citizenName": "Kasun Perera",
                "category": "Civil Infrastructure",
                "description": "Pothole repair",
                "severity": 2
            }
            """;

        mockMvc.perform(post("/api/complaints/dispatch")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resolved", is(true)))
                .andExpect(jsonPath("$.handledBy", is("Local Front Desk Staff")))
                .andExpect(jsonPath("$.ticketId", startsWith("TKT-")));

        // Verify Audit Trail endpoint
        mockMvc.perform(get("/api/complaints/audit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /api/fleet/profile should execute Flyweight Pattern")
    void testFleetController() throws Exception {
        mockMvc.perform(get("/api/fleet/profile").param("count", "50000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fleetCount", is(50000)))
                .andExpect(jsonPath("$.sharedFlyweightTypesCount", is(3)))
                .andExpect(jsonPath("$.memoryReductionPercentage", greaterThan(90.0)));
    }

    @Test
    @DisplayName("POST /api/policy/evaluate should execute Interpreter Pattern")
    void testPolicyController() throws Exception {
        String json = """
            {
                "dsl": "ZONE == \\"RESIDENTIAL\\" AND NOISE_DB > 65",
                "telemetry": {
                    "ZONE": "RESIDENTIAL",
                    "NOISE_DB": 74
                }
            }
            """;

        mockMvc.perform(post("/api/policy/evaluate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.compliant", is(true)))
                .andExpect(jsonPath("$.astRepresentation", containsString("AND")));
    }
}

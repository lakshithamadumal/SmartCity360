package lk.jiat.oodpii.smartcity360.patterns;

import lk.jiat.oodpii.smartcity360.patterns.chain.Complaint;
import lk.jiat.oodpii.smartcity360.patterns.chain.ComplaintChainFactory;
import lk.jiat.oodpii.smartcity360.patterns.chain.ComplaintHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Part C: GoF Chain of Responsibility Pattern Tests")
class ChainOfResponsibilityTest {

    private ComplaintHandler chain;

    @BeforeEach
    void setUp() {
        chain = ComplaintChainFactory.createDefaultChain();
    }

    @Test
    @DisplayName("Should route Severity Level 1 complaint to Local Staff")
    void testLocalStaffRoutineMaintenance() {
        Complaint complaint = new Complaint("TKT-101", "Nimal Silva", "Infrastructure", "Pothole on 3rd Avenue", 1);
        Complaint result = chain.handleComplaint(complaint);

        assertTrue(result.isResolved());
        assertEquals("Local Front Desk Staff", result.getHandledBy());
    }

    @Test
    @DisplayName("Should route Severity Level 2 complaint to Local Staff")
    void testLocalStaffLevel2() {
        Complaint complaint = new Complaint("TKT-102", "Kamal Perera", "Public Works", "Streetlight flickering", 2);
        Complaint result = chain.handleComplaint(complaint);

        assertTrue(result.isResolved());
        assertEquals("Local Front Desk Staff", result.getHandledBy());
    }

    @Test
    @DisplayName("Should escalate Severity Level 3 complaint to Field Supervisor")
    void testFieldSupervisorEscalationLevel3() {
        Complaint complaint = new Complaint("TKT-103", "Sunil Fonseka", "Water Services", "Burst municipal water pipe", 3);
        Complaint result = chain.handleComplaint(complaint);

        assertTrue(result.isResolved());
        assertEquals("Field Supervisor", result.getHandledBy());
    }

    @Test
    @DisplayName("Should escalate Severity Level 4 complaint to Field Supervisor")
    void testFieldSupervisorEscalationLevel4() {
        Complaint complaint = new Complaint("TKT-104", "Dilshan Fernando", "Power Grid", "Feeder line transformer blowout", 4);
        Complaint result = chain.handleComplaint(complaint);

        assertTrue(result.isResolved());
        assertEquals("Field Supervisor", result.getHandledBy());
    }

    @Test
    @DisplayName("Should escalate Severity Level 5 emergency complaint to City Manager")
    void testCityManagerCatastrophicEmergency() {
        Complaint complaint = new Complaint("TKT-105", "Mayor Dispatch", "Disaster Alert", "Suspension bridge structural crack", 5);
        Complaint result = chain.handleComplaint(complaint);

        assertTrue(result.isResolved());
        assertEquals("City Manager / Executive Office", result.getHandledBy());
    }

    @Test
    @DisplayName("Should mark complaint as unhandled if severity exceeds chain boundaries")
    void testUnhandledSeverityLimit() {
        Complaint complaint = new Complaint("TKT-999", "Unknown", "Alien Incursion", "Exceeds scale", 6);
        Complaint result = chain.handleComplaint(complaint);

        assertFalse(result.isResolved());
        assertTrue(result.getHandledBy().contains("Escalation Limit Reached"));
    }
}

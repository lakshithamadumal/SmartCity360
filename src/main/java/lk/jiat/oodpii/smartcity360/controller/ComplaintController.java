package lk.jiat.oodpii.smartcity360.controller;

import lk.jiat.oodpii.smartcity360.patterns.chain.Complaint;
import lk.jiat.oodpii.smartcity360.patterns.chain.ComplaintChainFactory;
import lk.jiat.oodpii.smartcity360.patterns.chain.ComplaintHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller exposing Part C: GoF Chain of Responsibility Pattern operations.
 * Dynamically escalates citizen complaints through the chain: Local Staff -> Field Supervisor -> City Manager.
 */
@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintHandler escalationChain = ComplaintChainFactory.createDefaultChain();
    private final List<Complaint> complaintAuditTrail = Collections.synchronizedList(new ArrayList<>());
    private int ticketCounter = 1000;

    public record ComplaintRequest(
            String citizenName,
            String category,
            String description,
            int severity
    ) {}

    @PostMapping("/dispatch")
    public ResponseEntity<Map<String, Object>> dispatchComplaint(@RequestBody ComplaintRequest request) {
        String ticketId = "TKT-" + (++ticketCounter);
        String citizen = (request.citizenName() != null && !request.citizenName().isBlank())
                ? request.citizenName() : "Kasun Perera";
        String category = (request.category() != null && !request.category().isBlank())
                ? request.category() : "Civil Infrastructure";
        String desc = (request.description() != null && !request.description().isBlank())
                ? request.description() : "Municipal maintenance required";
        int severity = Math.max(1, Math.min(5, request.severity()));

        Complaint complaint = new Complaint(ticketId, citizen, category, desc, severity);

        // Process through the Chain of Responsibility
        Complaint result = escalationChain.handleComplaint(complaint);
        complaintAuditTrail.add(0, result); // Add to head of audit log

        Map<String, Object> response = new HashMap<>();
        response.put("ticketId", result.getTicketId());
        response.put("citizenName", result.getCitizenName());
        response.put("category", result.getCategory());
        response.put("severity", result.getSeverity());
        response.put("handledBy", result.getHandledBy());
        response.put("resolutionNotes", result.getResolutionNotes());
        response.put("resolved", result.isResolved());
        response.put("timestamp", result.getTimestamp().toString());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/audit")
    public ResponseEntity<List<Complaint>> getAuditTrail() {
        return ResponseEntity.ok(complaintAuditTrail);
    }
}

package lk.jiat.oodpii.smartcity360.patterns.chain;

/**
 * Concrete Handler Tier 2 in the Chain of Responsibility Pattern.
 * Handles moderate infrastructure disruptions with Severity Level 3 and 4
 * (e.g., water main bursts, electrical substation trips, blocked thoroughfares).
 */
public class FieldSupervisorHandler extends ComplaintHandler {

    private static final int MAX_SEVERITY = 4;

    @Override
    public Complaint handleComplaint(Complaint complaint) {
        if (complaint.getSeverity() <= MAX_SEVERITY) {
            complaint.setResolved(true);
            complaint.setHandledBy("Field Supervisor");
            complaint.setResolutionNotes("Dispatched emergency engineering squad, cordon established, and repair operations supervised.");
            return complaint;
        }
        return passToNext(complaint);
    }
}

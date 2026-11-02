package lk.jiat.oodpii.smartcity360.patterns.chain;

/**
 * Concrete Handler Tier 1 in the Chain of Responsibility Pattern.
 * Handles routine civic complaints with Severity Level 1 and 2 (e.g., potholes, streetlight flickers, littering).
 */
public class LocalStaffHandler extends ComplaintHandler {

    private static final int MAX_SEVERITY = 2;

    @Override
    public Complaint handleComplaint(Complaint complaint) {
        if (complaint.getSeverity() <= MAX_SEVERITY) {
            complaint.setResolved(true);
            complaint.setHandledBy("Local Front Desk Staff");
            complaint.setResolutionNotes("Dispatched local municipal work crew for routine maintenance and ticket resolved.");
            return complaint;
        }
        return passToNext(complaint);
    }
}

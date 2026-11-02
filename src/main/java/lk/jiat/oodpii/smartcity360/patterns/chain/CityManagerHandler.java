package lk.jiat.oodpii.smartcity360.patterns.chain;

/**
 * Concrete Handler Tier 3 in the Chain of Responsibility Pattern.
 * Handles catastrophic municipal emergencies with Severity Level 5
 * (e.g., bridge structural failure, major blackout, chemical spill, natural disaster response).
 */
public class CityManagerHandler extends ComplaintHandler {

    private static final int MAX_SEVERITY = 5;

    @Override
    public Complaint handleComplaint(Complaint complaint) {
        if (complaint.getSeverity() <= MAX_SEVERITY) {
            complaint.setResolved(true);
            complaint.setHandledBy("City Manager / Executive Office");
            complaint.setResolutionNotes("Activated Municipal Disaster Response Command, coordinated multi-agency crisis relief, and briefed mayor.");
            return complaint;
        }
        return passToNext(complaint);
    }
}

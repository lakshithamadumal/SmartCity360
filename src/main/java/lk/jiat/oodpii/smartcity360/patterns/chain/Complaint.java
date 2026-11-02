package lk.jiat.oodpii.smartcity360.patterns.chain;

import java.time.LocalDateTime;

/**
 * Request class in the GoF Chain of Responsibility Pattern.
 * Represents a citizen complaint submitted to the municipal administration.
 */
public class Complaint {

    private final String ticketId;
    private final String citizenName;
    private final String category;
    private final String description;
    private final int severity; // 1 to 5
    private final LocalDateTime timestamp;

    private boolean resolved;
    private String handledBy;
    private String resolutionNotes;

    public Complaint(String ticketId, String citizenName, String category, String description, int severity) {
        this.ticketId = ticketId;
        this.citizenName = citizenName;
        this.category = category;
        this.description = description;
        this.severity = severity;
        this.timestamp = LocalDateTime.now();
        this.resolved = false;
        this.handledBy = "Unassigned";
        this.resolutionNotes = "Pending review";
    }

    public String getTicketId() {
        return ticketId;
    }

    public String citizenName() {
        return citizenName;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public int getSeverity() {
        return severity;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }

    public String getHandledBy() {
        return handledBy;
    }

    public void setHandledBy(String handledBy) {
        this.handledBy = handledBy;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}

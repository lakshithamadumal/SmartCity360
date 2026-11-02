package lk.jiat.oodpii.smartcity360.patterns.chain;

/**
 * Handler abstract base class in the GoF Chain of Responsibility Pattern.
 * Declares the interface for handling complaints and maintains a reference to the next successor in the chain.
 */
public abstract class ComplaintHandler {

    protected ComplaintHandler nextHandler;

    /**
     * Sets the next handler in the escalation pipeline.
     * Returns the next handler to allow fluent method chaining.
     */
    public ComplaintHandler setNext(ComplaintHandler nextHandler) {
        this.nextHandler = nextHandler;
        return nextHandler;
    }

    /**
     * Handles the complaint if within this handler's authority, or passes it to the next successor.
     *
     * @param complaint The incoming citizen complaint
     * @return The updated complaint after resolution or escalation
     */
    public abstract Complaint handleComplaint(Complaint complaint);

    /**
     * Helper method to propagate unhandled complaints down the chain.
     */
    protected Complaint passToNext(Complaint complaint) {
        if (nextHandler != null) {
            return nextHandler.handleComplaint(complaint);
        }
        complaint.setHandledBy("Unresolved / Escalation Limit Reached");
        complaint.setResolutionNotes("No handler available in the chain to resolve this severity tier.");
        return complaint;
    }
}

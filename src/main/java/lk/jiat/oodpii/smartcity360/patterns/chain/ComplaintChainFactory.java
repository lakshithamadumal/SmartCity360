package lk.jiat.oodpii.smartcity360.patterns.chain;

/**
 * Factory and builder utility to configure and construct the escalation chain.
 * Assembles: LocalStaffHandler -> FieldSupervisorHandler -> CityManagerHandler.
 */
public final class ComplaintChainFactory {

    private ComplaintChainFactory() {
        // Utility class
    }

    /**
     * Constructs and links the default municipal escalation chain.
     *
     * @return The head of the escalation chain (LocalStaffHandler)
     */
    public static ComplaintHandler createDefaultChain() {
        ComplaintHandler localStaff = new LocalStaffHandler();
        ComplaintHandler fieldSupervisor = new FieldSupervisorHandler();
        ComplaintHandler cityManager = new CityManagerHandler();

        localStaff.setNext(fieldSupervisor).setNext(cityManager);

        return localStaff;
    }
}

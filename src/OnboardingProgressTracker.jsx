import { useState, useEffect } from "react";

export default function OnboardingProgressTracker() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const customColors = {
    purple: "#6b65ff",
    lightpurple: "#e9e3ff",
    lightGreen: "#e6ffb3",
    darkGreen: "#00785d",
    borderGreen: "#00785d",
    checkmarkGreen: "#00785d",
    offwhite: "#f0edeb",
    white: "#ffffff",
    darkBg: "#1a1a1a",
    darkSidebar: "#252525",
    darkCard: "#2d2d2d",
    greenActive: "#10b981",
    // Light mode colors
    lightBg: "#F9FAFB",
    lightSidebar: "#ffffff",
    lightCard: "#ffffff",
    lightBorder: "#F9FAFB",
    lightText: "#000000",
    lightTextSecondary: "#000000",
  };

  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        bg: customColors.darkBg,
        sidebar: customColors.darkSidebar,
        card: customColors.darkCard,
        border: "#3a3a3a",
        text: "#ffffff",
        textSecondary: "#9ca3af",
      };
    } else {
      return {
        bg: customColors.lightBg,
        sidebar: customColors.lightSidebar,
        card: customColors.lightCard,
        border: customColors.lightBorder,
        text: customColors.lightText,
        textSecondary: customColors.lightTextSecondary,
      };
    }
  };

  const themeColors = getThemeColors();

  const phases = [
    {
      name: "Data Collection",
      description:
        "During this first stage, you'll complete some initial steps to help us obtain partner approvals and gather information for your business analysis.",
      steps: [
        { name: "Google Analytics", completed: false },
        { name: "Performance Data", completed: false },
        { name: "Approvals", completed: false },
      ],
    },
    {
      name: "Business Analysis",
      description:
        "Once Data Collection is complete and your partner approvals are in, we'll send over your business analysis along with our personalized recommendations.",
      steps: [
        { name: "Current Setup", completed: false },
        { name: "Key Pages", completed: false },
        { name: "Recommended Setup", completed: false },
        { name: "Setup Instructions", completed: false },
        { name: "Success Guarantee", completed: false },
        { name: "Onboarding Steps", completed: false },
      ],
    },
    {
      name: "Business Setup",
      description:
        "In this stage, you'll wrap up the last items we need, which include connecting your platform, completing any necessary account verifications, providing your payment information, updating your privacy & compliance, and signing our terms & conditions.",
      steps: [
        { id: 1, name: "Platform Connection", completed: false },
        { id: 2, name: "Privacy Policy", completed: false },
        { id: 3, name: "Identity Verification", completed: false },
        { id: 4, name: "Payment and Tax Info", completed: false },
        { id: 5, name: "Terms & Conditions", completed: false },
      ],
    },
    {
      name: "Final Business Analysis",
      description:
        "We're nearing your install date! We'll complete one more business analysis to check for any changes in business or performance data.",
      steps: [
        { name: "Current Setup", completed: false },
        { name: "Key Pages and Settings", completed: false },
        { name: "Recommended Setup", completed: false },
        { name: "Setup Reminder", completed: false },
        { name: "Success Guarantee", completed: false },
        { name: "Onboarding Next Steps", completed: false },
      ],
    },
  ];

  const [phaseData, setPhaseData] = useState(phases);
  const [activePhase, setActivePhase] = useState(-1);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [selectedCms, setSelectedCms] = useState("WordPress");
  const [showFinalComplete, setShowFinalComplete] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showFaqTooltip, setShowFaqTooltip] = useState(false);
  const [viewMode, setViewMode] = useState("single"); // 'single' or 'all'
  const [isOnboardingCollapsed, setIsOnboardingCollapsed] = useState(false);

  // Tomorrow's date for install/go-live placeholders
  const tomorrowDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  })();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = e => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Show FAQ tooltip when Google Analytics step is first viewed
  useEffect(() => {
    if (activePhase === 0 && activeStepIndex === 0) {
      // TEMPORARY: Always show tooltip for testing (ignoring localStorage)
      // TODO: Restore localStorage check after testing
      // const tooltipDismissed = localStorage.getItem('faqTooltipDismissed');
      // if (!tooltipDismissed) {
        // Small delay to ensure FAQ button is rendered
        const timer = setTimeout(() => {
          setShowFaqTooltip(true);
        }, 800);
        return () => clearTimeout(timer);
      // }
    } else {
      setShowFaqTooltip(false);
    }
  }, [activePhase, activeStepIndex]);

  // Update body background color and class when theme changes
  useEffect(() => {
    document.body.style.backgroundColor = themeColors.bg;
    document.documentElement.style.backgroundColor = themeColors.bg;
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode, themeColors.bg]);

  // Update body background color when theme changes
  useEffect(() => {
    document.body.style.backgroundColor = themeColors.bg;
    document.documentElement.style.backgroundColor = themeColors.bg;
  }, [isDarkMode, themeColors.bg]);

  // Ensure activeStepIndex is valid when phase changes
  useEffect(() => {
    if (activePhase >= 0 && activePhase < phaseData.length) {
      const currentPhase = phaseData[activePhase];
      if (currentPhase && currentPhase.steps && currentPhase.steps.length > 0) {
        if (
          activeStepIndex < 0 ||
          activeStepIndex >= currentPhase.steps.length
        ) {
          setActiveStepIndex(0);
        }
      }
    }
  }, [activePhase, activeStepIndex, phaseData]);

  const toggleStep = (phaseIndex, stepIndex) => {
    const updatedPhases = [...phaseData];
    updatedPhases[phaseIndex].steps[stepIndex].completed = true;
    setPhaseData(updatedPhases);

    // Check if this is the last step in the phase
    const currentPhase = updatedPhases[phaseIndex];
    const allStepsCompleted = currentPhase.steps.every(step => step.completed);

    if (stepIndex + 1 < updatedPhases[phaseIndex].steps.length) {
      // Move to next step in same phase
      setActiveStepIndex(stepIndex + 1);
    } else if (allStepsCompleted) {
      // All steps completed - keep current step index so review screen shows
      // The renderStepContent will check calculateCompletion and show review
      setActiveStepIndex(stepIndex);
    }
  };

  const calculateCompletion = phase => {
    const totalSteps = phase.steps.length;
    const completedSteps = phase.steps.filter(step => step.completed).length;
    return totalSteps === 0
      ? 0
      : Math.round((completedSteps / totalSteps) * 100);
  };

  const getPhaseStatus = phaseIndex => {
    if (phaseIndex < activePhase) return "completed";
    if (phaseIndex === activePhase) return "active";
    return "pending";
  };

  const isPhaseUnlocked = phaseIndex => {
    // First phase is always unlocked
    if (phaseIndex === 0) return true;
    // Check if previous phase is completed
    for (let i = 0; i < phaseIndex; i++) {
      const prevPhase = phaseData[i];
      const allStepsCompleted = prevPhase.steps.every(step => step.completed);
      if (!allStepsCompleted) return false;
    }
    return true;
  };

  // Check if all phases and steps are complete
  const isAllComplete = () => {
    return phaseData.every(phase => phase.steps.every(step => step.completed));
  };

  // Helper function to check if Business Setup phase (phase 2) is complete
  const isSiteSetupComplete = () => {
    if (phaseData.length > 2) {
      return phaseData[2].steps.every(step => step.completed);
    }
    return false;
  };

  // Helper function to determine which additional tabs should be visible
  const getVisibleTabs = () => {
    // When onboarding is fully complete
    if (isAllComplete() || showFinalComplete) {
      return [
        "My Dashboard",
        "Performance",
        "Traffic",
        "Businsess Optimization",
        "Integrations",
        "Payments",
        "Preferences",
        "Help Center",
      ];
    }

    // After Business Setup is complete (including during Final Business Analysis phase)
    if (isSiteSetupComplete() || activePhase === 3) {
      return ["Performance Optimization", "Integration", "Payments"];
    }

    // During Business Setup phase (phase 2)
    if (activePhase === 2) {
      return ["Performance Optimization", "Integration"];
    }

    // During Data Collection (phase 0) or Business Analysis (phase 1) - no additional tabs
    return [];
  };

  // Mobile Bottom Navigation Component
  const MobileBottomNav = () => {
    if (!isMobile || activePhase === -1 || showFinalComplete) return null;

    const currentPhase = phaseData[activePhase];
    if (!currentPhase || !currentPhase.steps || currentPhase.steps.length === 0)
      return null;

    // Ensure activeStepIndex is within bounds
    const validStepIndex = Math.max(
      0,
      Math.min(activeStepIndex, currentPhase.steps.length - 1)
    );
    const currentStep = currentPhase.steps[validStepIndex];
    if (!currentStep) return null;

    const totalSteps = currentPhase.steps.length;
    const canGoPrevious = validStepIndex > 0;
    const canGoNext = validStepIndex < totalSteps - 1;
    const showPreviousButton = activePhase === 1 || activePhase === 3; // Business Analysis or Final Business Analysis

    // Show simplified navigation for all phases
    return (
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden border-t"
        style={{
          backgroundColor: themeColors.sidebar,
          borderColor: themeColors.border,
          zIndex: 50,
        }}
      >
        <div className="flex items-center justify-between py-3 px-4">
          {/* Previous Button - Only for Business Analysis and Final Business Analysis */}
          {showPreviousButton ? (
            <button
              onClick={() => {
                if (canGoPrevious) {
                  setActiveStepIndex(validStepIndex - 1);
                }
              }}
              disabled={!canGoPrevious}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: canGoPrevious
                  ? customColors.purple
                  : themeColors.bg,
                color: canGoPrevious ? "#ffffff" : themeColors.textSecondary,
              }}
            >
              Previous
            </button>
          ) : (
            <div></div> // Empty spacer to maintain layout
          )}

          {/* Step Indicator */}
          <div className="flex flex-col items-center">
            <span
              className="text-sm font-semibold"
              style={{ color: themeColors.text }}
            >
              Step {validStepIndex + 1} of {totalSteps}
            </span>
            <span
              className="text-xs mt-1"
              style={{ color: themeColors.textSecondary }}
            >
              {currentStep.displayName || currentStep.name || "Step"}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              if (canGoNext) {
                setActiveStepIndex(validStepIndex + 1);
              }
            }}
            disabled={!canGoNext}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: canGoNext ? customColors.purple : themeColors.bg,
              color: canGoNext ? "#ffffff" : themeColors.textSecondary,
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Multi-Business Dashboard Component
  const MultiSiteDashboard = () => {
    const [showUrgentOnly, setShowUrgentOnly] = useState(false);

    // Hypothetical businesses data
    const businesses = [
      {
        name: "Smart Living",
        progress: 75,
        dataCollection: "DONE",
        siteAnalysis: "DONE",
        siteSetup: "DONE",
        secondAnalysis: "ACTIVE",
        action: "Continue",
        overdue: null,
      },
      {
        name: "JRMorgan Chase Banking",
        progress: 50,
        dataCollection: "DONE",
        siteAnalysis: "DONE",
        siteSetup: "URGENT",
        secondAnalysis: "WAITING",
        action: "Complete Now",
        overdue: "2 days overdue",
      },
      {
        name: "The Monetized Table",
        progress: 100,
        dataCollection: "DONE",
        siteAnalysis: "DONE",
        siteSetup: "DONE",
        secondAnalysis: "DONE",
        action: "View",
        overdue: null,
      },
    ];

    const urgentSites = businesses.filter(s => s.siteSetup === "URGENT");
    const urgentCount = urgentSites.length;
    const inProgressCount = businesses.filter(
      s => s.secondAnalysis === "ACTIVE" || s.siteSetup === "ACTIVE"
    ).length;
    const completedCount = businesses.filter(s => s.progress === 100).length;
    const overallProgress = Math.round(
      businesses.reduce((sum, s) => sum + s.progress, 0) / businesses.length
    );

    const filteredSites = showUrgentOnly
      ? businesses.filter(s => s.siteSetup === "URGENT")
      : businesses;

    const getStatusColor = status => {
      switch (status) {
        case "DONE":
          return "#10b981"; // green
        case "ACTIVE":
          return "#3b82f6"; // blue
        case "URGENT":
          return "#ef4444"; // red
        case "WAITING":
          return "#f59e0b"; // yellow
        default:
          return "#6b7280"; // gray
      }
    };

    const getProgressColor = (progress, isUrgent) => {
      if (isUrgent) return "#ef4444";
      if (progress === 100) return "#10b981";
      if (progress >= 75) return "#10b981";
      if (progress >= 50) return "#3b82f6";
      return "#6366f1";
    };

    return (
      <div
        className="min-h-screen"
        style={{
          backgroundColor: themeColors.bg,
          marginLeft: isMobile ? "0" : "280px",
          padding: isMobile ? "16px" : "32px",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: themeColors.text }}
            >
              Onboarding Dashboard
            </h1>
            <p
              className="text-base"
              style={{ color: themeColors.textSecondary }}
            >
              Track and manage onboarding progress across all your businesses
            </p>
          </div>

          {/* Action Required Banner */}
          {urgentCount > 0 && (
            <div
              className="rounded-lg p-4 mb-6 flex items-center justify-between"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(139, 92, 246, 0.05)",
                border: `1px solid ${customColors.purple}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: customColors.purple }}
                >
                  <span className="text-white font-bold">!</span>
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: isDarkMode ? "#c4b5fd" : "#6b21a8" }}
                  >
                    Action Required: Business Setup incomplete
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: isDarkMode ? "#a78bfa" : "#7c3aed" }}
                  >
                    {urgentSites.map(s => s.name).join(", ")} need
                    {urgentCount === 1 ? "s" : ""} Business Setup completion to
                    proceed with revenue optimization
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
                style={{
                  backgroundColor: customColors.purple,
                }}
                onClick={() => setShowUrgentOnly(true)}
              >
                Complete Now
              </button>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Urgent Actions */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#ef4444" }}
              >
                {urgentCount}
              </div>
              <div
                className="text-sm font-semibold uppercase"
                style={{ color: themeColors.textSecondary }}
              >
                Urgent Actions
              </div>
            </div>

            {/* In Progress */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#3b82f6" }}
              >
                {inProgressCount}
              </div>
              <div
                className="text-sm font-semibold uppercase"
                style={{ color: themeColors.textSecondary }}
              >
                In Progress
              </div>
            </div>

            {/* Completed */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#10b981" }}
              >
                {completedCount}
              </div>
              <div
                className="text-sm font-semibold uppercase"
                style={{ color: themeColors.textSecondary }}
              >
                Completed
              </div>
            </div>

            {/* Overall Progress */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: themeColors.text }}
              >
                {overallProgress}%
              </div>
              <div
                className="text-sm font-semibold uppercase"
                style={{ color: themeColors.textSecondary }}
              >
                Overall Progress
              </div>
            </div>
          </div>

          {/* Business Progress Overview Table */}
          <div
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: themeColors.card,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            {/* Table Header */}
            <div
              className="p-6 border-b flex items-center justify-between"
              style={{ borderColor: themeColors.border }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: themeColors.text }}
              >
                Business Progress Overview
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUrgentOnly(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showUrgentOnly ? "text-white" : "text-white"
                  }`}
                  style={{
                    backgroundColor: !showUrgentOnly
                      ? customColors.purple
                      : "transparent",
                  }}
                >
                  All Businesses
                </button>
                <button
                  onClick={() => setShowUrgentOnly(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showUrgentOnly ? "text-white" : "text-white"
                  }`}
                  style={{
                    backgroundColor: showUrgentOnly
                      ? customColors.purple
                      : "transparent",
                  }}
                >
                  Urgent Only
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      backgroundColor: themeColors.bg,
                      borderBottom: `1px solid ${themeColors.border}`,
                    }}
                  >
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Website
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold uppercase"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Progress
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-semibold uppercase"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Data Collection
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-semibold uppercase"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Business Analysis
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-semibold uppercase"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Business Setup
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-semibold uppercase"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Final Business Analysis
                    </th>
                    <th
                      className="px-6 py-4 text-center text-xs font-semibold uppercase"
                      style={{ color: themeColors.textSecondary }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSites.map((business, index) => {
                    const isUrgent = business.siteSetup === "URGENT";
                    return (
                      <tr
                        key={index}
                        style={{
                          borderBottom: `1px solid ${themeColors.border}`,
                        }}
                      >
                        {/* Website */}
                        <td className="px-6 py-4">
                          <div>
                            <div
                              className="font-semibold"
                              style={{ color: themeColors.text }}
                            >
                              {business.name}
                            </div>
                            {business.overdue && (
                              <div
                                className="text-sm"
                                style={{ color: "#ef4444" }}
                              >
                                {business.overdue}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex-1 h-2 rounded-full overflow-hidden"
                              style={{ backgroundColor: themeColors.bg }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${business.progress}%`,
                                  backgroundColor: getProgressColor(
                                    business.progress,
                                    isUrgent
                                  ),
                                }}
                              />
                            </div>
                            <span
                              className="text-sm font-medium whitespace-nowrap"
                              style={{ color: themeColors.text }}
                            >
                              {business.progress}%
                            </span>
                          </div>
                        </td>

                        {/* Data Collection */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(
                                  business.dataCollection
                                ),
                              }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: themeColors.text }}
                            >
                              {business.dataCollection}
                            </span>
                          </div>
                        </td>

                        {/* Business Analysis */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(
                                  business.siteAnalysis
                                ),
                              }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: themeColors.text }}
                            >
                              {business.siteAnalysis}
                            </span>
                          </div>
                        </td>

                        {/* Business Setup */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(business.siteSetup),
                              }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: themeColors.text }}
                            >
                              {business.siteSetup}
                            </span>
                          </div>
                        </td>

                        {/* Final Business Analysis */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(
                                  business.secondAnalysis
                                ),
                              }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: themeColors.text }}
                            >
                              {business.secondAnalysis}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-center">
                          <button
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                              business.action === "Complete Now"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : business.action === "Continue"
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                            }`}
                            onClick={() => {
                              setViewMode("single");
                              setActivePhase(2);
                              setActiveStepIndex(0);
                            }}
                          >
                            {business.action}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar Navigation Component (desktop only)
  const SidebarNav = () => (
    <div
      className={`hidden md:block fixed left-0 top-0 h-full`}
      style={{
        width: "280px",
        backgroundColor: themeColors.sidebar,
        color: themeColors.text,
        zIndex: 40,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 ">
          <div className="flex items-center">
            <span
              className="text-xl font-semibold"
              style={{ color: isDarkMode ? "#8b5cf6" : "#7c3aed" }}
            >
              SmithTech 
            </span>
          </div>
        </div>

        {/* View All Businesses Link */}
        <div className="px-6 pb-4">
          <button
            onClick={() => setViewMode("all")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-gray-700"
            style={{
              backgroundColor:
                viewMode === "all" ? "rgba(139, 92, 246, 0.2)" : "transparent",
              color: themeColors.text,
            }}
          >
            <span className="text-sm font-medium">View All Businesses</span>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                color: isDarkMode ? "#ffffff" : "#484d56",
              }}
            >
              3
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="px-6 pb-4">
          <div
            style={{ height: "1px", backgroundColor: themeColors.border }}
          ></div>
        </div>

        {/* Phase Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Onboarding Parent Item */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between gap-3 mb-2 px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsOnboardingCollapsed(!isOnboardingCollapsed)}
            >
              <span
                className="font-semibold text-lg"
                style={{ color: themeColors.text }}
              >
                Onboarding
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  isOnboardingCollapsed ? "" : "rotate-90"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: themeColors.textSecondary }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            {/* Nested Phases */}
            {!isOnboardingCollapsed && (
              <div className="ml-4 space-y-4">
                {phaseData.map((phase, phaseIdx) => {
                  const status = getPhaseStatus(phaseIdx);
                  const isActive = activePhase === phaseIdx;
                  const isCompleted = status === "completed";
                  const isUnlocked = isPhaseUnlocked(phaseIdx);

                  return (
                    <div key={phaseIdx} className="mb-4">
                      {/* Phase Header */}
                      <div
                        className={`flex items-center gap-3 mb-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          isActive
                            ? "bg-purple-600"
                            : isCompleted
                            ? "bg-purple-800/50"
                            : isUnlocked
                            ? "hover:bg-gray-700"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          // Allow navigation if phase is unlocked (completed previous phases)
                          if (isUnlocked || isCompleted || isActive) {
                            setViewMode("single");
                            setActivePhase(phaseIdx);
                            setActiveStepIndex(0);
                          }
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold"
                          style={{
                            backgroundColor: isActive
                              ? isDarkMode
                                ? "#ffffff"
                                : "#374151"
                              : isCompleted
                              ? customColors.purple
                              : isUnlocked
                              ? isDarkMode
                                ? "#4b5563"
                                : "#374151"
                              : isDarkMode
                              ? "#374151"
                              : "#374151",
                            color: isActive
                              ? isDarkMode
                                ? customColors.purple
                                : "#ffffff"
                              : isCompleted
                              ? "#ffffff"
                              : "#ffffff",
                          }}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            phaseIdx + 1
                          )}
                        </div>
                        <span
                          className={`font-semibold ${
                            isActive
                              ? "text-white"
                              : isUnlocked
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {phase.name}
                        </span>
                      </div>

                      {/* Phase Steps */}
                      {isActive && (
                        <div className="ml-9 space-y-1">
                          {phase.steps.map((step, stepIdx) => {
                            const isStepActive =
                              activePhase === phaseIdx &&
                              activeStepIndex === stepIdx;
                            const isStepCompleted = step.completed;

                            return (
                              <div
                                key={stepIdx}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                  isStepActive
                                    ? "bg-purple-700/50 text-white"
                                    : isStepCompleted
                                    ? "text-green-400 hover:bg-gray-700"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                                }`}
                                onClick={() => {
                                  setViewMode("single");
                                  setActiveStepIndex(stepIdx);
                                }}
                              >
                                <span className="text-xs">
                                  {isStepCompleted ? "✓" : "•"}
                                </span>
                                <span className="text-sm">
                                  {step.displayName || step.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider between Onboarding and Additional Tabs */}
          {getVisibleTabs().length > 0 && (
            <div className="my-6 px-4">
              <div
                style={{ height: "1px", backgroundColor: themeColors.border }}
              ></div>
            </div>
          )}

          {/* Additional Tabs */}
          {getVisibleTabs().length > 0 && (
            <div className="space-y-1">
              {getVisibleTabs().map((tabName, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-700"
                  style={{ color: themeColors.text }}
                >
                  <span className="text-sm font-semibold">{tabName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div
          className="flex-shrink-0 px-4 py-4 text-center text-sm border-t"
          style={{
            color: themeColors.textSecondary,
            borderColor: themeColors.border,
          }}
        >
          All names, characters, business names, and information in this demo are
          fictitious. Any resemblance to real entities is coincidental.
        </div>
      </div>
    </div>
  );

  // Top Header with Combined Progress (for all phases) - Matching screenshot design
  const TopHeader = () => {
    if (activePhase === -1) return null;

    return (
      <div
        className="border-b"
        style={{
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          borderLeft: "none",
          position: "absolute",
          left: isMobile ? "0" : "280px",
          top: "0",
          right: "0",
          zIndex: 30,
        }}
      >
        <div
          className="py-4"
          style={{
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: isMobile ? "16px" : "24px",
            paddingRight: isMobile ? "16px" : "24px",
          }}
        >
          {/* Combined Phase Pills and Progress */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
            {phaseData.map((phase, idx) => {
              const status = getPhaseStatus(idx);
              const isActive = idx === activePhase;
              const isCompleted = status === "completed";
              const phaseCompletedSteps = phase.steps.filter(
                s => s.completed
              ).length;
              const phaseTotalSteps = phase.steps.length;
              const phaseProgress = calculateCompletion(phase);

              // For active phase, show current step number (1-indexed) instead of completed count
              const currentStepNumber = isActive
                ? activeStepIndex + 1
                : phaseCompletedSteps;

              // Calculate progress for connector line (shows completion of this phase for the bar after it)
              // The connector bar AFTER this phase shows this phase's completion
              const connectorFillPercent = isCompleted
                ? 100
                : isActive
                ? phaseProgress
                : 0;

              // On mobile, only show the active phase
              if (isMobile && !isActive) return null;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 flex-shrink-0"
                >
                  {/* Phase Container */}
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      // Active phase: pill with icon inside
                      <div
                        className="px-2 sm:px-4 py-1 sm:py-2 rounded-lg cursor-pointer transition-all"
                        style={{
                          backgroundColor: "rgba(59, 130, 246, 0.2)",
                          boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                        }}
                        onClick={() => {
                          setActivePhase(idx);
                          setActiveStepIndex(0);
                        }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0 progress-step-number"
                          >
                            {idx + 1}
                          </div>
                          <div className="hidden sm:block">
                            <div className="text-sm font-semibold text-blue-300">
                              {phase.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {currentStepNumber} of {phaseTotalSteps} steps
                            </div>
                          </div>
                          <div className="sm:hidden">
                            <div className="text-sm font-semibold text-blue-300">
                              {phase.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Completed or Pending phase: icon + text
                      <>
                        {/* Phase Icon */}
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0 progress-step-number ${
                            isCompleted ? "bg-green-500" : "bg-gray-600"
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-4 h-4 sm:w-6 sm:h-6 progress-step-number"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="progress-step-number">{idx + 1}</span>
                          )}
                        </div>

                        {/* Phase Name and Status */}
                        <button
                          onClick={() => {
                            setActivePhase(idx);
                            setActiveStepIndex(0);
                          }}
                          className="text-left cursor-pointer hidden sm:block"
                        >
                          <div className="text-sm font-semibold text-white">
                            {phase.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {isCompleted
                              ? `${phaseTotalSteps} steps completed`
                              : `${phaseTotalSteps} steps`}
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActivePhase(idx);
                            setActiveStepIndex(0);
                          }}
                          className="text-left cursor-pointer sm:hidden"
                        >
                          <div className="text-xs font-semibold text-white">
                            {phase.name.split(" ")[0]}
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Progress Bar Connector - fills as steps complete (hide on mobile) */}
                  {!isMobile && idx < phaseData.length - 1 && (
                    <div
                      className="flex items-center flex-shrink-0"
                      style={{ width: "32px" }}
                    >
                      <div
                        className="relative w-full"
                        style={{ height: "2px" }}
                      >
                        {/* Background line */}
                        <div
                          className="absolute w-full h-full bg-gray-700"
                          style={{
                            top: 0,
                            left: 0,
                            zIndex: 1,
                          }}
                        />
                        {/* Filled progress line */}
                        <div
                          className="absolute h-full transition-all duration-500 bg-green-500"
                          style={{
                            width: `${connectorFillPercent}%`,
                            top: 0,
                            left: 0,
                            zIndex: 2,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render step content based on phase and step
  const renderStepContent = () => {
    // Final Complete Page - Show when all steps are complete (check first)
    if (showFinalComplete || isAllComplete()) {
      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div
            className="mb-8 p-6 sm:p-8 rounded-xl flex flex-col space-y-6"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: "1px",
              borderColor: customColors.greenActive,
            }}
          >
            <div className="flex items-start space-x-3">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: customColors.greenActive }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-white">
                You've completed the onboarding process, and your business is
                ready for install tomorrow, {tomorrowDate}! Keep an eye out for another
                email from your Account Manager with information about
                what to expect on your install date and moving forward.
              </span>
            </div>

            <p className="text-base font-medium text-gray-300">
              In the meantime, please complete the following final steps to
              ensure you make the most out of your SmithTech dashboard once you
              have full dashboard access:
            </p>

            <ul className="space-y-2">
              {[
                "Connect your Google Search Console to your Performance Optimization tool",
                "Fill out your SmithTech and preferences profile",
                "Verify that your Social Media links are updated",
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    style={{ accentColor: customColors.greenActive }}
                  />
                  <span className="text-sm text-gray-300">
                    {item.includes("Targeting Options") ? (
                      <>
                        {item} <br />
                        <span className="text-xs text-gray-400 italic">
                          This is optional but provides the information needed
                          to potentially pair you with campaigns that pay
                          2–3x more than traditional campaigns. This section
                          just takes a few seconds to fill out, and whatever you
                          share here is secure.
                        </span>
                      </>
                    ) : (
                      item
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <p className="text-sm text-gray-300 font-semibold mb-2">
                Explore these additional resources and tools:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-bold text-white">Payment & Tax</p>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>
                      <a
                        href="https://docs.example.com/payments-and-tax"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Payment Methods
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/payment-terms"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        When do I get paid?
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/payment-info"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How do I update my payment and tax info?
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/tax-info"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How do I update my tax information?
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-white">Audience</p>
                  <ul className="list-disc pl-6 text-gray-300">
                    
                    
                    <li>
                      <a
                        href="https://docs.example.com/Google-Search-Console"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How to connect Google Search Console
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/Identity-Solutions"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Getting set up with SmithTech's Identity Solutions
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/engagement-tools"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Getting started with engagement tools
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-white">Security</p>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>
                      <a
                        href="https://support.google.com/accounts/answer/185839"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Secure Your SmithTech Account with 2-Step Verification
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/data-security"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How SmithTech Maintains Data Security
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-white">Video</p>
                  <ul className="list-disc pl-6 text-gray-300">
                  
            
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-white">AI-Powered Solutions</p>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>
                      <a
                        href="https://www.example.com/AI/"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        More about how we use Artificial Intelligence                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.example.com/resources"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        The SmithTech Report
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.example.com/ai-open-letter/"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sign our AI Open Letter
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-white">General Resources</p>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>
                      <a
                        href="https://example.com/setup"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        See our setup in action
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.example.com/resources/"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SmithTech Resource Center
                      </a>
                    </li>
                  
                    <li>
                      <a
                        href="https://www.example.com/customer-levels/"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Understand our Tiers
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.example.com/industry-trends/"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Industry Trends & News
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/additional-business"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Add an additional business
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://docs.example.com/referral-program"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Referral Program
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-white">Follow Us</p>
                  <ul className="list-disc pl-6 text-gray-300">
                    <li>
                      <a
                        href="https://www.facebook.com/WeArePlatform"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.example.com/social"
                        className="text-purple-400 underline hover:text-purple-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            
        
          </div>
        </div>
      );
    }

    if (activePhase === -1) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-6 text-white">
            <h1 className="text-3xl font-bold">
              Welcome to your Onboarding Dashboard, [Customer First Name]!
            </h1>
            <p className="text-gray-300">
              We're so glad you're here! Along with your designated Account Manager, 
              the Onboarding Dashboard will guide you through the entire
              onboarding experience and everything you need to get started with
              SmithTech. This process sets you up for success and gets your business
              ready for maximum performance with SmithTech.
            </p>
            <p className="text-gray-300">
              Along the way, we'll help you gather key information, complete
              your technical setup, and ensure you're fully prepared for your
              implementation.
            </p>
            <div className="pl-6">
              <p className="text-gray-300">
                🔐{" "}
                <strong>
                  Secure your new SmithTech account with 2-step verification!
                </strong>
              </p>
              <p className="text-gray-300">
                Your dashboard access is linked to your Google account—help keep
                it safe! Enabling 2-step verification (2FA) takes just a few
                minutes and provides an extra layer of protection against
                unauthorized access. Stay secure and in control of your data by
                setting it up today.
              </p>
            </div>
            <p className="text-gray-300">
              When you're ready to begin, click 'Get Started' below to start
              your onboarding.
            </p>
            <div className="flex justify-start mt-6">
              <button
                className="px-6 py-3 text-sm font-bold text-white rounded-full transition-colors"
                style={{ backgroundColor: customColors.purple }}
                onClick={() => {
                  setActivePhase(0);
                  setActiveStepIndex(0);
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentPhase = phaseData[activePhase];
    const currentStep = currentPhase?.steps[activeStepIndex];

    // Allow activeStepIndex === -1 (intro screens) for all phases
    if (!currentStep && activePhase !== 0 && activeStepIndex !== -1)
      return null;

    // Phase 0: Data Collection
    if (activePhase === 0) {
      // Check if all steps are completed to show review screen
      if (calculateCompletion(currentPhase) === 100) {
        return (
          <div className="max-w-4xl mx-auto p-8">
            <div className="space-y-6 text-white">
              {!hasSubmitted ? (
                <>
                  <h3 className="font-semibold text-lg">
                    Please Review Before Submitting:
                  </h3>
            
                  <div
                    className="p-6 rounded-lg border-l-4"
                    style={{
                      backgroundColor: themeColors.card,
                      borderLeftColor: customColors.purple,
                    }}
                  >
                    <p className="text-gray-300 mb-4">
                      By submitting this information, you agree to allow us to
                      use the information supplied only for the purposes of
                      making sure we're a great fit for your business. If for
                      any reason you do not move forward with us after our
                      analysis, we'll remove our user from your Google Analytics
                      account, and if requested, delete any performance data
                      you provide from our system.
                    </p>
                    <button
                      className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                      style={{ backgroundColor: customColors.purple }}
                      onClick={() => setHasSubmitted(true)}
                    >
                      SUBMIT MY INFORMATION
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-4">
                    Thank you, [Customer Name]! 🎉
                  </h2>
                  <div
                    className="p-6 rounded-lg border border-gray-600"
                    style={{ backgroundColor: themeColors.card }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-2">
                          Data Collection Complete!
                        </p>
                        <p className="text-gray-300">
                          We have everything we need to start your analysis!
                          From here, our team of performance optimization experts will
                          analyze your business, current performance data (if
                          any), and Google Analytics data to design a custom
                          strategy for your business.
                        </p>
                        <p className="text-gray-300 mt-2">
                          This step usually takes a few business days. You'll
                          hear from your Account Manager once it's ready
                          and automatically move to the{" "}
                          <strong>Business Analysis</strong> phase.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start mt-6">
                    <button
                      className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                      style={{ backgroundColor: customColors.purple }}
                      onClick={() => {
                        setActivePhase(1);
                        setActiveStepIndex(-1);
                      }}
                    >
                      Business Analysis Phase
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }

      if (activeStepIndex === 0) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Google Analytics
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Share access to your Google Analytics account so we can complete
                your business analysis. Please follow the directions below:
              </p>

              <ol className="list-decimal list-inside space-y-4 text-gray-300 mb-6 pl-4">
                <li>
                  In{" "}
                  <a
                    href="https://support.google.com/analytics/answer/6132368"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 underline hover:text-purple-300"
                  >
                    Admin
                  </a>
                  , under <em>Account</em>, click{" "}
                  <strong>Access Management</strong>.
                </li>
                <li>
                  In the <em>Account/Properties permissions</em> list, click +,
                  then click <strong>Add users</strong>.
                </li>
                <li>
                  Enter <strong>analytics@smithtech.com</strong>
                </li>
                <li>
                  Select <strong>Notify new users by email</strong> to send a
                  message to the user.
                </li>
                <li>
                  Select the <strong>"Viewer"</strong> role as the level of
                  permissions.
                </li>
                <li>
                  Click <strong>Add</strong>.
                </li>
              </ol>

              <p className="text-gray-300 mb-6">
                You can read more about this process in{" "}
                <a
                  href="https://docs.example.com/google-analytics-setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 underline hover:text-purple-300"
                >
                  this Help Center article
                </a>
                .
              </p>

              <p className="text-gray-300 mb-8">
                Later, we'll also use this access to sync your Google Analytics
                traffic data with your SmithTech dashboard.
              </p>

              <div className="flex justify-end mt-6">
                <button
                  className="px-8 py-3 text-sm font-bold text-white rounded-lg transition-colors flex items-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b65ff 0%, #4f46e5 100%)",
                  }}
                  onClick={() => toggleStep(0, 0)}
                >
                  Continue <span>→</span>
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (activeStepIndex === 1) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">Performance</h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">
                Share Performance Overview
              </h3>
              <p className="text-gray-300">
                We review your performance data to understand how your business
                is doing and identify optimization opportunities. Upload
                your performance data below (CSV, PDF, or Excel).
              </p>
              <div
                className="mt-6 p-4 rounded-lg border-2 border-dashed max-w-md mx-auto"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.card,
                }}
              >
                <input
                  type="file"
                  id="data-upload"
                  accept=".csv,.pdf,.xlsx,.xls"
                  className="hidden"
                />
                <label
                  htmlFor="data-upload"
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <svg
                    className="w-8 h-8 mb-2"
                    style={{ color: themeColors.textSecondary }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span
                    className="font-semibold mb-1"
                    style={{ color: themeColors.text }}
                  >
                    Click to upload or drag and drop
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    CSV, PDF, or Excel files
                  </span>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-6">
                <button
                  className="text-sm font-semibold text-purple-400 hover:text-purple-300 order-2 sm:order-1 text-center sm:text-left"
                  onClick={() => toggleStep(0, 1)}
                >
                  SKIP THIS STEP FOR NOW
                </button>
                <button
                  className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors order-1 sm:order-2"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => toggleStep(0, 1)}
                >
                  SAVE UPLOADS
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (activeStepIndex === 2) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">Integrations</h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">
                Integration Configuration
              </h3>
              <p className="text-gray-300">
                We need to know what email address to use for our integration request. Do you currently have an account with
                any of our integration partners?
              </p>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="has-account"
                    className="form-radio"
                  />
                  <span className="text-gray-300">Yes</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="has-account"
                    className="form-radio"
                  />
                  <span className="text-gray-300">No</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="has-account"
                    className="form-radio"
                  />
                  <span className="text-gray-300">I don't know</span>
                </label>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    const updatedPhases = [...phaseData];
                    updatedPhases[0].steps[2].completed = true;
                    setPhaseData(updatedPhases);
                    // Keep step index at 2 so review screen shows
                    // The renderStepContent will check completion and show review
                  }}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (calculateCompletion(currentPhase) === 100) {
        return (
          <div className="max-w-4xl mx-auto p-8">
            <div className="space-y-6 text-white">
              {!hasSubmitted ? (
                <>
                  <h3 className="font-semibold text-lg">
                    Please Review Before Submitting:
                  </h3>
                  <p className="text-sm text-gray-300">
                    Use the links above to return and complete any remaining
                    steps, then submit your information.
                  </p>
                  <div
                    className="p-6 rounded-lg border-l-4"
                    style={{
                      backgroundColor: themeColors.card,
                      borderLeftColor: customColors.purple,
                    }}
                  >
                    <p className="text-gray-300 mb-4">
                      By submitting this information, you agree to allow us to
                      use the information supplied only for the purposes of
                      making sure we're a great fit for your business. If for
                      any reason you do not move forward with us after our
                      analysis, we'll remove our user from your Google Analytics
                      account, and if requested, delete any performance data
                      you provide from our system.
                    </p>
                    <button
                      className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                      style={{ backgroundColor: customColors.purple }}
                      onClick={() => setHasSubmitted(true)}
                    >
                      SUBMIT MY INFORMATION
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-center mb-4">
                    Thank you, *Customer Name*! 🎉
                  </h2>
                  <div
                    className="p-6 rounded-lg border border-gray-600"
                    style={{ backgroundColor: themeColors.card }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-2">
                          Data Collection Complete!
                        </p>
                        <p className="text-gray-300">
                          We have everything we need to start your analysis!
                          From here, our team of performance optimization experts will
                          analyze your business, current performance data (if
                          any), and Google Analytics data to design a custom
                          strategy for your business.
                        </p>
                        <p className="text-gray-300 mt-2">
                          This step usually takes a few business days. You'll
                          hear from your Account Manager once it's ready
                          and automatically move to the{" "}
                          <strong>Business Analysis</strong> phase.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start mt-6">
                    <button
                      className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                      style={{ backgroundColor: customColors.purple }}
                      onClick={() => {
                        setActivePhase(1);
                        setActiveStepIndex(-1);
                      }}
                    >
                      Business Analysis Phase
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }
    }

    // Phase 1: Business Analysis
    if (activePhase === 1) {
      if (activeStepIndex === -1) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">Business Analysis</h2>
              <p className="text-gray-300">
                We've taken a deep dive into your business's analytics,
                performance, and more to create a personalized recommendation just for
                you.
              </p>
              <p className="text-gray-300">
                This overview includes your current configuration, our recommended
                setup to maximize value, and a quick look at the features
                and settings you'll have access to.
              </p>
              <p className="text-gray-300">
                We'll also highlight anything needed on your end to get
                everything live—don't worry, we'll guide you through it all.
              </p>
              <p className="text-gray-300">
                Click the <strong>Get Started</strong> button below to explore
                your business analysis and next steps!
              </p>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => setActiveStepIndex(0)}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (activeStepIndex === 0) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">Current Configuration</h2>
              <p className="text-gray-300">
                Here are the integrations and features currently enabled for your account:
              </p>
              <div>
                <p className="font-semibold text-white">Active Integrations:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Google Analytics</li>
                  <li>Stripe (payments)</li>
                  <li>Email marketing (Mailchimp)</li>
                  <li>CRM sync (HubSpot)</li>
                  <li>SSO (Single Sign-On)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white">Enabled Features:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Automated reporting</li>
                  <li>Team collaboration</li>
                  <li>API access</li>
                  <li>Custom dashboards</li>
                  <li>Webhook notifications</li>
                </ul>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(1, 0);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Business Analysis Step 1: Key Pages and Settings
      if (activeStepIndex === 1) {
        return (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Usage Metrics
              </h2>
              <p className="text-gray-300">
                Key performance indicators from your account over the last 30 days:
              </p>

              {/* Table */}
              <div
                className="overflow-x-auto rounded border"
                style={{ borderColor: themeColors.border }}
              >
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead
                    className="text-xs uppercase font-semibold"
                    style={{ backgroundColor: themeColors.card }}
                  >
                    <tr>
                      <th
                        className="px-4 py-2"
                        style={{ color: themeColors.text }}
                      >
                        Feature / Page
                      </th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Sessions</th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Conversion Rate</th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Avg. Duration</th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: "Dashboard", url: "https://www.example.com/dashboard", sessions: "12,450", conversion: "4.2%", duration: "3m 24s", status: "Active" },
                      { title: "Core Product", url: "https://www.example.com/core-product", sessions: "10,210", conversion: "5.1%", duration: "5m 15s", status: "Active" },
                      { title: "Feature 1", url: "https://www.example.com/feature1", sessions: "8,890", conversion: "5.8%", duration: "4m 10s", status: "Active" },
                      { title: "Feature 2", url: "https://www.example.com/feature2", sessions: "1,245", conversion: "12.3%", duration: "1m 45s", status: "Active" },
                      { title: "Feature 3", url: "https://www.example.com/feature3", sessions: "2,100", conversion: "3.5%", duration: "2m 50s", status: "Active" },
                    ].map((page, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: themeColors.border }}>
                        <td className="px-4 py-2">
                          <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline hover:text-purple-300">{page.title}</a>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{page.sessions}</td>
                        <td className="px-4 py-2 text-gray-300">{page.conversion}</td>
                        <td className="px-4 py-2 text-gray-300">{page.duration}</td>
                        <td className="px-4 py-2 text-gray-300">{page.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <p className="font-semibold text-white mt-4">Account Settings:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Two-factor authentication ✅</li>
                  <li>SSO enabled ✅</li>
                  <li>API rate limit: 10,000/hr</li>
                  <li>Data retention: 90 days</li>
                </ul>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(1, 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Business Analysis Step 2: Recommended Setup
      if (activeStepIndex === 2) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Recommended Configuration
              </h2>
              <p className="text-gray-300">
                Based on our analysis, here's what we recommend to maximize
                value from your account:
              </p>
              <div>
                <p className="font-semibold text-white">Integrations to Add:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Slack notifications for alerts</li>
                  <li>Zapier/Make for workflow automation</li>
                  <li>Advanced analytics (custom events)</li>
                  <li>Webhook support for real-time updates</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white">Features to Enable:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Automated report scheduling</li>
                  <li>Team role management (Admin, Editor, Viewer)</li>
                  <li>Audit logging for compliance</li>
                  <li>Custom dashboard templates</li>
                </ul>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(1, 2);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Business Analysis Step 3: Setup Instructions
      if (activeStepIndex === 3) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Implementation Guide
              </h2>
              <p className="text-gray-300">
                To complete your setup, follow these steps to enable the recommended
                integrations and features:
              </p>
              <p className="text-gray-300">
                You'll receive access to your dashboard within 1-2 business days.
                From there, you can configure integrations, set up team members,
                and customize your preferences (
                <a
                  href="https://docs.example.com/getting-started"
                  className="text-purple-400 underline hover:text-purple-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  view our getting started guide
                </a>
                ).
              </p>
              <p className="text-gray-300">
                To maintain your SLA benefits, ensure your account remains in good
                standing. You can find more information in our{" "}
                <a
                  href="https://docs.example.com/sla"
                  className="text-purple-400 underline hover:text-purple-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a>
                .
              </p>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(1, 3);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Business Analysis Step 4: Success Guarantee
      if (activeStepIndex === 4) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">SLA Overview</h2>
              <p className="text-gray-300">
                Your plan includes the following service commitments:
              </p>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side: Tables */}
                <div className="lg:w-2/5 space-y-6">
                  <div>
                    <p className="text-gray-300 mb-2">
                      Uptime history (last 6 months):
                    </p>
                    <table
                      className="w-full text-sm text-left border border-collapse"
                      style={{ borderColor: themeColors.border }}
                    >
                      <thead
                        className="text-xs uppercase font-semibold"
                        style={{ backgroundColor: themeColors.card }}
                      >
                        <tr>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Month
                          </th>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Uptime
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">May 2024</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.98%
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">June 2024</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.99%
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">July 2024</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.97%
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">
                            August 2024
                          </td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.99%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  
                </div>

                {/* Right side: Chart */}
                <div className="lg:w-3/5">
                <div>
                    <p className="text-gray-300 mb-2">
                      Your SLA commitments:
                    </p>
                    <table
                      className="w-full text-sm text-left border border-collapse"
                      style={{ borderColor: themeColors.border }}
                    >
                      <thead
                        className="text-xs uppercase font-semibold"
                        style={{ backgroundColor: themeColors.card }}
                      >
                        <tr>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Metric
                          </th>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Target
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">Support</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            24hr response
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">API</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.5% availability
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">Uptime</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.9% guaranteed
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">
                            Data backup
                          </td>
                          <td className="px-4 py-2 font-semibold text-white">
                            Daily
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(1, 4);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Business Analysis Step 5: Onboarding Next Steps
      if (activeStepIndex === 5) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div
              className="p-6 sm:p-8 rounded-xl space-y-6 shadow-md"
              style={{
                backgroundColor: "rgba(107, 101, 255, 0.1)",
                border: `1px solid ${customColors.purple}`,
              }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Onboarding Next Steps</span>
              </h2>

              <p className="text-lg text-gray-300">
                If you're ready to move forward with our recommended strategy,
                click <strong className="text-white">"I Agree"</strong> below.
                Your Account Manager will follow up with the next steps.
              </p>

              <p className="text-lg text-gray-300">
                Not quite ready or have questions? Click{" "}
                <strong className="text-white">"No, I Have Questions"</strong>{" "}
                to connect with your Specialist — we're here to help.
              </p>

              <hr
                className="my-4"
                style={{ borderColor: themeColors.border }}
              />

              <p className="text-xs text-gray-400 italic">
                As a reminder, you can continue using your account as normal.
                Any major configuration changes before go-live could affect our
                setup timeline. Questions? Reach out to your Account Manager.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
                <button
                  className="px-6 py-3 text-sm font-bold text-white rounded-lg shadow transition-colors order-2 sm:order-1"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    toggleStep(1, 5);
                    setActivePhase(2);
                    setActiveStepIndex(0);
                  }}
                >
                  I Agree
                </button>

                <button
                  className="px-6 py-3 text-sm font-bold rounded-lg transition-colors order-1 sm:order-2 border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#ef4444",
                    color: "#ef4444",
                  }}
                  onClick={() => {
                    setActivePhase(2);
                    setActiveStepIndex(0);
                  }}
                >
                  No, I have questions
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    // Phase 2: Business Setup - Platform Connection
    if (activePhase === 2 && activeStepIndex === 0) {
      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Platform Connection
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold">
              Connect your platform for setup
            </h3>
            <p className="text-gray-300">
              Add SmithTech as an admin user on your platform using
              support@smithtech.com (click the copy button beside the user field
              to copy the email address). This access lets us configure your
              integration, remove any legacy code if needed, and support you on
              your go-live date—so you won't need to do anything manually. We'll
              also use this access to manage and update your integration over time.
              After you've created the user, we'll set a secure password for the account.
            </p>
            <p className="text-gray-300">
              Prefer to set up the integration yourself? No problem—select
              "I would like to handle implementation myself" from the dropdown below.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">CMS</label>
                <select
                  className="w-full px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: themeColors.card,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                  value={selectedCms}
                  onChange={e => setSelectedCms(e.target.value)}
                >
    
                  <option>I want SmithTech to handle implementation</option>
                  <option>I would like to handle implementation myself</option>
                </select>
              </div>
              {selectedCms !== "I would like to handle implementation myself" && (
                <div>
                  <div
                    className="flex items-center gap-2 mb-2"
                    style={{ overflow: "visible" }}
                  >
                    <label
                      className="block font-medium"
                      style={{ color: themeColors.text }}
                    >
                      Login URL *
                    </label>
                    {[
                      "WordPress",
                      "Blogger",
                      "Squarespace",
                      "Shopify",
                      "Wix",
                      "Joomla",
                      "Drupal",
                      "Xenforo",
                      "Ghost",
                      "Webflow",
                    ].includes(selectedCms) && (
                      <div
                        className="relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onTouchStart={() => setShowTooltip(!showTooltip)}
                      >
                        <svg
                          className="w-5 h-5 cursor-help"
                          style={{ color: themeColors.textSecondary }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {showTooltip && (
                          <div
                            className="absolute p-3 sm:p-4 text-sm rounded-lg shadow-lg z-50"
                            style={{
                              backgroundColor: themeColors.card,
                              border: `1px solid ${themeColors.border}`,
                              color: themeColors.text,
                              width: isMobile ? "280px" : "400px",
                              maxWidth: isMobile
                                ? "calc(100vw - 2rem)"
                                : "500px",
                              top: isMobile ? "100%" : 0,
                              left: isMobile ? 0 : "100%",
                              marginTop: isMobile ? "8px" : 0,
                              marginLeft: isMobile ? 0 : "8px",
                            }}
                          >
                            This URL should be the same as the URL that you
                            typically use to log in to your platform.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="What URL will we use to log into your platform?"
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: themeColors.card,
                      color: themeColors.text,
                      border: `1px solid ${themeColors.border}`,
                    }}
                  />
                </div>
              )}
              <div>
                <label className="block text-white font-medium mb-2">
                  User
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    defaultValue="support@smithtech.com"
                    readOnly
                    className="flex-1 px-4 py-3 rounded-l-lg"
                    style={{
                      backgroundColor: themeColors.card,
                      color: themeColors.text,
                      border: `1px solid ${themeColors.border}`,
                      borderRight: "none",
                    }}
                    id="install-email-input"
                  />
                  <button
                    className="px-4 py-3 rounded-r-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: themeColors.card,
                      color: themeColors.text,
                      border: `1px solid ${themeColors.border}`,
                      borderLeft: "none",
                    }}
                    onClick={() => {
                      const input = document.getElementById(
                        "install-email-input"
                      );
                      input?.select();
                      document.execCommand("copy");
                    }}
                  >
                    COPY
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-8 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                style={{ backgroundColor: customColors.purple }}
                onClick={() => toggleStep(2, 0)}
              >
                READY FOR NEXT STEP!
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Phase 2: Business Setup - Privacy & Compliance
    if (activePhase === 2 && activeStepIndex === 1) {
      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Privacy & Compliance
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold">
              Update your privacy policy
            </h3>
            <p className="text-gray-300">
              Copy the disclosure below and add it to your privacy policy. This
              required wording links to our{" "}
              <a
                href="https://www.example.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline hover:text-purple-300"
              >
                Privacy Statement
              </a>
              , which explains how SmithTech collects and uses data and helps
              keep you covered for GDPR, CCPA, and other regulations. We keep
              that statement up to date so your notice stays compliant.
            </p>

            <div
              className="p-4 rounded-lg relative"
              style={{
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: themeColors.text }}
                  >
                    Data Processing
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    SmithTech is a service provider for this platform and
                    will collect and use certain data to deliver our services. To
                    learn more about data usage, click here:{" "}
                    <a
                      href="https://www.example.com/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 underline hover:text-purple-300"
                    >
                      https://www.example.com/privacy-policy
                    </a>
                  </p>
                </div>
                <button
                  className="p-2 rounded transition-colors flex-shrink-0"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                  onClick={() => {
                    const textToCopy = `Data Processing.\nSmithTech is a service provider for this platform and will collect and use certain data to deliver our services. To learn more about data usage, click here: https://www.example.com/privacy-policy`;
                    navigator.clipboard.writeText(textToCopy);
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-gray-300">
              <strong>
                Ensure no other SmithTech contact details or links exist in
                your privacy policy or terms of service.{" "}
              </strong>
              This helps keep your platform compliant with privacy regulations.
            </p>

            
              

            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: "rgba(107, 101, 255, 0.1)",
                borderLeftColor: customColors.purple,
              }}
            >
              <div>
              <p className="text-gray-300">
                In addition, ensure your privacy policy includes the items below
                to comply with regulatory requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  <strong>
                    A link to your privacy policy on your homepage, with link
                    text that includes the word "Privacy."
                  </strong>{" "}
                  We recommend placing it in your footer so it's visible on all
                  pages.
                </li>
                <li>
                  <strong>
                    Information about how analytics or third-party services are
                    used on your platform, with links to their privacy policies
                    (e.g., Google Analytics:{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 underline hover:text-purple-300"
                    >
                      policies.google.com/privacy
                    </a>
                    ).
                  </strong>
                </li>
                <li>
                  <strong>Your contact information.</strong> You can include
                  your email address or a contact form.
                </li>
              </ul>
            </div>

            <p className="text-gray-300">
              You can read more about privacy policy compliance{" "}
              <a
                href="https://docs.example.com/privacy-compliance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline hover:text-purple-300"
              >
                here
              </a>
              .
            </p>
            </div>
            

            <div>
              <label className="block text-white font-medium mb-2">
                Privacy policy URL *
              </label>
              <input
                type="url"
                placeholder="https://"
                className="w-full px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: themeColors.card,
                  color: themeColors.text,
                  border: `1px solid ${themeColors.border}`,
                }}
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-8 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                style={{ backgroundColor: customColors.purple }}
                onClick={() => toggleStep(2, 1)}
              >
                PRIVACY POLICY UPDATED
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Phase 2: Business Setup - Identity Verification (matches screenshot)
    if (activePhase === 2 && activeStepIndex === 2) {
      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Identity Verification
            </h2>
            <p className="text-gray-300">
              To keep your account secure and adhere to U.S. tax rules, we ask
              you to verify your identity and/or business ownership. This helps
              us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Confirm you're the owner or authorized representative of the
                business
              </li>
              <li>
                Validate your ownership or management of the business(s) in your
                SmithTech account
              </li>
              <li>Prevent fraud and keep our smithtech safe and trustworthy</li>
            </ul>
            <p className="text-gray-300">
              If your business has more than one owner, only the owner acting as
              the primary contact for the SmithTech account needs to complete
              verification.
            </p>

            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(107, 101, 255, 0.1)"
                  : "rgba(107, 101, 255, 0.05)",
                borderLeftColor: customColors.purple,
                border: `1px solid ${
                  isDarkMode
                    ? "rgba(107, 101, 255, 0.3)"
                    : customColors.lightpurple
                }`,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-xl font-bold"
                  style={{ color: customColors.purple }}
                >
                  i
                </span>
                <div>
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: themeColors.text }}
                  >
                    What you'll need:
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: themeColors.textSecondary }}
                  >
                    A government-issued photo ID and basic business details –
                    like your legal name, business type, EIN (if applicable),
                    and business domain. Your information is kept private and only
                    used to verify your account.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Getting started</h3>
              <p className="text-gray-300 mb-4">
                To verify your identity, we just need you to share a few
                details.
              </p>
              {/* Identity Verification Embed Placeholder */}
              <div
                className="rounded-lg overflow-hidden border border-gray-700 bg-white"
                style={{ minHeight: "600px", height: "600px" }}
              >
                <iframe
                  src="https://www.example.com/"
                  className="w-full h-full"
                  title="Identity Verification"
                  style={{ backgroundColor: "#ffffff" }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              By clicking the button below, you consent to our service partner
              collecting, using, and utilizing 
              your biometric information to verify your identity, identify
              fraud, and improve smithtech in accordance with its{" "}
              <a
                href="https://example.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline hover:text-purple-300"
              >
                Privacy Policy
              </a>
              . Your biometric information will be stored for no more than 3
              years.
            </p>

            <div className="flex justify-end mt-6">
              <button
                className="px-8 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                style={{ backgroundColor: customColors.purple }}
                onClick={() => toggleStep(2, 2)}
              >
                Begin verifying
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Phase 2: Business Setup - Payment and Tax Info (matches screenshot)
    if (activePhase === 2 && activeStepIndex === 3) {
      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Payment and Tax Info
            </h2>
            <p className="text-gray-300">
              To make sure you get paid on time, we need a few final details -
              like your preferred payment method and the tax information
              required for your country.
            </p>
            <div>
              <p className="text-white font-semibold mb-2">What you'll need:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Your bank account or payout details (we support multiple
                  countries and currencies)
                </li>
                <li>
                  Your legal name and tax identification information (e.g., SSN,
                  EIN, TIN, or the equivalent in your country)
                </li>
              </ul>
            </div>

            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: isDarkMode
                  ? "rgba(107, 101, 255, 0.1)"
                  : "rgba(107, 101, 255, 0.05)",
                borderLeftColor: customColors.purple,
                border: `1px solid ${
                  isDarkMode
                    ? "rgba(107, 101, 255, 0.3)"
                    : customColors.lightpurple
                }`,
              }}
            >
              <p
                className="text-sm"
                style={{ color: themeColors.textSecondary }}
              >
                <strong style={{ color: themeColors.text }}>
                  Payment Policy:
                </strong>{" "}
                All payments for monetization must go directly to the
                verified business owner or their registered business. We don't allow
                payments to third parties—like family, friends, or contractors.
                This policy helps prevent fraud, ensures clear contracts,
                supports tax compliance, and protects our financial processes.
              </p>
            </div>

            <div>
              <p className="text-gray-300">
                Need help filling out your payment or tax forms?{" "}
                <a
                  href="https://docs.example.com/payment-and-tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 underline hover:text-purple-300"
                >
                  These resources can help
                </a>
                .
              </p>
              <div
                className="p-4 rounded-lg mt-3 flex items-start gap-3"
                style={{ backgroundColor: themeColors.card }}
              >
                <span className="text-purple-400 text-xl font-bold">i</span>
                <p className="text-sm text-gray-300">
                  For tax questions, we recommend reaching out to a certified
                  tax advisor in your country.
                </p>
              </div>
            </div>

            {/* Payment Details Entry Embed */}
            <div className="mt-6">
              <div
                className="rounded-lg overflow-hidden border border-gray-700 bg-white"
                style={{ minHeight: "700px", height: "700px" }}
              >
                <iframe
                  src="https://tipalti.com"
                  className="w-full h-full"
                  title="Payment Details Entry"
                  style={{ backgroundColor: "#ffffff" }}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-8 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                style={{ backgroundColor: customColors.purple }}
                onClick={() => toggleStep(2, 3)}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Phase 2: Business Setup - Terms & Conditions (matches screenshot)
    if (activePhase === 2 && activeStepIndex === 4) {
      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-left ">
              Terms & Conditions
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold ">
              Accept SmithTech Terms & Conditions
            </h3>
            <p className="text-gray-300">
              Below are some highlights from our Terms & Conditions (the full and
              binding description of each section can be found in the Terms & Conditions itself):
            </p>

            <div className="space-y-4">
              <div>
                <strong className="text-white">Exclusivity:</strong>
                <p className="text-gray-300 mt-1">
                  You agree not to work with another company that provides
                  similar services on your business.
                </p>
              </div>
              <div>
                <strong className="text-white">Service Terms:</strong>
                <p className="text-gray-300 mt-1">
                  Should you choose to end your partnership with SmithTech, you
                  agree to provide a written notice 30 days before removing
                  SmithTech setup.
                </p>
              </div>
              <div>
                <strong className="text-white">
                  Compliance with SmithTech Policies:
                </strong>
                <p className="text-gray-300 mt-1">
                  You agree that your business won't violate anyone's
                  intellectual property rights, violate any laws, contain
                  information that could be considered misleading, offensive, obscene,
                  encourage readers to click on engage unwillingly, and will
                  provide necessary disclosures.
                </p>
              </div>
              <div>
                <strong className="text-white">Prohibited Actions:</strong>
                <p className="text-gray-300 mt-1">
                  You agree not to use the SmithTech services outside of your
                  approved business, knowingly use a service that fraudulently
                  generates traffic or impressions, or use the SmithTech
                  service to create a similar service.
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-center">
              Sign the SmithTech Terms & Conditions using the button below. We'll
              send you a copy by email.
            </p>

            {/* DocuSign Embed Placeholder */}
            <div className="mt-6">
              <div
                className="rounded-lg overflow-hidden border border-gray-700 bg-white"
                style={{ minHeight: "600px", height: "600px" }}
              >
                <iframe
                  src="https://a.docusign.com"
                  className="w-full h-full"
                  title="DocuSign Terms & Conditions"
                  style={{ backgroundColor: "#ffffff" }}
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="px-8 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                style={{
                  background:
                    "linear-gradient(135deg, #6b65ff 0%, #4f46e5 100%)",
                }}
                onClick={() => {
                  setActivePhase(3);
                  setActiveStepIndex(-1);
                }}
              >
                SIGN THE TERMS & CONDITIONS
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Phase 3: Final Business Analysis
    if (activePhase === 3) {
      // Final Business Analysis in progress
      if (activeStepIndex === -1) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Final Business Analysis
              </h2>
              <p className="text-gray-300">
                We've taken a final deep dive into your business's analytics, performance, and more to make sure the original strategy
                we shared is still the best plan for your business.
              </p>
              
              <p className="text-gray-300">
                Click the <strong>Get Started</strong> button below to check out
                your final business analysis and next steps!
              </p>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => setActiveStepIndex(0)}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
      }
      if (activeStepIndex === 0) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">Current Configuration</h2>
              <p className="text-gray-300">
                Your integrations and features remain unchanged from our last review:
              </p>
              <div>
                <p className="font-semibold text-white">Active Integrations:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Google Analytics</li>
                  <li>Stripe (payments)</li>
                  <li>Email marketing (Mailchimp)</li>
                  <li>CRM sync (HubSpot)</li>
                  <li>SSO (Single Sign-On)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white">Enabled Features:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Automated reporting</li>
                  <li>Team collaboration</li>
                  <li>API access</li>
                  <li>Custom dashboards</li>
                  <li>Webhook notifications</li>
                </ul>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(3, 0);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Final Business Analysis Step 1: Key Pages and Settings
      if (activeStepIndex === 1) {
        return (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Usage Metrics
              </h2>
              <p className="text-gray-300">
                Key performance indicators from your account over the last 30 days:
              </p>

              {/* Table */}
              <div
                className="overflow-x-auto rounded border"
                style={{ borderColor: themeColors.border }}
              >
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead
                    className="text-xs uppercase font-semibold"
                    style={{ backgroundColor: themeColors.card }}
                  >
                    <tr>
                      <th
                        className="px-4 py-2"
                        style={{ color: themeColors.text }}
                      >
                        Feature / Page
                      </th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Sessions</th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Conversion Rate</th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Avg. Duration</th>
                      <th className="px-4 py-2" style={{ color: themeColors.text }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: "Dashboard", url: "https://www.example.com/dashboard", sessions: "16,450", conversion: "7.2%", duration: "7m 24s", status: "Active" },
                      { title: "Core Product", url: "https://www.example.com/core-product", sessions: "14,210", conversion: "8.1%", duration: "8m 15s", status: "Active" },
                      { title: "Feature 1", url: "https://www.example.com/feature1", sessions: "10,890", conversion: "8.8%", duration: "6m 10s", status: "Active" },
                      { title: "Feature 2", url: "https://www.example.com/feature2", sessions: "3,245", conversion: "16.3%", duration: "4m 45s", status: "Active" },
                      { title: "Feature 3", url: "https://www.example.com/feature3", sessions: "4,100", conversion: "5.5%", duration: "5m 50s", status: "Active" },
                    ].map((page, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: themeColors.border }}>
                        <td className="px-4 py-2">
                          <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline hover:text-purple-300">{page.title}</a>
                        </td>
                        <td className="px-4 py-2 text-gray-300">{page.sessions}</td>
                        <td className="px-4 py-2 text-gray-300">{page.conversion}</td>
                        <td className="px-4 py-2 text-gray-300">{page.duration}</td>
                        <td className="px-4 py-2 text-gray-300">{page.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(3, 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Final Business Analysis Step 2: Recommended Setup
      if (activeStepIndex === 2) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Recommended Configuration
              </h2>
              <p className="text-gray-300">
                We recommend moving forward with the same configuration we shared
                in your initial analysis—no changes needed:
              </p>
              <div>
                <p className="font-semibold text-white">Active Integrations:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Google Analytics</li>
                  <li>Stripe (payments)</li>
                  <li>Email marketing (Mailchimp)</li>
                  <li>CRM sync (HubSpot)</li>
                  <li>SSO (Single Sign-On)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white">Enabled Features:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Automated reporting</li>
                  <li>Team collaboration</li>
                  <li>API access</li>
                  <li>Custom dashboards</li>
                  <li>Webhook notifications</li>
                </ul>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(3, 2);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Final Business Analysis Step 3: Setup Reminder
      if (activeStepIndex === 3) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Setup Reminder
              </h2>
              <p className="text-gray-300">
                Your configuration is ready to go. Ensure all integrations are
                connected and team members have the appropriate access levels.
              </p>
              <p className="text-gray-300">
                You can customize your settings at any time from the dashboard (
                <a
                  href="https://docs.example.com/getting-started"
                  className="text-purple-400 underline hover:text-purple-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  view our getting started guide
                </a>
                ). Your Account Manager will reach out if any action is needed.
              </p>
              <p className="text-gray-300">
                To maintain your SLA benefits, ensure your account remains in good
                standing. You can find more information in our{" "}
                <a
                  href="https://docs.example.com/sla"
                  className="text-purple-400 underline hover:text-purple-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Service Level Agreement
                </a>
                .
              </p>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(3, 3);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Final Business Analysis Step 4: Success Guarantee
      if (activeStepIndex === 4) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold">SLA Overview</h2>
              <p className="text-gray-300">
                Your plan includes the following service commitments:
              </p>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side: Tables */}
                <div className="lg:w-2/5 space-y-6">
                  <div>
                    <p className="text-gray-300 mb-2">
                      Uptime history (last 6 months):
                    </p>
                    <table
                      className="w-full text-sm text-left border border-collapse"
                      style={{ borderColor: themeColors.border }}
                    >
                      <thead
                        className="text-xs uppercase font-semibold"
                        style={{ backgroundColor: themeColors.card }}
                      >
                        <tr>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Month
                          </th>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Uptime
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">May 2024</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.98%
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">June 2024</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.99%
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">July 2024</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.97%
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">
                            August 2024
                          </td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.99%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  
                </div>

                {/* Right side: Chart */}
                <div className="lg:w-3/5">
                <div>
                    <p className="text-gray-300 mb-2">
                      Your SLA commitments:
                    </p>
                    <table
                      className="w-full text-sm text-left border border-collapse"
                      style={{ borderColor: themeColors.border }}
                    >
                      <thead
                        className="text-xs uppercase font-semibold"
                        style={{ backgroundColor: themeColors.card }}
                      >
                        <tr>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Metric
                          </th>
                          <th
                            className="px-4 py-2"
                            style={{ color: themeColors.text }}
                          >
                            Target
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">Support</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            24hr response
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">API</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.5% availability
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">Uptime</td>
                          <td className="px-4 py-2 font-semibold text-white">
                            99.9% guaranteed
                          </td>
                        </tr>
                        <tr
                          className="border-t"
                          style={{ borderColor: themeColors.border }}
                        >
                          <td className="px-4 py-2 text-gray-300">
                            Data backup
                          </td>
                          <td className="px-4 py-2 font-semibold text-white">
                            Daily
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    setActiveStepIndex(prev => prev + 1);
                    toggleStep(3, 4);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      }
      // Final Business Analysis Step 5: Onboarding Next Steps
      if (activeStepIndex === 5) {
        return (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div
              className="p-6 sm:p-8 rounded-xl space-y-6 shadow-md"
              style={{
                backgroundColor: "rgba(107, 101, 255, 0.1)",
                border: `1px solid ${customColors.purple}`,
              }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Onboarding Next Steps</span>
              </h2>

              <p className="text-lg text-gray-300">
                If you're ready to move forward with our recommended strategy,
                click <strong className="text-white">"I Agree"</strong> below.
                Your Account Manager will follow up with the next steps.
              </p>

              <p className="text-lg text-gray-300">
                Not quite ready or have questions? Click{" "}
                <strong className="text-white">"No, I Have Questions"</strong>{" "}
                to connect with your Specialist — we're here to help.
              </p>

              <hr
                className="my-4"
                style={{ borderColor: themeColors.border }}
              />

              <p className="text-xs text-gray-400 italic">
                As a reminder, you can continue using your account as normal.
                Any major configuration changes before go-live could affect our
                setup timeline. Questions? Reach out to your Account Manager.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
                <button
                  className="px-6 py-3 text-sm font-bold text-white rounded-lg shadow transition-colors order-2 sm:order-1"
                  style={{ backgroundColor: customColors.purple }}
                  onClick={() => {
                    toggleStep(3, 5);
                    // Mark all steps as complete and show final page
                    const updatedPhases = [...phaseData];
                    updatedPhases[3].steps[5].completed = true;
                    setPhaseData(updatedPhases);
                    setShowFinalComplete(true);
                    setActivePhase(-1);
                  }}
                >
                  I Agree
                </button>

                <button
                  className="px-6 py-3 text-sm font-bold rounded-lg transition-colors order-1 sm:order-2 border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#ef4444",
                    color: "#ef4444",
                  }}
                  onClick={() => {
                    toggleStep(3, 5);
                  }}
                >
                  No, I have questions
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="text-white text-center">
          <p>Step coming soon...</p>
        </div>
      </div>
    );
  };

  // FAQ Data Structure
  const faqData = {
    "Data Collection": [
      {
        question: "What is the Data Collection phase?",
        answer: "This is the first phase in the onboarding process where we collect key details about your business. This helps us analyze your business's traffic and, if you're currently monetizing, evaluate how you're performing. These insights help us tailor your strategy for the best possible results."
      },
      {
        question: "How long does this phase take?",
        answer: "It only takes a few minutes to complete. You'll just need to provide some business-related information."
      }
    ],
    "Google Analytics": [
      {
        question: "I shared Google Analytics access with SmithTech on my initial application. Why do I need to share it again?",
        answer: "To submit an application, a 'read-only' authorization of your Google Analytics account is required so we can confirm your business's traffic. Once you're onboarding, we need access again so we can integrate your analytics data with your dashboard and maintain ongoing analytics reporting."
      },
      {
        question: "Why do I need to share Google Analytics access with SmithTech?",
        answer: "We use Google Analytics 4 (GA4) data to power your SmithTech dashboard and support ongoing optimization of your performance. We must be added as a Viewer to your GA4 property to pull this data."
      },
      {
        question: "What if I don't see the GA4 property listed?",
        answer: "Make sure your property uses Google Analytics 4 (GA4) and that you're logged into the correct Google account. If you have Universal Analytics only, you'll need to create a GA4 property."
      },
      {
        question: "Can I remove SmithTech's access later?",
        answer: "We kindly request that you keep us as a Viewer to ensure your dashboard data remains up to date."
      }
    ],
    "Performance Data": [
      {
        question: "Why do I need to upload my performance data?",
        answer: "We request reports showing your current revenue as part of our process so we can understand how your business is currently performing. This helps us evaluate how customers engage with your products and services, how partners value your business, and what is driving the most revenue. These insights guide our process and ensure your business is ready for a strong start with SmithTech. Additionally, reviewing your revenue reports helps us determine if you're eligible for our Guarantee offering, which is available to businesses that meet our revenue requirements."
      },
      {
        question: "I'm having trouble uploading my reports. What do I do?",
        answer: "If you're having trouble uploading your performance reports, feel free to share the report file(s) with your designated Account Manager via email or reach out to them for help."
      },
      {
        question: "Can I skip this step and come back later?",
        answer: "Yes! Just click \"Skip This Step for Now\" and you can return to it after completing the Approvals steps."
      }
    ],
    "Approvals": [
  
      {
        question: "What if I don't have an account with your integration partners?",
        answer: "No worries, just select \"No\" or \"I don't know,\" and we'll guide you through next steps. You can also reach out to your designated Account Manager"
      },
  

    ],
    "Business Setup": [
      {
        question: "What is the Business Setup phase?",
        answer: "During the Business Setup phases, we'll have you work through some final steps to get your business ready for install and revenue generation."
      },
      {
        question: "How long does this phase take?",
        answer: "This phase typically takes incoming customers 10 to 15 minutes."
      }
    ],
    "Platform Connection": [
      {
        question: "Why do I need to add SmithTech as a user on my platform?",
        answer: "This gives our team access to configure your integration, manage your setup, and support you with updates. We can also remove any legacy code if needed."
      },
      {
        question: "Can I set up the integration myself?",
        answer: "Yes! Select \"I would like to handle implementation myself\" from the dropdown, and your Account Manager will share setup instructions with you before your go-live date."
      },
    
    ],
    "Privacy Policy": [
      {
        question: "Why do I need to update my Privacy Policy?",
        answer: "It's required by law and by our partners to disclose how data collection works on your business, so our Privacy Statement helps your business stay compliant with data privacy regulations."
      },
      {
        question: "Do I have to update my privacy policy page now?",
        answer: "We highly recommend updating your privacy policy page ahead of your implementation date with SmithTech so we can make sure your business is set up for success before SmithTech solutions are implemented for your business."
      },
      {
        question: "Where should I place the privacy policy link on my business?",
        answer: "We recommend placing it in your business's footer so it appears on every page."
      }
    ],
    "Identity Verification": [
      {
        question: "Why do I need to verify my identity?",
        answer: "As part of growing industry and our requirements, SmithTech is verifying the identities and businesses of every company we work with. This helps protect your account, strengthen partner trust, and keep SmithTech customers safe and strong."
      },
      {
        question: "What documents do I need?",
        answer: "Depending on your account type, you may be asked to present a valid ID and/or information related to your business registration, including your EIN, your business address, etc. Our service provider may also request certain documents depending on your country or the provided information."
      },
      {
        question: "Is my information secure?",
        answer: "Our service provider is a trusted identity verification provider used by major platforms to prevent fraud. They securely handle your verification data and comply with global privacy and security standards."
      }
    ],
    "Payment and Tax Info": [
      {
        question: "Can I get paid to someone else's account?",
        answer: "No, payments must go to the verified business owner or your registered business. We cannot send payments to friends, family, or contractors."
      },
      {
        question: "What tax forms will I need to fill out?",
        answer: "The system will guide you based on your country and business type. For U.S. based individuals or businesses, this typically means a W-9. Non-U.S. customers may be asked to complete a W-8BEN (for individual customers or sole proprietors) or a W-8BEN-E (for businesses, corporations, or other entities). Please consult your tax advisor if you need help completing your tax forms."
      }
    ],
    "Terms & Conditions": [
      {
        question: "What is the SmithTech Terms & Conditions?",
        answer: "It's a legally binding agreement between you and SmithTech that outlines how we'll manage your setup and your responsibilities as a partner."
      },
      {
        question: "What if I want to leave SmithTech in the future?",
        answer: "We just ask for 30-day written notice as a courtesy so we can fulfill any obligations we've made to our partners. You can read more about that in our Terms & Conditions."
      },
      {
        question: "Can I work with another provider?",
        answer: "No, our agreement requires exclusivity while you're partnered with SmithTech."
      }
    ]
  };

  // Function to get relevant FAQs based on current phase and step
  const getRelevantFAQs = () => {
    if (activePhase === -1) return [];

    const currentPhase = phaseData[activePhase];
    if (!currentPhase || !currentPhase.steps) return [];

    const currentStep = currentPhase.steps[activeStepIndex];
    if (!currentStep) return [];

    const relevantFAQs = [];
    const stepName = currentStep.displayName || currentStep.name;

    // Always show phase-level FAQs for Data Collection and Business Setup
    if (currentPhase.name === "Data Collection") {
      relevantFAQs.push({ category: "Data Collection", items: faqData["Data Collection"] });
    }
    if (currentPhase.name === "Business Setup") {
      relevantFAQs.push({ category: "Business Setup", items: faqData["Business Setup"] });
    }

    // Add step-specific FAQs
    if (faqData[stepName]) {
      relevantFAQs.push({ category: stepName, items: faqData[stepName] });
    }

    return relevantFAQs;
  };

  // FAQ Component
  const FAQComponent = () => {
    const relevantFAQs = getRelevantFAQs();
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (category) => {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    // Don't show FAQ on welcome screen or final complete screen
    if (activePhase === -1 || showFinalComplete) return null;

    // Check if we're on Business Analysis or Final Business Analysis phase
    const currentPhase = activePhase >= 0 && activePhase < phaseData.length ? phaseData[activePhase] : null;
    const isAnalysisPhase = currentPhase && (currentPhase.name === "Business Analysis" || currentPhase.name === "Final Business Analysis");
    
    // For analysis phases, show message instead of FAQs. For other phases, only show if there are FAQs
    if (!isAnalysisPhase && relevantFAQs.length === 0) return null;

    return (
      <>
        {/* FAQ Button - Bottom Right */}
        <button
          onClick={() => {
            setFaqOpen(!faqOpen);
            // Dismiss tooltip when FAQ button is clicked
            if (showFaqTooltip) {
              setShowFaqTooltip(false);
              localStorage.setItem('faqTooltipDismissed', 'true');
            }
          }}
          className="fixed rounded-full shadow-lg transition-all duration-300 flex items-center justify-center font-semibold"
          style={{
            bottom: isMobile ? (faqOpen ? "16px" : "100px") : "24px",
            right: isMobile ? "16px" : faqOpen ? "400px" : "24px",
            width: isMobile ? "56px" : "64px",
            height: isMobile ? "56px" : "64px",
            zIndex: 100,
            backgroundColor: customColors.purple,
            color: "#ffffff",
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
          }}
          aria-label="Toggle FAQs"
        >
          {faqOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>

        {/* FAQ Sidebar */}
        <div
          className="fixed top-0 bottom-0 right-0 transition-all duration-300 shadow-2xl overflow-hidden"
          style={{
            width: faqOpen ? (isMobile ? "100%" : "400px") : "0",
            backgroundColor: themeColors.sidebar,
            borderLeft: isMobile ? "none" : `1px solid ${themeColors.border}`,
            zIndex: 99,
            transform: faqOpen ? "translateX(0)" : "translateX(100%)",
            paddingBottom: isMobile && activePhase !== -1 && !showFinalComplete ? "80px" : "0",
          }}
        >
          {faqOpen && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div
                className="p-4 border-b flex items-center justify-between"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.card,
                }}
              >
                <h2
                  className="text-xl font-bold"
                  style={{ color: themeColors.text }}
                >
                  FAQs
                </h2>
                <button
                  onClick={() => setFaqOpen(false)}
                  className="p-1 rounded hover:opacity-70 transition-opacity"
                  style={{ color: themeColors.text }}
                  aria-label="Close FAQs"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* FAQ Content */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ color: themeColors.text }}
              >
                {isAnalysisPhase ? (
                  /* Message for Business Analysis and Final Business Analysis phases */
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: themeColors.text }}
                    >
                      Questions about your analysis? Feel free to reach out to your designated Account Manager.
                    </p>
                  </div>
                ) : (
                  /* FAQ content for other phases */
                  relevantFAQs.map((faqGroup, index) => (
                    <div key={index} className="mb-6">
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: themeColors.text }}
                      >
                        {faqGroup.category}
                      </h3>
                      <div className="space-y-3">
                        {faqGroup.items.map((faq, faqIndex) => (
                          <div
                            key={faqIndex}
                            className="border rounded-lg overflow-hidden"
                            style={{
                              borderColor: themeColors.border,
                              backgroundColor: themeColors.card,
                            }}
                          >
                            <button
                              onClick={() => toggleCategory(`${index}-${faqIndex}`)}
                              className="w-full text-left p-3 flex items-center justify-between hover:opacity-80 transition-opacity"
                              style={{ color: themeColors.text }}
                            >
                              <span className="font-medium text-sm pr-4">
                                {faq.question}
                              </span>
                              <svg
                                className={`w-5 h-5 flex-shrink-0 transition-transform ${
                                  expandedCategories[`${index}-${faqIndex}`]
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            {expandedCategories[`${index}-${faqIndex}`] && (
                              <div
                                className="px-3 pb-3 text-sm"
                                style={{ color: themeColors.textSecondary }}
                              >
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: themeColors.bg }}
    >
      {/* Sidebar (Desktop only) */}
      <SidebarNav />

      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed p-3 rounded-lg shadow-lg transition-colors"
        style={{
          top: isMobile ? "16px" : "16px",
          right: isMobile ? "16px" : "24px",
          zIndex: 100,
          backgroundColor: themeColors.card,
          color: themeColors.text,
          border: `1px solid ${themeColors.border}`,
        }}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      {/* Main Content Area */}
      {viewMode === "all" ? (
        <MultiSiteDashboard />
      ) : (
        <div
          className="transition-all duration-300"
          style={{
            minHeight: "100vh",
            marginLeft: isMobile ? "0" : "280px",
            maxWidth: isMobile ? "100%" : "calc(100% - 280px)",
            width: "100%",
            paddingTop: "0",
            backgroundColor: themeColors.bg,
            paddingBottom:
              isMobile && activePhase !== -1 && !showFinalComplete
                ? "80px"
                : "0",
          }}
        >
          {/* Top Header - Always visible with combined progress */}
          {activePhase !== -1 && !showFinalComplete && <TopHeader />}

          {/* Spacer to push content below absolutely positioned header */}
          {!showFinalComplete && (
            <div
              style={{
                height: activePhase !== -1 ? "100px" : "0",
                width: "100%",
                flexShrink: 0,
              }}
            />
          )}

          {/* Step Content */}
          <div
            style={{
              paddingLeft:
                !showFinalComplete && activePhase !== -1
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : showFinalComplete
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : "0",
              paddingRight:
                !showFinalComplete && activePhase !== -1
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : showFinalComplete
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : "0",
              paddingBottom:
                !showFinalComplete && activePhase !== -1
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : showFinalComplete
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : "0",
              paddingTop:
                !showFinalComplete && activePhase !== -1
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : showFinalComplete
                  ? isMobile
                    ? "16px"
                    : "24px"
                  : "0",
              minHeight: "calc(100vh - 200px)",
              position: "relative",
              zIndex: 1,
              width: "100%",
              backgroundColor: themeColors.bg,
            }}
          >
            {renderStepContent()}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* FAQ Tooltip - Shows on Google Analytics step */}
      {showFaqTooltip && activePhase === 0 && activeStepIndex === 0 && (
        <div
          className="fixed transition-opacity duration-300"
          style={{
            bottom: isMobile ? "180px" : "120px",
            right: isMobile ? "16px" : "24px",
            maxWidth: isMobile ? "calc(100% - 32px)" : "320px",
            zIndex: 101,
          }}
        >
          <div
            className="rounded-lg shadow-2xl p-4 relative mb-2"
            style={{
              backgroundColor: themeColors.card,
              border: `2px solid ${customColors.purple}`,
              position: 'relative',
            }}
          >
            {/* Close button - Top right */}
            <button
              onClick={() => {
                setShowFaqTooltip(false);
                localStorage.setItem('faqTooltipDismissed', 'true');
              }}
              style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 20,
                color: themeColors.text,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                padding: '6px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
              aria-label="Close tooltip"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Tooltip content */}
            <div className="pr-8">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: themeColors.text }}
              >
                💡 Tip
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: themeColors.textSecondary }}
              >
                You can use the FAQ button below to check out FAQs for each step.
              </p>
            </div>

            {/* Arrow pointing down-right to FAQ button */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: '16px',
                transform: 'translateY(100%)',
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: `10px solid ${customColors.purple}`,
              }}
            />
            {/* Inner arrow for border effect */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: '16px',
                transform: 'translateY(100%)',
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: `8px solid ${themeColors.card}`,
                marginTop: "2px",
              }}
            />
          </div>
        </div>
      )}

      {/* FAQ Component */}
      <FAQComponent />
    </div>
  );
}

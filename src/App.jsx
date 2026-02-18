import OnboardingProgressTracker from "./OnboardingProgressTracker";

export default function App() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <OnboardingProgressTracker />
    </div>
  );
}

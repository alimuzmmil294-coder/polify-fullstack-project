import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import RightPanel from "./RightPanel";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex-1 flex min-w-0">
        <div className="flex-1 min-w-0">
          <TopBar />
          <main className="px-4 lg:px-8 py-6 max-w-3xl mx-auto xl:mx-0">{children}</main>
        </div>
        <RightPanel />
      </div>
    </div>
  );
}

import MetricCard from "@/components/MetricCard";
import TabBar from "@/components/TabBar";
import SectionHeader from "@/components/SectionHeader";
import TaskCard from "@/components/TaskCard";

export default function Home() {
  return (
    <div className="p-6 max-w-5xl mx-auto w-full font-sans text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">mu-companion</h1>
        <div className="w-8 h-8 rounded-full bg-panel border border-border flex items-center justify-center">
          <span className="text-xs">≡</span>
        </div>
      </div>

      <div className="hidden md:block mb-8 mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-2">
        <MetricCard
          icon="start"
          iconBgColor="bg-secondary-amber"
          value="500"
          label=""
        />
        <MetricCard
          icon="task-list"
          iconBgColor="bg-primary"
          value="500"
          label=""
        />
        <MetricCard
          icon="karma-points"
          iconBgColor="bg-secondary-orange"
          value="500"
          label=""
        />
      </div>

      {/* Tabs */}
      <TabBar />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Summary</h2>

        {/* Ongoing Section */}
        <div className="bg-panel rounded-2xl p-5 border border-border shadow-sm mb-6">
          <SectionHeader title="Ongoing" actionText="View All" />
          <div className="flex flex-col">
            <TaskCard
              title="Self Introduction"
              hashtag="#ge-self-intro"
              points="1000"
            />
            <TaskCard
              title="Create a Portfolio"
              hashtag="#ge-portfolio"
              points="1500"
            />
            <TaskCard title="React Basics" hashtag="#react-101" points="800" />
          </div>
        </div>

        {/* Completed Section */}
        <div className="bg-panel rounded-2xl p-5 border border-border shadow-sm">
          <SectionHeader title="Completed" actionText="View All" />
          <div className="flex flex-col">
            <TaskCard
              title="HTML Fundamentals"
              hashtag="#html-basics"
              points="500"
            />
            <TaskCard title="CSS Styling" hashtag="#css-intro" points="500" />
          </div>
        </div>
      </div>
    </div>
  );
}

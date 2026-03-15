"use client";
import { useState } from "react";
import MetricCard from "@/components/MetricCard";
import TabBar from "@/components/TabBar";
import TaskCard from "@/components/TaskCard";
import SummaryContainer from "@/components/SummaryContainer";
import Sidebar from "@/components/Sidebar";
import Icon from "@/components/Icon";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="p-6 max-w-5xl mx-auto w-full font-sans text-white">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">mu-companion</h1>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-full bg-panel border border-border flex items-center justify-center hover:bg-panel-active transition-colors"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>

        <div className="hidden md:block mb-10 mt-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
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
        <div className="mb-6">
          <TabBar />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Summary</h2>

          {/* Ongoing Section */}
          <SummaryContainer title="Ongoing">
            <TaskCard
              title="Self Introduction"
              hashtag="#ge-self-intro"
              points="1000"
              isOdd={true}
            />
            <TaskCard
              title="Create a Portfolio"
              hashtag="#ge-portfolio"
              points="1500"
              isOdd={false}
            />
            <TaskCard
              title="React Basics"
              hashtag="#react-101"
              points="800"
              isOdd={true}
            />
          </SummaryContainer>

          {/* Completed Section */}
          <SummaryContainer title="Completed">
            <TaskCard
              title="HTML Fundamentals"
              hashtag="#html-basics"
              points="500"
              isOdd={true}
            />
            <TaskCard
              title="CSS Styling"
              hashtag="#css-intro"
              points="500"
              isOdd={false}
            />
          </SummaryContainer>
        </div>
      </div>
    </>
  );
}

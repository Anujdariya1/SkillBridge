import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../api/dashboardApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import ProgressBar from "../../components/ui/ProgressBar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (!data || !data.career) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            No career selected yet
          </h2>
          <p className="text-gray-400">
            Choose a career path to begin your learning journey.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold text-white">
          Welcome back 👋
        </h1>
        <p className="text-gray-400">
          Here’s your learning progress overview.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-gray-900 border border-gray-800">
          <p className="text-sm text-gray-400">Career Path</p>
          <h2 className="text-xl font-semibold text-white mt-1">
            {data.career}
          </h2>
        </Card>

        <Card className="bg-gray-900 border border-gray-800">
          <p className="text-sm text-gray-400">Progress</p>
          <h2 className="text-xl font-semibold text-white mt-1">
            {data.progress}%
          </h2>
        </Card>

        <Card className="bg-gray-900 border border-gray-800">
          <p className="text-sm text-gray-400">Next Skill</p>
          <h2 className="text-xl font-semibold text-white mt-1">
            {data.nextSkill || "All skills completed 🎉"}
          </h2>
        </Card>
      </div>

      {/* Progress section */}
      <Card className="bg-gray-900 border border-gray-800 space-y-4">
        <div>
          <p className="text-sm text-gray-400">Overall Completion</p>
          <h3 className="text-lg font-semibold text-white">
            {data.completedSkills} of {data.totalSkills} skills mastered
          </h3>
        </div>

        <ProgressBar value={data.progress} />
      </Card>
    </DashboardLayout>
  );
}

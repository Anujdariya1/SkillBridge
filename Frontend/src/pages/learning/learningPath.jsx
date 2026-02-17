import { useEffect, useState } from "react";

import { getUserLearningPaths } from "../../api/learningApi";
import { updateSkillLevel } from "../../api/progressApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

export default function LearningPath() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const data = await getUserLearningPaths();
        setItems(data || []);
      } catch (err) {
        console.error("Failed to load learning path", err);
        setError("Unable to load your learning path.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  const handleLevelChange = async (skillId, level) => {
    try {
      await updateSkillLevel(skillId, level);

      // optimistic UI update
      setItems((prev) =>
        prev.map((item) =>
          item.skillId === skillId ? { ...item, level } : item
        )
      );
    } catch (err) {
      console.error("Failed to update level", err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-400">{error}</p>
      </DashboardLayout>
    );
  }

  if (!items.length) {
    return (
      <DashboardLayout>
        <p className="text-gray-400">
          No learning path found. Please select a career first.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Your Learning Path
        </h1>
        <p className="text-gray-400">
          Track mastery level for each skill.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-900 border border-gray-800"
          >
            {/* Skill info */}
            <div className="flex items-start gap-4">
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold">
                {index + 1}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {item.skillName}
                </h3>

                <p className="text-xs text-gray-500">
                  Required level: {item.requiredLevel ?? 3}
                </p>
              </div>
            </div>

            {/* Level selector */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(item.skillId, lvl)}
                  className={`px-3 py-1 rounded-md text-sm transition
                    ${
                      item.level === lvl
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }
                  `}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

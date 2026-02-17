import { useEffect, useState } from "react";

import { getProjects } from "../../api/projectApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to load projects", err);
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    );
  }

  // 📭 Empty
  if (!projects.length) {
    return (
      <DashboardLayout>
        <p className="text-gray-600">
          No projects available yet. Complete skills to unlock projects.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Practice Projects</h1>
        <p className="text-gray-600 mt-1">
          Apply your learned skills by building real-world projects.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col justify-between hover:shadow-lg transition"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {project.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-4">
                {project.description || "No description provided."}
              </p>
            </div>

            {/* Future submission button */}
            <div className="mt-4">
              <Button className="w-full" disabled>
                Submission Coming Soon
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

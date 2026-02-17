import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getCareerById, createLearningPath } from "../../api/careerApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

export default function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const data = await getCareerById(id);
        setCareer(data);
      } catch (err) {
        console.error("Failed to load career", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [id]);

  const handleStart = async () => {
    try {
      setStarting(true);
      await createLearningPath(id);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create learning path", err);
    } finally {
      setStarting(false);
    }
  };

  // 🔹 Loading state INSIDE layout (important UX)
  if (loading)
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </DashboardLayout>
    );

  // 🔹 Not found state
  if (!career)
    return (
      <DashboardLayout>
        <p className="text-red-400">Career not found.</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {career.name}
          </h1>
          <p className="text-gray-400 max-w-2xl">
            {career.description}
          </p>
        </div>

        {/* Skills Card */}
        {career.skills?.length > 0 && (
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Skills you'll learn
            </h2>

            <ul className="space-y-2">
              {career.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {skill.name}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* CTA Card */}
        <Card className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">
              Start your learning journey
            </h3>
            <p className="text-sm text-gray-400">
              Generate a personalized roadmap for this career.
            </p>
          </div>

          <Button onClick={handleStart} disabled={starting}>
            {starting ? "Creating..." : "Start Career"}
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}

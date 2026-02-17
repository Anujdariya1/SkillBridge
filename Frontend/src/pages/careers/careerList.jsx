import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllCareers } from "../../api/careerApi";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

export default function CareerList() {
  const navigate = useNavigate();

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await getAllCareers();
        setCareers(data);
      } catch (err) {
        console.error("Failed to load careers", err);
        setError("Unable to load careers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  // 🔄 Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-400">{error}</p>
      </DashboardLayout>
    );
  }

  // 📭 Empty state
  if (!careers.length) {
    return (
      <DashboardLayout>
        <p className="text-gray-400">No careers available yet.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Choose Your Career
        </h1>
        <p className="text-gray-400">
          Select a path to generate your personalized learning roadmap.
        </p>
      </div>

      {/* Career Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => (
          <Card
            key={career.id}
            className="
              flex flex-col justify-between
              bg-gray-900 border border-gray-800
              hover:border-blue-500/40
              hover:shadow-lg hover:shadow-blue-500/10
              transition-all duration-200
            "
          >
            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">
                {career.name}
              </h3>

              <p className="text-sm text-gray-400 line-clamp-3">
                {career.description || "No description available."}
              </p>
            </div>

            {/* Action */}
            <div className="mt-5">
              <Button
                className="w-full justify-center"
                onClick={() => navigate(`/careers/${career.id}`)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

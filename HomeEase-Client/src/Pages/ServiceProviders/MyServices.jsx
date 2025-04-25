import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import EditServiceModal from "../../Components/AdminComponents/EditServiceModal";
import useAuth from "../../hooks/useAuth";
import Loader from "../../Components/SharedComponets/Loader";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:9000/services/my/${user.email}`
        );

        const safeServices = Array.isArray(response.data) ? response.data : [];

        setServices(safeServices);
        setError(null);
      } catch (err) {
        setError(err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchServices();
    }
  }, [user?.email]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:9000/services/${id}`);
        setServices(services.filter((service) => service._id !== id));
        toast.success("Service deleted successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete service.");
        console.error("Error deleting service:", err);
      }
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleUpdate = async (updatedService) => {
    try {
      const response = await axios.put(
        `http://localhost:9000/services/${updatedService._id}`,
        updatedService,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.message === "Service updated successfully"
      ) {
        setServices(
          services.map((service) =>
            service._id === updatedService._id
              ? response.data.updatedService
              : service
          )
        );
        toast.success("Service updated successfully!");
        setIsModalOpen(false);
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.details ||
        err.response?.data?.error ||
        "Failed to update service";
      toast.error(errorMessage);
      console.error("Detailed update error:", err.response?.data || err);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">No services found</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#68b5c2] text-white rounded hover:bg-cyan-400"
        >
          Retry
        </button>
      </div>
    );

  if (!loading && (!services || services.length === 0))
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No services found</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Services</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <tbody className="bg-white divide-y divide-gray-200">
          {services?.map(
            (service) =>
              service && (
                <tr key={service._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {service.image && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={service.image}
                            alt={service.name || "Service image"}
                          />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {service.name || "Unnamed service"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service.description
                            ? `${service.description.substring(0, 50)}...`
                            : "No description"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.category || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${service.price || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.duration || "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.isPopular
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {service.isPopular ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </div>

      {isModalOpen && selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MyServices;

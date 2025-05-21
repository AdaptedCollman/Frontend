import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import Sidebar from "@/components/Sidebar";

interface UpdateUserData {
  name?: string;
  profileImage?: string | null;
  email?: string;
  phone?: string;
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updateData: UpdateUserData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
      };

      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          await updateUser({
            ...updateData,
            profileImage: base64String,
          });
        };
        reader.readAsDataURL(selectedFile);
      } else {
        await updateUser(updateData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    My Profile
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your profile settings
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                    <Sun className="h-4 w-4 text-gray-600" />
                    <Switch
                      id="theme-toggle"
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                      aria-label="Toggle theme"
                    />
                    <Moon className="h-4 w-4 text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Toggle dark mode for the application
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                {/* Profile Photo Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Profile Photo
                  </h2>
                  <div className="mt-4 flex items-start space-x-8">
                    <div>
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={previewUrl || user?.profileImage || undefined}
                          alt="Profile"
                        />
                        <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                          {formData.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <p className="mt-2 text-xs text-gray-500">
                        Add your photo. Recommended size is 256×256px
                      </p>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() =>
                          document.getElementById("photo-upload")?.click()
                        }
                      >
                        Change Photo
                      </Button>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={handleDeleteImage}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-lg p-6">
                      <h3 className="font-medium text-blue-900">
                        Build Trust!
                      </h3>
                      <p className="mt-2 text-sm text-blue-700">
                        Your photo will appear on emails and your online
                        scheduling link
                      </p>
                      <p className="mt-2 text-sm text-blue-700">
                        This helps students associate a face with their
                        instructor
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="mt-1"
                    />
                    <div className="mt-3 flex items-center">
                      <Switch
                        checked={showPhone}
                        onCheckedChange={setShowPhone}
                        className="mr-3"
                      />
                      <span className="text-sm text-gray-600">
                        Show phone number publicly
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

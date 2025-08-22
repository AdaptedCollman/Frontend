import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface UpdateUserData {
  name?: string;
  profileImage?: string | null;
  email?: string;
  phone?: string;
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
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
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);

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

  const handleDeleteImageClick = () => {
    setShowDeletePhotoModal(true);
  };

  const handleConfirmDeleteImage = async () => {
    setIsLoading(true);
    try {
      await updateUser({ profileImage: null });
      setPreviewUrl(null);
      setSelectedFile(null);
      setShowDeletePhotoModal(false);
    } catch (error) {
      console.error("Error deleting profile image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDeleteImage = () => {
    setShowDeletePhotoModal(false);
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
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        await updateUser({
          ...updateData,
          profileImage: base64String,
        });
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
                        onClick={handleDeleteImageClick}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
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

      {/* Delete Photo Confirmation Modal */}
      <Dialog
        open={showDeletePhotoModal}
        onClose={handleCancelDeleteImage}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-semibold text-gray-800">
          Delete Profile Photo
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-600 mt-2">
            Are you sure you want to delete your profile photo? This action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={handleCancelDeleteImage}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteImage}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            Delete Photo
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

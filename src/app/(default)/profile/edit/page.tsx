"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";

const Page = () => {
  const handleFormSubmit = async (data: any) => {
    // You can replace this with your API call to save profile data
    console.log("Profile updated with data:", data);
    const response = await axios.put(
      process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/me",
      data,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const initialData = {
    name: data?.name || "",
    email: data?.email || "",
    address: data?.address || "",
    phone: data?.phone || "",
    city: data?.city || "",
    state: data?.state?.[0] || "",
    companyName: data?.companyName || "",
    clientId: data?.clientId || "TO-0001",
  };

  return (
    <div className="lg:px-24 px-4 w-full py-8">
      <h2 className="text-3xl text-black font-bold">Profile Information</h2>

      <ProfileEditForm initialData={initialData} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default Page;

interface ProfileData {
  name: string;
  email: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  companyName: string;
  clientId?: string;
}

interface ProfileEditFormProps {
  initialData: ProfileData;
  onSubmit: (data: ProfileData) => Promise<void>;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [errors, setErrors] = useState<{ [key in keyof ProfileData]?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof ProfileData, value: string) => {
    switch (field) {
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email format";
      case "phone":
        return /^\d{10}$/.test(value) ? "" : "Phone number must be 10 digits";
      case "name":
      case "city":
      case "state":
      case "companyName":
      case "address":
        return value.length > 0 ? "" : `${field} is required`;
      default:
        return "";
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    if (field !== "clientId") {
      if (field === "phone") {
        const filteredValue = value.replace(/\D/g, "").slice(0, 10);
        setFormData((prev) => ({ ...prev, [field]: filteredValue }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: validateField(field, filteredValue),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: validateField(field, value),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {} as { [key in keyof ProfileData]: string };
    let hasErrors = false;

    // Exclude clientId from validation
    const fieldsToValidate = Object.keys(formData).filter(
      (field) => field !== "clientId"
    ) as (keyof ProfileData)[];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field] || "");
      if (error) hasErrors = true;
      newErrors[field] = error;
    });

    setErrors(newErrors);
    if (hasErrors) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { label: "Client ID", field: "clientId", readOnly: true },
    { label: "First Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Address", field: "address" },
    { label: "Contact Number", field: "phone" },
    { label: "City", field: "city" },
    { label: "State", field: "state" },
    { label: "Organization / Company", field: "companyName" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="gap-6 w-full grid grid-cols-1 mt-8"
    >
      {formFields.map(({ label, field, readOnly }) => {
        return (
          <div key={field} className="flex flex-col">
            <label htmlFor={field} className="font-semibold text-base">
              {label}
            </label>
            {field === "state" ? (
              <SelectState
                value={formData.state}
                onChange={(e: any) => handleChange("state", e.target.value)}
              />
            ) : field === "city" ? (
              <SelectCity
                value={formData.city}
                onChange={(e: any) => handleChange("city", e)}
              />
            ) : field === "address" ? (
              <textarea
                rows={3}
                id={field}
                value={formData[field as keyof ProfileData]}
                onChange={(e) =>
                  handleChange(field as keyof ProfileData, e.target.value)
                }
                className="p-2 border text-sm rounded-md"
                aria-invalid={!!errors[field as keyof ProfileData]}
              />
            ) : field === "clientId" ? (
              <input
                type="text"
                id={field}
                value={formData[field as keyof ProfileData]}
                readOnly
                className="p-2 border text-sm rounded-md bg-gray-100 cursor-not-allowed"
                aria-invalid={!!errors[field as keyof ProfileData]}
              />
            ) : (
              <input
                type="text"
                id={field}
                value={formData[field as keyof ProfileData]}
                onChange={(e) =>
                  handleChange(field as keyof ProfileData, e.target.value)
                }
                className="p-2 border text-sm rounded-md"
                aria-invalid={!!errors[field as keyof ProfileData]}
              />
            )}
            {errors[field as keyof ProfileData] && (
              <span className="text-red-500 text-sm">
                {errors[field as keyof ProfileData]}
              </span>
            )}
          </div>
        );
      })}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setFormData(initialData)}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ChangePassword from "../../../../components/shared/passwordChange";
function SelectState({ value, onChange }: any) {
  return (
    <Select disabled defaultValue="tamil-nadu">
      <SelectTrigger className="w-full cursor-not-allowed">
        <SelectValue placeholder="Tamil Nadu" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
function SelectCity({ value, onChange }: any) {
  const cityOptions = [
    { value: "chennai", label: "Chennai" },
    { value: "coimbatore", label: "Coimbatore" },
    { value: "madurai", label: "Madurai" },
    { value: "tiruchirappalli", label: "Tiruchirappalli" },
    { value: "salem", label: "Salem" },
    { value: "tirunelveli", label: "Tirunelveli" },
    { value: "tiruppur", label: "Tiruppur" },
    // Add all other cities here...
    { value: "thirupuvanam", label: "Thirupuvanam" },
  ];

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a City " />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tamil Nadu</SelectLabel>
          {cityOptions.map((city) => (
            <SelectItem key={city.value} value={city.value}>
              {city.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

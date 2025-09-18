"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { getSession, useSession } from "next-auth/react";
import { User } from "next-auth";


export default function ProfilePage() {
  const { register, handleSubmit } = useForm();
  const { data: session } = useSession();
    const user : User = session?.user;
  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post("/api/profile")
      .then()
      toast(res.data.message || "Profile updated!");
    } catch (err) {
      toast("Error updating profile");
    }
  };

  return (
    <>

    </>
  );
}

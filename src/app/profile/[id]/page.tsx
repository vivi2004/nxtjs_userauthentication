import React from "react";

type UserProfileProps = {
  params: {
    id: string;
  };
};

export default async function UserProfilePage({ params }: UserProfileProps) {
  if (!params?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Profile</h1>
        <p className="text-2xl text-red-500">
          Error: Missing or invalid user ID
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">
        Profile page: 
        <span className="p-1 rounded bg-lime-600 text-black">{params.id}</span>
      </p>
    </div>
  );
}

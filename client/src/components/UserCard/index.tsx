import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  console.log(user);
  return (
    <div className="flex items-center rounded p-4 shadow">
      {user.profilePictureUrl && (
        <Image
          src={`/${user.profilePictureUrl}`}
          alt={user.username}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <div>
        <h1>{user.username}</h1>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;

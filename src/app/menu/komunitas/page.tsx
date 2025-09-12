"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaDiscord, FaSignOutAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import Loading from "@/ui/loading";

interface UserRoles {
  roles: {
    id: string;
    name: string;
    color: string;
  }[];
  success: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<UserRoles['roles']>([]);
  const [loading, setLoading] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const router = useRouter();

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = `${username.charAt(0)}${'*'.repeat(username.length - 2)}${username.charAt(username.length - 1)}`;
    return `${maskedUsername}@${domain}`;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch("/api/verify-role", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          
          if (response.ok) {
            const data: UserRoles = await response.json();
            setRoles(data.roles || []);
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      fetchRoles();
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [session, status, router]);

  if (loading || status === "loading") {
    return <Loading />;
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="bg-black rounded-xl p-6 mb-6 border border-gray-900 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar with glow effect */}
            <div className="relative">
              <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-lg opacity-50"></div>
              <img
                src={session?.user?.image || ''}
                alt="Profile"
                className="relative w-28 h-28 rounded-full border-2 border-purple-500/20 z-10"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-purple-500">
                  {session?.user?.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start mt-2 text-gray-500 group">
                  <MdEmail className="w-4 h-4 mr-2" />
                  <span>{showEmail ? session?.user?.email : maskEmail(session?.user?.email || '')}</span>
                  <button
                    onClick={() => setShowEmail(!showEmail)}
                    className="ml-2 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {showEmail ? <BsEyeSlashFill size={16} /> : <BsEyeFill size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-purple-500/20 p-0.5 transition-all hover:scale-105"
            >
              <span className="relative flex items-center gap-2 rounded-md px-6 py-3 bg-black transition-all duration-300 ease-out group-hover:bg-opacity-0">
                <FaSignOutAlt />
                <span>Sign Out</span>
              </span>
            </button>
          </div>
        </div>

        {/* Roles Section */}
        <div className="bg-black rounded-xl p-6 border border-gray-900 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center mb-6">
            <FaDiscord className="text-purple-600 w-5 h-5" />
            <h2 className="ml-3 text-xl font-bold text-purple-500">
              Discord Roles
            </h2>
            <div className="ml-3 px-2 py-1 bg-purple-500/10 rounded-md text-sm text-gray-300 border border-purple-500/20">
              {roles.length} Roles
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.map((role) => (
              <div
                key={role.id}
                className="group flex items-center gap-3 p-3 rounded-xl bg-black/40 hover:bg-black/60 transition-all duration-300 border border-gray-900"
                style={{ 
                  borderLeft: `3px solid ${role.color}`
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full shadow-lg"
                  style={{ backgroundColor: role.color }}
                />
                <span className="font-medium text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                  {role.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

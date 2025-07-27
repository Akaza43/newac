import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from "next-auth/jwt";

// Add cache for role verification results
const roleCache = new Map<string, { roles: string[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // Increase cache to 5 minutes

interface DiscordMember {
  roles: string[];
  user?: {
    id: string;
    username: string;
  };
}

interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

const DISCORD_GUILD_IDS = process.env.DISCORD_GUILD_IDS!.split(","); // Multiple guild IDs
const DISCORD_ROLE_IDS = process.env.DISCORD_ROLE_IDS!.split(","); // Multiple role IDs
const DISCORD_TRIAL_ROLE_IDS = process.env.DISCORD_TRIAL_ROLE_IDS!.split(","); // Multiple trial role IDs

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Bypass role verification jika SKIP_ROLE_VERIFICATION=true
  if (process.env.SKIP_ROLE_VERIFICATION === "true") {
    return res.status(200).json({
      success: true,
      isTrialUser: false,
      isPackageUser: false,
      roles: [{ id: "acforall", name: "AC FOR ALL", color: "#8b5cf6" }],
      skipped: true
    });
  }

  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token?.sub || !token.accessToken) {
      return res.status(200).json({
        success: true,
        isTrialUser: false,
        isPackageUser: false,
        roles: [],
        skipped: true
      });
    }

    let userRoles: DiscordRole[] = [];
    let hasPackageRole = false;
    let hasTrialRole = false;

    for (const guildId of DISCORD_GUILD_IDS) {
      // Get guild roles
      const rolesResponse = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/roles`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
          },
        }
      );

      if (!rolesResponse.ok) {
        console.error(`Failed to fetch roles for guild ${guildId}`);
        continue;
      }

      const allRoles: DiscordRole[] = await rolesResponse.json();

      // Get guild member
      const memberResponse = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${token.sub}`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
          },
        }
      );

      if (!memberResponse.ok) {
        console.warn(`Failed to fetch member data for guild ${guildId}`);
        continue;
      }

      const memberData: DiscordMember = await memberResponse.json();

      // Map role IDs to role objects
      const guildUserRoles = memberData.roles
        .map(roleId => allRoles.find(r => r.id === roleId))
        .filter((role): role is DiscordRole => role !== undefined)
        .sort((a, b) => b.position - a.position);

      userRoles = [...userRoles, ...guildUserRoles];

      // Check for package and trial roles
      hasPackageRole = hasPackageRole || memberData.roles.some(roleId => DISCORD_ROLE_IDS.includes(roleId));
      hasTrialRole = hasTrialRole || memberData.roles.some(roleId => DISCORD_TRIAL_ROLE_IDS.includes(roleId));
    }

    return res.status((hasPackageRole || hasTrialRole) ? 200 : 403).json({ 
      success: hasPackageRole || hasTrialRole,
      isTrialUser: hasTrialRole,
      isPackageUser: hasPackageRole,
      roles: userRoles.map(role => ({
        id: role.id,
        name: role.name,
        color: `#${role.color.toString(16).padStart(6, '0')}`
      }))
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

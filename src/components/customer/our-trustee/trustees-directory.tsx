import { getAssetUrl } from "@/lib/utils/asset-version";
import { listPublicTeamMembers } from "@/lib/team/team-service";
import {
  TrusteesDirectoryClient,
  type TrusteeDirectoryItem,
} from "@/components/customer/our-trustee/trustees-directory-client";

function resolveProfileImageUrl(image: string | null | undefined) {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return getAssetUrl(image);
  return getAssetUrl(`/images/profiles/${image}`);
}

export async function TrusteesDirectory() {
  let members: TrusteeDirectoryItem[] = [];

  try {
    const rows = await listPublicTeamMembers();
    members = [...rows]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((m) => ({
        id: m.id,
        name: m.name,
        designation: m.designation,
        profileImageUrl: resolveProfileImageUrl(m.profileImage),
        shortBio: m.shortBio ?? null,
        bio: m.bio ?? null,
        email: m.email ?? null,
        phone: m.phone ?? null,
        linkedinUrl: m.linkedinUrl ?? null,
        facebookUrl: m.facebookUrl ?? null,
        instagramUrl: m.instagramUrl ?? null,
        websiteUrl: m.websiteUrl ?? null,
        isFeatured: m.isFeatured,
      }));
  } catch (error) {
    console.error("Failed to load trustees:", error);
  }

  return <TrusteesDirectoryClient members={members} />;
}

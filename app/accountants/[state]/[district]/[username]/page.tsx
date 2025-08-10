import React from "react";
import { Metadata } from "next";
import { AccountantProfilePageClient } from "@/src/components/contact-requests/discovery/AccountantProfilePageClient.component";
import { fetchAccountantProfileServer } from "@/src/services/accountant-discovery-server.service";

interface AccountantProfilePageProps {
  params: Promise<{
    state: string;
    district: string;
    username: string;
  }>;
}

// Generate metadata for SEO optimization
export async function generateMetadata({ params }: AccountantProfilePageProps): Promise<Metadata> {
  const { state, district, username } = await params;

  try {
    const profile = await fetchAccountantProfileServer(
      decodeURIComponent(state),
      decodeURIComponent(district),
      decodeURIComponent(username)
    );

    if (!profile) {
      return {
        title: "Chartered Accountant Not Found | Audit-it",
        description: "The requested Chartered Accountant profile could not be found.",
      };
    }

    const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    const location = [profile.district_name, profile.state_name].filter(Boolean).join(", ");
    const specializations = profile.specialization_names?.slice(0, 3).join(", ") || "Tax, Audit & Compliance";

    const title = `${fullName} - Chartered Accountant in ${location} | Audit-it`;
    const description = `Connect with ${fullName}, a verified Chartered Accountant in ${location}. Specializing in ${specializations}. Get expert CA services for tax, audit, and compliance needs.`;

    // Prefer absolute URLs in metadata; if stored value is a storage path, omit images to avoid broken OG images.
    const isAbsoluteUrl = Boolean(profile.profile_picture_url && profile.profile_picture_url.startsWith("http"));
    return {
      title,
      description,
      keywords: [
        "chartered accountant",
        "CA",
        fullName,
        location,
        "tax consultant",
        "audit services",
        "compliance",
        ...(profile.specialization_names || []),
      ].join(", "),
      openGraph: {
        title,
        description,
        type: "profile",
        images:
          isAbsoluteUrl && profile.profile_picture_url
            ? [
                {
                  url: profile.profile_picture_url,
                  width: 400,
                  height: 400,
                  alt: `${fullName} - Chartered Accountant`,
                },
              ]
            : [],
        locale: "en_IN",
        siteName: "Audit-it",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: isAbsoluteUrl && profile.profile_picture_url ? [profile.profile_picture_url] : [],
      },
      alternates: {
        canonical: `/accountants/${state}/${district}/${username}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Chartered Accountant Profile | Audit-it",
      description: "Find and connect with verified Chartered Accountants for your tax, audit, and compliance needs.",
    };
  }
}

export default async function AccountantProfilePage({ params }: AccountantProfilePageProps) {
  const { state, district, username } = await params;

  // Decode URL parameters
  const decodedState = decodeURIComponent(state);
  const decodedDistrict = decodeURIComponent(district);
  const decodedUsername = decodeURIComponent(username);

  return <AccountantProfilePageClient state={decodedState} district={decodedDistrict} username={decodedUsername} />;
}

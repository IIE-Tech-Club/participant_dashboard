import type { Metadata } from "next";
import PublicProfileClient from "./ProfileClient";
import { absoluteUrl, siteConfig, toMetaDescription } from "@/lib/site";
import { SERVER_API_BASE_URL } from "@/lib/server-site";
import type { ProfileData } from "@/types/profile";

type PublicProfilePageProps = {
  params: Promise<{ userId: string }>;
};

async function getPublicProfile(userId: string): Promise<ProfileData | null> {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/users/${encodeURIComponent(userId)}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { userId } = await params;
  const canonicalPath = `/${encodeURIComponent(userId)}/profile`;
  const profile = await getPublicProfile(userId);

  if (!profile) {
    return {
      title: "Participant Profile Not Found",
      description: "This CodeCraft participant profile could not be found.",
      alternates: {
        canonical: canonicalPath,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${profile.name} - CodeCraft Participant Profile`;
  const description = toMetaDescription(
    `${profile.name} is a verified CodeCraft participant${
      profile.collegeName ? ` from ${profile.collegeName}` : ""
    }. ${profile.bio || siteConfig.description}`,
  );
  const images = profile.photoURL
    ? [{ url: profile.photoURL, alt: `${profile.name} profile photo` }]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "profile",
      url: absoluteUrl(canonicalPath),
      title,
      description,
      siteName: siteConfig.name,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { userId } = await params;
  const profile = await getPublicProfile(userId);
  const canonicalPath = `/${encodeURIComponent(userId)}/profile`;
  const sameAs = [profile?.github, profile?.linkedin].filter(Boolean);
  const personJsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        url: absoluteUrl(canonicalPath),
        image: profile.photoURL,
        description: toMetaDescription(profile.bio),
        affiliation: profile.collegeName
          ? {
              "@type": "CollegeOrUniversity",
              name: profile.collegeName,
            }
          : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
        knowsAbout: [profile.branch, profile.track, "Hackathons"].filter(Boolean),
      }
    : null;

  return (
    <>
      {personJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <PublicProfileClient userId={userId} initialProfile={profile} />
    </>
  );
}

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import ProfileClient from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <ProfileClient />;
}
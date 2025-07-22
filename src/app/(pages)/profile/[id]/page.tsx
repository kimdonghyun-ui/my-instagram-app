'use client';
import ProfileContent from '@/components/ProfileContent';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const id = params.id;

  return (
    <>
      <ProfileContent paramsUserId={id} />
    </>
  );
}

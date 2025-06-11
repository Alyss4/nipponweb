'use client';

interface Props {
  email: string | null;
}

export default function UserSidebarInfo({ email }: Props) {
  if (!email) return <p className="text-primary"></p>;
  return (
    <p className="text-o-primary mb-1">Bonjour <span style={{ color: '#E83C28' }}>{email}</span> !</p>
  );
}

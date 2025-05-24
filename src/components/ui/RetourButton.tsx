'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ButtonPrimaryy } from '@/components/ui/ComponentForm';

export default function RetourButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <ButtonPrimaryy onClick={() => router.back()}>
      ← Retour
    </ButtonPrimaryy>
  );
}

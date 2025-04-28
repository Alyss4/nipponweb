'use client';

import { useRouter } from 'next/navigation';
import { IconType } from 'react-icons';

interface ButtonProps {
  icon: IconType;
  label: string;
  href?: string;
  onClick?: () => void;
}

const Button = ({ icon: Icon, label, href, onClick }: ButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <button type="button" className="icon-button" onClick={handleClick}>
      <Icon size={64} />
      <span className="label">{label}</span>
    </button>
  );
};

export default Button;

export const ButtonStyles = () => (
  <style jsx global>{`
    .icon-button {
      width: 180px;
      height: 180px;
      background-color: #f5f8fa;
      border: 2px solid #003049;
      border-radius: 24px;
      color: #003049;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      gap: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .icon-button:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      background-color: #e1e8ed;
    }

    .label {
      margin-top: 8px;
      text-align: center;
    }
  `}
  </style>
);

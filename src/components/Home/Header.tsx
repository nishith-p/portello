'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type NavLinkProps = {
  href: string;
  label: string;
};

const NavLink = ({ href, label }: NavLinkProps) => {
  return (
    <div className="h-[110px] w-full flex items-center justify-center px-4">
      <Link
        href={href}
        className="h-[27px] flex items-center text-base font-medium transition-colors"
      >
        {label}
      </Link>
    </div>
  );
};

type HeaderProps = {
  transparent?: boolean;
};

const Header = ({ transparent = true }: HeaderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header
      className={`w-full h-[110px] flex items-center transition-colors duration-300 ${
        isHovered ? 'bg-[#2b0536]' : transparent ? 'bg-transparent' : 'bg-white'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Container */}
      <div className="h-[110px] flex items-center justify-center px-11">
        <Link href="/" className="h-[110px] flex items-center">
          <Image
            src="/logo.svg"
            alt="Switzerland Logo"
            width={140}
            height={110}
            className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-90'}`}
          />
        </Link>
      </div>

      {/* Nav Links */}
      <div className="h-[110px] flex items-center ml-2.5 mr-7">
        <NavLink href="/destinations" label="Destinations" />
        <NavLink href="/experiences" label="Experiences" />
        <NavLink href="/accommodation" label="Accommodation" />
        <NavLink href="/planning" label="Planning" />
      </div>

      {/* Right Side Container */}
      <div className="flex-grow h-[110px] flex items-center justify-end">
        {/* Search */}
        <div className="flex items-center ml-10 mr-5">
          <div className="flex items-center">
            <svg
              className={`w-6 h-6 ${isHovered ? 'text-white' : 'text-gray-700'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className={`ml-2 text-base ${isHovered ? 'text-white' : 'text-gray-700'}`}>
              Search
            </span>
          </div>
        </div>

        {/* Meetings & Language */}
        <div className="flex items-center ml-2.5 mr-7">
          <Link
            href="/meetings"
            className={`text-base mr-6 ${isHovered ? 'text-white' : 'text-gray-700'}`}
          >
            Meetings
          </Link>
          <div className="relative">
            <button
              className={`flex items-center text-base ${isHovered ? 'text-white' : 'text-gray-700'}`}
            >
              <span>Language</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex mr-11">
          <div className="px-3 mx-1">
            <button
              className={`w-6 h-6 flex items-center justify-center ${isHovered ? 'text-white' : 'text-gray-700'}`}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          <div className="px-3 mx-1">
            <button
              className={`w-6 h-6 flex items-center justify-center ${isHovered ? 'text-white' : 'text-gray-700'}`}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
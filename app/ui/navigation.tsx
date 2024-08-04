"use client";

import clsx from 'clsx';
import styles from './navigation.module.scss';

import Link from "next/link";
import { FaBook, FaRegQuestionCircle, FaRegUser, FaUserAstronaut } from 'react-icons/fa';
import { User, UserWithPremiumCheck } from '@/app/lib/definitions';

export default function Navigation({ user }: { user: UserWithPremiumCheck }){
  return (
    <div className={clsx(styles, "border-gray-500 border-b-2 flex flex-row flex-wrap gap-4 text-lg px-6 py-2")}>
      <Link className={styles.navLink} href="/"><FaRegQuestionCircle /> Ask</Link>
      <Link className={styles.navLink} href="/book"><FaBook /> Book Search</Link>
      <span className="flex-grow"></span>
      <span className={styles.navUser}>{user.premium ? <FaUserAstronaut /> : <FaRegUser />} {user.name}</span>
    </div>
  )
}
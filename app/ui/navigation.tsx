"use client";

import clsx from 'clsx';
import styles from './navigation.module.css';

import Link from "next/link";

export default function Navigation(){
  return (
    <div className={clsx(styles, "border-gray-500 border-b-2 flex flex-row flex-wrap gap-4 text-lg px-6")}>
      <Link className={styles.navLink} href="/">Home</Link>
      <Link className={styles.navLink} href="/book">Book Search</Link>
    </div>
  )
}
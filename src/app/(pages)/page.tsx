import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/feed'); // 🚀 / 들어오면 바로 /feed로
}
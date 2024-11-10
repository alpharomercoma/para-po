import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home | Para Po!",
};
import Landing from "@/components/home/Landing";
export default function Home() {
  return (
    <>
      <Landing />
    </>
  );
}

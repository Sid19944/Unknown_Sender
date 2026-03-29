import dbConnect from "@/lib/dbConnect";
import Image from "next/image";

export default function Home() {
  dbConnect();

  return <>learn TypeScript with chai or code</>;
}

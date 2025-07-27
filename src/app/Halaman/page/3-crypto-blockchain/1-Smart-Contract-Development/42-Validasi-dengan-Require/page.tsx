"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "42";
  const nextModuleData = Data.find(item => item.id === "43");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
